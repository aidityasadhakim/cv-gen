import { createFileRoute } from '@tanstack/react-router'

import { ProtectedRoute } from '../../components/ProtectedRoute'
import { ProfileLayout } from '../../components/profile/ProfileLayout'

export const Route = createFileRoute('/profile/')({
  component: ProfilePage,
})

function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileLayout />
    </ProtectedRoute>
  )
}
