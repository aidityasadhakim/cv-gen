import { createFileRoute, Link } from '@tanstack/react-router'
import { SignedIn, SignedOut } from '@clerk/clerk-react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Create AI-Powered CVs
              <br />
              <span className="text-indigo-200">Tailored to Your Dream Job</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-indigo-100 max-w-3xl mx-auto">
              Stop sending generic resumes. CV-Gen analyzes job postings and
              creates perfectly tailored CVs that highlight your most relevant
              experience.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <SignedOut>
                <Link
                  to="/auth/sign-up"
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-indigo-700 bg-white hover:bg-indigo-50 transition-colors shadow-lg"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/auth/sign-in"
                  className="inline-flex items-center justify-center px-8 py-3 border border-white/30 text-base font-medium rounded-lg text-white hover:bg-white/10 transition-colors"
                >
                  Sign In
                </Link>
              </SignedOut>
              <SignedIn>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-indigo-700 bg-white hover:bg-indigo-50 transition-colors shadow-lg"
                >
                  Go to Dashboard
                </Link>
              </SignedIn>
            </div>
            <p className="mt-4 text-sm text-indigo-200">
              10 free generations to start. No credit card required.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">
              Three simple steps to your perfect CV
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Create Your Master Profile
              </h3>
              <p className="text-gray-600">
                Enter all your experience, skills, and achievements once. Our
                system stores everything securely.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Paste the Job URL
              </h3>
              <p className="text-gray-600">
                Our AI analyzes the job posting to understand exactly what the
                employer is looking for.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Get Your Tailored CV
              </h3>
              <p className="text-gray-600">
                Receive a professionally formatted CV that highlights your most
                relevant qualifications.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Stand Out from the Competition
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600">
                    <strong className="text-gray-900">ATS-Optimized:</strong>{' '}
                    Your CV passes automated screening systems
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600">
                    <strong className="text-gray-900">Keyword Matching:</strong>{' '}
                    Automatically includes relevant keywords from job postings
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600">
                    <strong className="text-gray-900">
                      Professional Templates:
                    </strong>{' '}
                    Clean, modern designs that impress recruiters
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600">
                    <strong className="text-gray-900">Cover Letters:</strong>{' '}
                    Generate matching cover letters with one click
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-6">
                  <svg
                    className="w-10 h-10 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Start Free Today
                </h3>
                <p className="text-gray-600 mb-6">
                  Get 10 free CV generations. No credit card required.
                </p>
                <SignedOut>
                  <Link
                    to="/auth/sign-up"
                    className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                  >
                    Create Your Free Account
                  </Link>
                </SignedOut>
                <SignedIn>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                  >
                    Go to Dashboard
                  </Link>
                </SignedIn>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-white font-semibold text-lg mb-2">CV-Gen</h3>
            <p className="text-sm">
              AI-powered CV generation for your dream job
            </p>
            <p className="text-sm mt-4">
              &copy; {new Date().getFullYear()} CV-Gen. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
