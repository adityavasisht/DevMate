import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { PromptTemplate } from '@langchain/core/prompts'
import { env } from '../config/env'
import prisma from '../config/db'
import redisClient from '../config/redis'
import { notifyUser } from '../config/socket'
import { findCandidateProfiles } from './embedding.service'

const chatModel = new ChatGoogleGenerativeAI({
  apiKey: env.GEMINI_API_KEY,
  model: 'gemini-2.5-flash',
  temperature: 0.3
})

const matchPrompt = PromptTemplate.fromTemplate(`
You are an expert technical recruiter. Analyze how well each developer matches the job requirements.

JOB POSTING:
Title: {jobTitle}
Description: {jobDescription}
Required Skills: {jobSkills}
Location: {jobLocation}
Salary: {jobSalary}

DEVELOPER CANDIDATES:
{candidates}

For each developer, provide:
1. A match score from 0 to 1 (1 being perfect match)
2. A brief reasoning (2-3 sentences) explaining why they match or don't match

Respond in this exact JSON format:
{{
  "matches": [
    {{
      "profileId": "the profile id",
      "score": 0.85,
      "reasoning": "This developer is a strong match because..."
    }}
  ]
}}

Only respond with the JSON, nothing else.
`)

export const matchDevelopersToJob = async (jobId: string, userId: string) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId }
  })

  if (!job) throw new Error('JOB_NOT_FOUND')
  if (job.userId !== userId) throw new Error('UNAUTHORIZED')

  const cacheKey = `match:job:${jobId}`
  const cachedResult = await redisClient.get(cacheKey)

  if (cachedResult) {
    console.log('⚡ Cache hit — returning cached matches')
    return JSON.parse(cachedResult)
  }

  console.log('🔍 Cache miss — running AI matching')

  const profiles = await findCandidateProfiles(5)

  if (profiles.length === 0) {
    return []
  }

  const candidatesText = profiles.map((profile, index) => `
    Candidate ${index + 1}:
    ID: ${profile.id}
    Name: ${profile.name}
    Skills: ${profile.skills.join(', ')}
    Experience: ${profile.experience} years
    Bio: ${profile.bio || 'Not provided'}
  `).join('\n')

  const formattedPrompt = await matchPrompt.format({
    jobTitle: job.title,
    jobDescription: job.description,
    jobSkills: job.skills.join(', '),
    jobLocation: job.location || 'Not specified',
    jobSalary: job.salary || 'Not specified',
    candidates: candidatesText
  })

  const aiResponse = await chatModel.invoke(formattedPrompt)
  let responseText = aiResponse.content as string

  responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

  const parsed = JSON.parse(responseText)
  const aiMatches = parsed.matches

  const savedMatches = await Promise.all(
    aiMatches.map(async (match: {
      profileId: string
      score: number
      reasoning: string
    }) => {
      const existingMatch = await prisma.match.findFirst({
        where: {
          profileId: match.profileId,
          jobId: jobId
        }
      })

      if (existingMatch) {
        return prisma.match.update({
          where: { id: existingMatch.id },
          data: {
            score: match.score,
            reasoning: match.reasoning
          }
        })
      }

      return prisma.match.create({
        data: {
          profileId: match.profileId,
          jobId: jobId,
          userId: userId,
          score: match.score,
          reasoning: match.reasoning
        }
      })
    })
  )

  const sortedMatches = savedMatches.sort((a, b) => b.score - a.score)

  await redisClient.setEx(
    cacheKey,
    3600,
    JSON.stringify(sortedMatches)
  )
  console.log('💾 Matches cached in Redis for 1 hour')

  for (const match of sortedMatches) {
    const profile = await prisma.profile.findUnique({
      where: { id: match.profileId }
    })

    if (profile) {
      notifyUser(profile.userId, 'new_match', {
        message: `You matched with "${job.title}"!`,
        jobTitle: job.title,
        score: match.score,
        reasoning: match.reasoning,
        jobId: jobId
      })
    }
  }

  return sortedMatches
}

export const getMatchesForJob = async (jobId: string, userId: string) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId }
  })

  if (!job) throw new Error('JOB_NOT_FOUND')
  if (job.userId !== userId) throw new Error('UNAUTHORIZED')

  const matches = await prisma.match.findMany({
    where: { jobId },
    include: { profile: true },
    orderBy: { score: 'desc' }
  })

  return matches
}

export const getMatchesForDeveloper = async (userId: string) => {
  const profile = await prisma.profile.findUnique({
    where: { userId }
  })

  if (!profile) throw new Error('PROFILE_NOT_FOUND')

  const matches = await prisma.match.findMany({
    where: { profileId: profile.id },
    include: {
      job: {
        include: {
          user: { select: { email: true } }
        }
      }
    },
    orderBy: { score: 'desc' }
  })

  return matches
}
