"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Loader2, ShieldCheck } from "lucide-react"
import { Logo } from "@/components/logo"

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

interface LoginFormProps {
  initialError?: string
}

export function LoginForm({ initialError = "" }: LoginFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(initialError)

  const handleGoogleSignIn = async () => {
    setError("")
    setLoading(true)
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      })
      if (result.error) {
        setError(result.error.message || "Failed to sign in with Google. Please try again.")
        setLoading(false)
      }
    } catch {
      setError("Failed to sign in with Google. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #0f1117 0%, #1a1d27 100%)" }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo showName={false} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-[0.2em]">LTY</h1>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>
            Admin access
          </p>
        </div>

        <div
          className="rounded-2xl p-8 border"
          style={{ background: "#1a1d27", borderColor: "#2a2d3e" }}
        >
          <div
            className="flex items-center gap-2 rounded-xl px-4 py-3 mb-6"
            style={{ background: "#f9731610", border: "1px solid #f9731630" }}
          >
            <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: "#f97316" }} />
            <p className="text-xs" style={{ color: "#94a3b8" }}>
              Admin access is restricted to authorised Google accounts only.
            </p>
          </div>

          {error && (
            <div
              className="rounded-lg px-4 py-3 text-sm mb-4"
              style={{
                background: "#ef444420",
                color: "#ef4444",
                border: "1px solid #ef444440",
              }}
            >
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: loading ? "#1e2230" : "#ffffff",
              color: "#1a1a1a",
              border: "1px solid #e5e7eb",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#64748b" }} />
                <span style={{ color: "#94a3b8" }}>Redirecting to Google...</span>
              </>
            ) : (
              <>
                <GoogleIcon />
                Continue with Google
              </>
            )}
          </button>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#374151" }}>
          LTY Car Salvage · Admin Panel · Restricted Access
        </p>
      </div>
    </div>
  )
}
