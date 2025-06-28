import { LoginForm } from './_components/login-form'
import { RegistrationForm } from './_components/registration-form'

const Page = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <LoginForm />
      <RegistrationForm />
    </div>
  )
}

export default Page
