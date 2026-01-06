import { Link } from '@tanstack/react-router'
import { SignedIn, SignedOut } from '@clerk/clerk-react'

import { useState } from 'react'
import { Home, Menu, X, LayoutDashboard, LogIn, UserPlus } from 'lucide-react'

import { UserMenu } from './UserMenu'
import { Button } from './ui/button'
import { Container } from './ui/container'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 h-[80px] flex items-center"
        style={{
          background: 'var(--nav-backdrop)',
          backdropFilter: 'blur(var(--nav-blur))',
          WebkitBackdropFilter: 'blur(var(--nav-blur))',
        }}
      >
        <Container maxWidth="2xl" padding={false}>
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsOpen(true)}
                className="p-2 hover:bg-charcoal/5 rounded-lg transition-colors lg:hidden"
                aria-label="Open menu"
              >
                <Menu size={24} className="text-charcoal" />
              </button>
              <Link to="/" className="hover:opacity-80 transition-opacity">
                <span className="font-display text-xl font-bold text-charcoal">
                  CV-Gen
                </span>
              </Link>
            </div>

            <nav className="hidden lg:flex items-center gap-1">
              <Link
                to="/"
                className="px-4 py-2 text-charcoal hover:text-amber transition-colors font-medium rounded-lg hover:bg-charcoal/5"
                activeProps={{
                  className: "text-amber",
                }}
              >
                Home
              </Link>
              <SignedIn>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-charcoal hover:text-amber transition-colors font-medium rounded-lg hover:bg-charcoal/5"
                  activeProps={{
                    className: "text-amber",
                  }}
                >
                  Dashboard
                </Link>
              </SignedIn>
            </nav>

            <div className="flex items-center gap-3">
              <SignedOut>
                <Link to="/auth/sign-in">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link to="/auth/sign-up">
                  <Button size="sm">
                    Get started
                  </Button>
                </Link>
              </SignedOut>
              <SignedIn>
                <UserMenu />
              </SignedIn>
            </div>
          </div>
        </Container>
      </header>

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-warm-white shadow-dramatic z-50 transform transition-transform duration-300 ease-smooth flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <span className="font-display text-lg font-bold text-charcoal">
            Navigation
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-charcoal/5 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} className="text-charcoal" />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-charcoal/5 transition-colors mb-2"
            activeProps={{
              className: "flex items-center gap-3 p-3 rounded-lg bg-amber/10 text-amber-dark font-medium",
            }}
          >
            <Home size={20} />
            <span>Home</span>
          </Link>

          <SignedIn>
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-charcoal/5 transition-colors mb-2"
              activeProps={{
                className: "flex items-center gap-3 p-3 rounded-lg bg-amber/10 text-amber-dark font-medium",
              }}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
          </SignedIn>

          <SignedOut>
            <div className="pt-4 border-t border-border mt-4">
              <Link
                to="/auth/sign-in"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-charcoal/5 transition-colors mb-2"
              >
                <LogIn size={20} />
                <span>Sign In</span>
              </Link>

              <Link
                to="/auth/sign-up"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg bg-amber text-charcoal font-semibold hover:bg-amber-dark transition-colors"
              >
                <UserPlus size={20} />
                <span>Sign Up</span>
              </Link>
            </div>
          </SignedOut>
        </nav>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-charcoal/40 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
