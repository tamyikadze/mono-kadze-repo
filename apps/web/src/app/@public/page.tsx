import { Button } from '@repo/ui'
import Link from 'next/link'

export default async function HomePage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center gap-4">
      <Button asChild>
        <Link href="/sign-up">Sign up</Link>
      </Button>
      <Button asChild>
        <Link href="/sign-in">Sign in</Link>
      </Button>
    </div>
  )
}
