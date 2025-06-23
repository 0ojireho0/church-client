import { Suspense } from "react"
import ResetPasswordClient from "./ResetPasswordClient"
function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>} >
      <ResetPasswordClient />
    </Suspense>
  )
}

export default ResetPasswordPage
