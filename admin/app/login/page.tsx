import { LoginForm } from "./login-form"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const initialError =
    params.error === "unauthorized"
      ? "This Google account is not authorised for admin access."
      : ""

  return <LoginForm initialError={initialError} />
}
