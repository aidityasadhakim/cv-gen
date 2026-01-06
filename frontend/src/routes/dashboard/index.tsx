import { createFileRoute, Link } from '@tanstack/react-router'
import { useUser } from '@clerk/clerk-react'

import { ProtectedRoute } from '../../components/ProtectedRoute'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}

function DashboardContent() {
  const { user } = useUser()

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName || 'there'}!
          </h1>
          <p className="mt-2 text-gray-600">
            Create AI-powered CVs tailored to your dream job
          </p>
        </div>

        {/* Quick Actions */}
        <div className="px-4 sm:px-0 mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Create New CV Card */}
            <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500 transition-all cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Create New CV
                  </p>
                  <p className="text-sm text-gray-500">
                    Generate a tailored CV for a job posting
                  </p>
                </div>
              </div>
            </div>

            {/* Edit Master Profile Card */}
            <Link
              to="/profile"
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500 transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Master Profile
                  </p>
                  <p className="text-sm text-gray-500">
                    Update your skills and experience
                  </p>
                </div>
              </div>
            </Link>

            {/* View Generated CVs Card */}
            <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500 transition-all cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">My CVs</p>
                  <p className="text-sm text-gray-500">
                    View and edit your generated CVs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity (placeholder) */}
        <div className="px-4 sm:px-0 mt-12">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center py-8">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No CVs yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first tailored CV
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
