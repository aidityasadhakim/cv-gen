import { UserButton, useUser } from '@clerk/clerk-react'

export function UserMenu() {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-700 hidden sm:inline">
        {user.firstName || user.emailAddresses[0]?.emailAddress}
      </span>
      <UserButton
        afterSignOutUrl="/"
        appearance={{
          elements: {
            avatarBox: 'h-8 w-8',
          },
        }}
      />
    </div>
  )
}
