"use client"

import { GoogleAuthMutation } from '@/gql/graphql';
import { GOOGLE_AUTH } from '@/graphql/mutation/GoogleAuth';
import { useMutation } from '@apollo/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

function GoogleAuth() {
  const [googleAuth] = useMutation<GoogleAuthMutation>(GOOGLE_AUTH);
  const { data, update, status } = useSession();

  const { push } = useRouter()
  const [mounted, setMounted] = React.useState(false)

  const handleAuth = async () => {
    const res = await googleAuth({
      variables: { token: data?.user.token }
    })
    if (res && res.data) {
      update({
        ...res.data.googleAuth,
        token: undefined
      })
      if (typeof window !== "undefined") {
        window.localStorage.setItem("token", res.data?.googleAuth.token!);
      }
      push('/user/' + res.data.googleAuth.nickname)
    }
  }

  useEffect(() => {
    if (status !== 'loading') {
      if (data?.user.token) {
        setMounted(true)
        handleAuth()
      } else {
        if (status === 'unauthenticated') {
          push('/login')
        } else {
          push('/user/' + data?.user.nickname)
        }
      }
    }
  }, [status])
  if (mounted) {
    return (
      <div className='absolute top-1/4 left-0 right-0 mx-auto flex justify-center flex-col items-center gap-4'>
        <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'>
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
        <div className='text-stone-300'>Authenticating...</div>
      </div>
    );
  }
}

export default GoogleAuth;