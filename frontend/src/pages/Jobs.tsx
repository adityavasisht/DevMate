import { useEffect, useState } from 'react'
import { getAllJobsApi } from '../api/jobs'
import { applyToJobApi } from '../api/applications'
import type { Job } from '../types'
import Navbar from '../components/Navbar'

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [applyingTo, setApplyingTo] = useState<string | null>(null)
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set())
  const [messages, setMessages] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getAllJobsApi()
        setJobs(data)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const handleApply = async (jobId: string) => {
    setApplyingTo(jobId)

    try {
      await applyToJobApi(jobId)
      setAppliedJobs((prev) => new Set([...prev, jobId]))
      setMessages((prev) => ({ ...prev, [jobId]: 'Applied successfully!' }))
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to apply'
      setMessages((prev) => ({ ...prev, [jobId]: msg }))
    } finally {
      setApplyingTo(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse Jobs</h2>
        <p className="text-gray-500 mb-8">
          {jobs.length} job{jobs.length !== 1 ? 's' : ''} available
        </p>

        {isLoading ? (
          <div className="text-center text-gray-400 py-20">Loading...</div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
            No jobs posted yet
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-200 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">{job.title}</h3>
                  {job.salary && (
                    <span className="text-sm text-green-600 font-medium">
                      ₹{job.salary}
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {job.description}
                </p>

                <div className="flex gap-2 flex-wrap mb-4">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    {job.location && <span>📍 {job.location}</span>}
                    <span>Posted by {job.user?.email}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {messages[job.id] && (
                      <span className={`text-xs ${
                        appliedJobs.has(job.id)
                          ? 'text-green-600'
                          : 'text-red-500'
                      }`}>
                        {messages[job.id]}
                      </span>
                    )}
                    <button
                      onClick={() => handleApply(job.id)}
                      disabled={applyingTo === job.id || appliedJobs.has(job.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        appliedJobs.has(job.id)
                          ? 'bg-green-100 text-green-700 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                      }`}
                    >
                      {appliedJobs.has(job.id)
                        ? '✓ Applied'
                        : applyingTo === job.id
                        ? 'Applying...'
                        : 'Apply'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Jobs