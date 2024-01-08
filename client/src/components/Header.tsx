"use client";

import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import SignOutButton from './SignOutButton';

function Header() {
  const { data, status } = useSession()
  return (
    <header className='flex justify-between items-center py-4'>
      <Link href="/">Home</Link>
      {status !== 'loading' ? (status === 'authenticated' ? (
        <div>
          <Link href={`/user/${data.user?.nickname}`}>{data.user?.name}</Link>
          <SignOutButton />
        </div>
      ) : (
        <button onClick={() => signIn()} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded'>Login</button>
      )) : (
        <p>Loading...</p>
      )}
    </header>
  );
}

export default Header;