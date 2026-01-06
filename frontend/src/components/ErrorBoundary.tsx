import { Component } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Body, H2, Small } from './ui/typography'
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-cream">
          <Card variant="default" className="w-full p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-error"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <H2 className="text-charcoal mb-2">Something went wrong</H2>
              <Body className="text-mid-gray">
                We encountered an unexpected error. Please try again.
              </Body>
            </div>

            {this.state.error && (
              <div className="mb-6 p-3 bg-gray-100 rounded-lg text-left">
                <Small className="text-mid-gray font-mono break-all">
                  {this.state.error.message}
                </Small>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Button variant="default" onClick={this.handleReset}>
                Try Again
              </Button>
              <Button
                variant="ghost"
                onClick={() => (window.location.href = '/dashboard')}
              >
                Go to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
