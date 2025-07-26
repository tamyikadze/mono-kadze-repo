'use client'

import { InsertIntoUsersInput, insertUserSchema } from '@apps/db/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, FormControl, FormField, FormItem, FormLabel, Input } from '@repo/ui'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

import { register } from './action'

export const RegistrationForm = () => {
  const form = useForm<InsertIntoUsersInput>({
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
    },
    resolver: zodResolver(insertUserSchema),
  })

  const { isPending, mutate } = useMutation({
    mutationFn: (data: InsertIntoUsersInput) => register(data),
  })

  return (
    <div>
      <h1>Login</h1>
      {form.formState.errors && <p>Errors: {JSON.stringify(form.formState.errors)}</p>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(value => mutate(value))}>
          <FormField
            name={'firstName'}
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="First name" type="text" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name={'lastName'}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Last name" type="text" />
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
