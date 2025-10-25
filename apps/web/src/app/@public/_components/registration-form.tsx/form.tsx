'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { signUp } from '@repo/auth'
import { Button, Form, FormControl, FormField, FormItem, FormLabel, Input } from '@repo/ui'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const registrationSchema = z.object({
  email: z.email(),
  name: z.string(),
  password: z.string(),
})

export const RegistrationForm = () => {
  const form = useForm({
    defaultValues: {
      email: '',
      name: '',
      password: '',
    },
    resolver: zodResolver(registrationSchema),
  })

  const { isPending, mutate } = useMutation({
    mutationFn: async (values: z.output<typeof registrationSchema>) => {
      const { data, error } = await signUp.email(values)

      if (error) throw error

      return data
    },
    onError: error => {
      console.warn(error)
    },
  })

  return (
    <div>
      <h1>Login</h1>
      {form.formState.errors && <p>Errors: {JSON.stringify(form.formState.errors)}</p>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(value => mutate(value))}>
          <FormField
            name={'name'}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Name" type="text" />
                </FormControl>
              </FormItem>
            )}
          />
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
            Register
          </Button>
        </form>
      </Form>
    </div>
  )
}
