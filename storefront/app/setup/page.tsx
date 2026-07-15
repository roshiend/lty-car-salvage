import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

// This page is used ONCE to create the initial admin account
// After creating your account, you should delete this file for security

export default async function SetupPage() {
  // Check if already logged in
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect("/admin")

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SetupForm />
      </div>
    </div>
  )
}

function SetupForm() {
  return (
    <form action={createAdmin} className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Initial Setup</h1>
        <p className="text-muted-foreground mt-2">
          Create your admin account. This page should be deleted after setup.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground"
            placeholder="Your name"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground"
            placeholder="admin@yourdomain.com"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground"
            placeholder="Min. 8 characters"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md font-medium hover:bg-primary/90 transition-colors"
      >
        Create Admin Account
      </button>
      
      <p className="text-xs text-muted-foreground text-center">
        After creating your account, delete the /app/setup folder for security.
      </p>
    </form>
  )
}

async function createAdmin(formData: FormData) {
  "use server"
  
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    // Use Better Auth's internal signup
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    })
    
    redirect("/sign-in")
  } catch (error) {
    console.error("Failed to create admin:", error)
    throw new Error("Failed to create admin account")
  }
}
