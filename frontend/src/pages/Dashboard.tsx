import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMyMatchesApi } from '../api/matches'
import { getAllJobsApi } from '../api/jobs'
import { getMyApplicationsApi } from '../api/applications'
import type { Match, Job, Application } from '../types'
import Navbar from '../components/Navbar'
import Toast from '../components/Toast'
import { useSocket } from '../hooks/useSocket'
import { useToast } from '../hooks/useToast'

const Dashboard = () => {
  const { user } = useAuth()
  const [matches, setMatches] = useState<Match[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'matches' | 'applications'>('matches')
  const { toasts, addToast, removeToast } = useToast()

  useSocket((data) => {
    addToast(data.message, `Match score: ${Math.round(data.score * 100)}%`)
    getMyMatchesApi().then(setMatches).catch(() => {})
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.role === 'DEVELOPER') {
          const [matchData, appData] = await Promise.all([
            getMyMatchesApi().catch(() => []),
            getMyApplicationsApi().catch(() => [])
          ])
          setMatches(matchData)
          setApplications(appData)
        } else {
          const data = await getAllJobsApi()
          setJobs(data)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {user?.role === 'DEVELOPER' ? 'My Dashboard' : 'Your Job Postings'}
          </h2>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-400 py-20">Loading...</div>
        ) : user?.role === 'DEVELOPER' ? (
          <DeveloperDashboard
            matches={matches}
            applications={applications}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        ) : (
          <CompanyDashboard jobs={jobs} />
        )}
      </main>

      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          subtitle={toast.subtitle}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

interface DeveloperDashboardProps {
  matches: Match[]
  applications: Application[]
  activeTab: 'matches' | 'applications'
  setActiveTab: (tab: 'matches' | 'applications') => void
}

const DeveloperDashboard = ({
  matches,
  applications,
  activeTab,
  setActiveTab,
}: DeveloperDashboardProps) => {
  return (
    <div>
      {/* Tabs */}
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
          My Applications ({applications.length})
        </button>
      </div>

      {activeTab === 'matches' ? (
        <MatchesList matches={matches} />
      ) : (
        <ApplicationsList applications={applications} />
      )}
    </div>
  )
}

const MatchesList = ({ matches }: { matches: Match[] }) => {
  if (matches.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-400 mb-4">No AI matches yet</p>
        <p className="text-sm text-gray-400 mb-6">
          Create your profile so companies can match you with their jobs
        </p>
        <Link
          to="/profile"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Create Profile
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <div key={match.id} className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-gray-900">
              {match.job?.title || 'Job Title'}
            </h3>
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
              match.score >= 0.8
                ? 'bg-green-100 text-green-700'
                : match.score >= 0.6
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {Math.round(match.score * 100)}% match
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-3">{match.reasoning}</p>
          <div className="flex gap-2 flex-wrap">
            {match.job?.skills.map((skill) => (
              <span
                key={skill}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                {skill}
              </span>
            ))}
          </div>
          {match.job?.location && (
            <p className="text-xs text-gray-400 mt-3">
              📍 {match.job.location}
              {match.job.salary && ` · ₹${match.job.salary}`}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

const ApplicationsList = ({ applications }: { applications: Application[] }) => {
  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-400 mb-4">No applications yet</p>
        <Link
          to="/jobs"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Browse Jobs
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <div key={app.id} className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900">
              {app.job?.title || 'Job Title'}
            </h3>
            <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
              {app.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {app.job?.description}
          </p>
          {app.job?.skills && (
            <div className="flex gap-2 flex-wrap mb-3">
              {app.job.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-400">
            {app.job?.location && `📍 ${app.job.location} · `}
            Applied {new Date(app.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  )
}

const CompanyDashboard = ({ jobs }: { jobs: Job[] }) => {
  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-400 mb-4">No jobs posted yet</p>
        <Link
          to="/post-job"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Post Your First Job
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div key={job.id} className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900">{job.title}</h3>
            <Link
              to={`/jobs/${job.id}/matches`}
              className="text-sm text-blue-600 hover:underline"
            >
              View Matches & Applicants →
            </Link>
          </div>
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{job.description}</p>
          <div className="flex gap-2 flex-wrap">
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                {skill}
              </span>
            ))}
          </div>
          {job.location && (
            <p className="text-xs text-gray-400 mt-3">
              📍 {job.location}
              {job.salary && ` · ₹${job.salary}`}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

export default Dashboard