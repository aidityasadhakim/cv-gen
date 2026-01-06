import { createFileRoute } from '@tanstack/react-router'
import { SignUp } from '@clerk/clerk-react'

export const Route = createFileRoute('/auth/sign-up')({
  component: SignUpPage,
})

function SignUpPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Get 10 free CV generations to start
          </p>
        </div>
        <div className="flex justify-center">
          <SignUp
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'shadow-none',
              },
            }}
            signInUrl="/auth/sign-in"
            forceRedirectUrl="/dashboard"
          />
        </div>
      </div>
    </div>
  )
}
