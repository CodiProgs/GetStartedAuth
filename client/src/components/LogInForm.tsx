"use client";

import React from 'react';
import Input from './Input';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { LoginMutation } from '@/gql/graphql';
import { LOGIN } from '@/graphql/mutation/Login';
import { GraphQLErrorExtensions } from 'graphql';
import { signIn } from 'next-auth/react';

function LogInForm() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/profile";

  const [login, { data, loading, error }] = useMutation<LoginMutation>(LOGIN);
  const [errors, setErrors] = React.useState<GraphQLErrorExtensions>({});

  const [loginData, setLoginData] = React.useState({
    email: '',
    password: '',
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({})
    const response = await login({
      variables: {
        password: loginData.password,
        email: loginData.email,
      }
    }).catch(error => {
      if (error && error.graphQLErrors[0].extensions) {
        setErrors(error.graphQLErrors[0].extensions)
      }
    })

    if (response && response.data) {
      const res = await signIn("credentials", {
        redirect: false,
        email: response.data?.login.email,
        avatar: response.data?.login.avatar,
        name: response.data?.login.name,
        nickname: response.data?.login.nickname,
        id: response.data?.login.id,
        callbackUrl,
      });
      setLoginData({ email: "", password: "" });
      if (typeof window !== "undefined") {
        window.localStorage.setItem("token", response.data?.login.token!);
      }
      if (!res?.error) {
        router.push(callbackUrl);
      }
    }
  };
  return (
    <form className='flex flex-col w-full gap-4' onSubmit={onSubmit}>
      <Input type="email" label="Email" onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} error={errors?.email as string} />
      <Input type="password" label="Password" onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} error={errors?.password as string} />
      {errors?.invalidCredentials! && <p className='text-red-500 text-sm'>{errors?.invalidCredentials as string}</p>}
      <div className='flex justify-between items-center gap-4'>
        <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-10 text-center rounded '>Sign in</button>
        <Link href="/register" className='hover:text-blue-500 p-2'>Create an account</Link>
      </div>
    </form>
  );
}

export default LogInForm;