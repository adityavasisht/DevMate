import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { triggerMatchingApi } from '../api/jobs'
import { getJobMatchesApi } from '../api/matches'
import { getJobApplicationsApi } from '../api/applications'
import type { Match, Application } from '../types'
import Navbar from '../components/Navbar'

const JobMatches = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const [matches, setMatches] = useState<Match[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMatching, setIsMatching] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'matches' | 'applications'>('matches')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchData, appData] = await Promise.all([
          getJobMatchesApi(jobId!).catch(() => []),
          getJobApplicationsApi(jobId!).catch(() => [])
        ])
        setMatches(matchData)
        setApplications(appData)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [jobId])

  const handleTriggerMatching = async () => {
    setError('')
    setIsMatching(true)
    try {
      const result = await triggerMatchingApi(jobId!)
      setMatches(result.matches)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setError(e.response?.data?.message || 'Matching failed')
    } finally {
      setIsMatching(false)
    }
  }

  const renderProfile = (match: Match) => {
    const github = match.profile?.github
    const portfolio = match.profile?.portfolio
    const experience = match.profile?.experience

    return (
      <div className="flex items-center gap-4 text-xs text-gray-400">
        {experience !== undefined && (
          <span>{experience} yr{experience !== 1 ? 's' : ''} experience</span>
        )}
        {github && typeof github === 'string' && (
          <a href={github} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            GitHub
          </a>
        )}
        {portfolio && typeof portfolio === 'string' && (
          <a href={portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            Portfolio
          </a>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Candidates</h2>
            <p className="text-gray-500 mt-1">AI matches and manual applicants</p>
          </div>
          <button
            onClick={handleTriggerMatching}
            disabled={isMatching}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isMatching ? 'Running AI...' : 'Find AI Matches'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'matches'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            AI Matches ({matches.length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'applications'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Applicants ({applications.length})
          </button>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-400 py-20">Loading...</div>
        ) : activeTab === 'matches' ? (
          matches.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <p className="text-gray-600 font-medium mb-2">No AI matches yet</p>
              <p className="text-gray-400 text-sm">Click Find AI Matches to run matching</p>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match, index) => (
                <div key={match.id} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 text-sm">#{index + 1}</span>
                      <h3 className="font-semibold text-gray-900">
                        {match.profile?.name || 'Developer'}
                      </h3>
                    </div>
                    <span className={`text-sm font-bold px-4 py-1 rounded-full ${
                      match.score >= 0.8
                        ? 'bg-green-100 text-green-700'
                        : match.score >= 0.6
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {Math.round(match.score * 100)}% match
                    </span>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-blue-600 font-medium mb-1">AI Reasoning</p>
                    <p className="text-sm text-blue-800">{match.reasoning}</p>
                  </div>
                  {match.profile?.skills && (
                    <div className="flex gap-2 flex-wrap mb-3">
                      {match.profile.skills.map((skill) => (
                        <span key={skill} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  {renderProfile(match)}
                </div>
              ))}
            </div>
          )
        ) : (
          applications.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <p className="text-gray-600 font-medium mb-2">No applicants yet</p>
              <p className="text-gray-400 text-sm">Developers who apply will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900">
                      {app.profile?.name || 'Developer'}
                    </h3>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
                      {app.status}
                    </span>
                  </div>
                  {app.profile?.skills && (
                    <div className="flex gap-2 flex-wrap mb-3">
                      {app.profile.skills.map((skill) => (
                        <span key={skill} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-400">
                    Applied {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  )
}

export default JobMatches
