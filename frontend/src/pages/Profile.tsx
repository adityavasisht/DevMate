import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getMyProfileApi, createProfileApi, updateProfileApi } from '../api/profile'
import type { Profile } from '../types'
import Navbar from '../components/Navbar'

const ProfilePage = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Form state
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [skillsInput, setSkillsInput] = useState('')
  const [experience, setExperience] = useState(0)
  const [github, setGithub] = useState('')
  const [portfolio, setPortfolio] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfileApi()
        setProfile(data)
        // Pre-fill form with existing data
        setName(data.name)
        setBio(data.bio || '')
        setSkillsInput(data.skills.join(', '))
        setExperience(data.experience)
        setGithub(data.github || '')
        setPortfolio(data.portfolio || '')
      } catch {
        // Profile doesn't exist yet — that's fine, show empty form
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setIsSaving(true)

    // Convert comma-separated skills string to array
    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    try {
      const data = { name, bio, skills, experience, github, portfolio }

      if (profile) {
        const updated = await updateProfileApi(data)
        setProfile(updated)
        setMessage('Profile updated successfully!')
      } else {
        const created = await createProfileApi(data)
        setProfile(created)
        setMessage('Profile created successfully!')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save profile')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20 text-gray-400">
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {profile ? 'Edit Profile' : 'Create Profile'}
        </h2>
        <p className="text-gray-500 mb-8">
          Your profile is used by AI to match you with relevant jobs
        </p>

        {message && (
          <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Aditya Vasisht"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Full stack developer from Bangalore with experience in..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills * <span className="text-gray-400 font-normal">(comma separated)</span>
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Node.js, React, TypeScript, PostgreSQL"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience
            </label>
            <input
              type="number"
              value={experience}
              onChange={(e) => setExperience(Number(e.target.value))}
              min={0}
              max={30}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GitHub URL
            </label>
            <input
              type="url"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://github.com/username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Portfolio URL
            </label>
            <input
              type="url"
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://myportfolio.com"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isSaving ? 'Saving...' : profile ? 'Update Profile' : 'Create Profile'}
          </button>
        </form>
      </main>
    </div>
  )
}

export default ProfilePage