'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from '@repo/auth'
import { Button, Form, FormControl, FormField, FormItem, FormLabel, Input, Spinner } from '@repo/ui'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const LoginForm = () => {
  const router = useRouter()
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  })

  const { isPending, mutate } = useMutation({
    mutationFn: async (values: z.output<typeof loginSchema>) => {
      const { data, error } = await signIn.email(values)

      if (error) throw error

      return data
    },
    onError: error => {
      console.warn(error)
    },
    onSuccess: () => {
      // Redirect to home/dashboard after successful login
      router.push('/')
      router.refresh()
    },
  })

  return (
    <div>
      <h1>Login</h1>
      {form.formState.errors && <p>Errors: {JSON.stringify(form.formState.errors)}</p>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(value => mutate(value))}>
          <FormField
            name={'email'}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Email" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name={'password'}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Password" type="password" />
                </FormControl>
              </FormItem>
            )}
          />
          <Button disabled={isPending} type="submit">
            Login {isPending && <Spinner />}
          </Button>
        </form>
      </Form>
    </div>
  )
}
