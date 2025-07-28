"use client"

import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AlertCircle, ArrowLeft } from 'lucide-react'

export default function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'OAuthAccountNotLinked':
        return 'This email is already associated with another account. Please sign in with your original method.'
      case 'AccessDenied':
        return 'Access denied. You cancelled the authentication or don\'t have permission.'
      case 'OAuthCallback':
        return 'There was an error during Google authentication. Please try again.'
      case 'Configuration':
        return 'There is a problem with the authentication configuration.'
      case 'CredentialsSignin':
        return 'Invalid email or password. Please check your credentials.'
      default:
        return 'An unexpected error occurred during authentication. Please try again.'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Authentication Error
        </h1>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          {getErrorMessage(error)}
        </p>
        
        <div className="space-y-4">
          <Button asChild className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-gray-800">
            <Link href="/login">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="w-full">
            <Link href="/">
              Go to Homepage
            </Link>
          </Button>
        </div>
        
        {error && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-500">
              Error Code: <code className="font-mono bg-gray-200 px-2 py-1 rounded">{error}</code>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}