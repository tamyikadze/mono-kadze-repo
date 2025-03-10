'use client'

import { useForm } from "react-hook-form"
import {Button, Form, FormControl, FormField, FormItem, FormLabel, Input} from "@repo/ui";
import {zodResolver} from '@hookform/resolvers/zod'
import {useMutation} from "@tanstack/react-query";
import { register } from "./action";
import { InsertIntoUsersInput, insertUserSchema } from "../../../../../../db/src/schemas";


export const RegistrationForm = () => {
  const form = useForm<InsertIntoUsersInput>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: ''
    }
  })

  const {mutate, isPending} = useMutation({
    mutationFn: (data: InsertIntoUsersInput) => register(data)
  },
  )

  return <div>
    <h1>Login</h1>
    {form.formState.errors && <p>Errors: {JSON.stringify(form.formState.errors)}</p>}
    <Form {...form}>
      <form onSubmit={form.handleSubmit((value) => mutate(value))}>
        <FormField render={({field}) => (
          <FormItem>
            <FormLabel>First name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="First name" type="text"/>
            </FormControl>
          </FormItem>
        )} name={'firstName'}/>
        <FormField render={({field}) => (
          <FormItem>
            <FormLabel>Last name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Last name" type="text"/>
            </FormControl>
          </FormItem>
        )} name={'lastName'}/>
        <FormField render={({field}) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Email"/>
            </FormControl>
          </FormItem>
        )} name={'email'}/>
        <FormField render={({field}) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Password" type="password"/>
            </FormControl>
          </FormItem>
        )} name={'password'}/>
        <Button type="submit" isPending={isPending}>Register</Button>
      </form>
    </Form>
  </div>
}
