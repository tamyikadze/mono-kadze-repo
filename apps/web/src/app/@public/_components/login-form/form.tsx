'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from '@repo/auth'
import { Button, Form, FormControl, FormField, FormItem, FormLabel, Input } from '@repo/ui'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
})

export const LoginForm = () => {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  })

  const { isPending, mutate } = useMutation({
    mutationFn: (data: z.output<typeof loginSchema>) => signIn.email(data),
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
          <Button isPending={isPending} type="submit">
            Login
          </Button>
        </form>
      </Form>
    </div>
  )
}
