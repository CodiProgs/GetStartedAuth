"use client";

import React from 'react';
import { FcGoogle } from "react-icons/fc";
import { signIn } from 'next-auth/react';

function GoogleButton() {
  return (
    <button className='flex items-center gap-2 border border-stone-400 justify-center w-full py-3 rounded-md hover:bg-stone-600' onClick={() => signIn('google', { callbackUrl: '/login/google/success' })}>
      <FcGoogle size={20} />
      <span>Google</span>
    </button>
  );
}

export default GoogleButton;