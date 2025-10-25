import { LoginForm } from '@/app/@public/_components/login-form/form.tsx'

import { RegistrationForm } from './_components/registration-form.tsx/form'

export default function Page() {
  return (
    <div className={'flex w-full min-w-svh items-center justify-center'}>
      <RegistrationForm />
      <LoginForm />
    </div>
  )
}
