"use client";

import React from 'react';
import { FcGoogle } from "react-icons/fc";
import { IoLogoGithub } from "react-icons/io";
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';


function AuthButtons() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  return (
    <div className='flex items-center justify-between w-full gap-8'>
      <button className='flex items-center gap-2 border border-stone-400 justify-center w-full py-3 rounded-md hover:bg-stone-600' onClick={() => signIn("google", { callbackUrl: callbackUrl || 'http://localhost:3000' })}>
        <FcGoogle size={20} />
        <span>Google</span>
      </button>
      <button className='flex items-center gap-2 border border-stone-400 justify-center w-full py-3 rounded-md hover:bg-stone-600'>
        <IoLogoGithub size={20} />
        <span>Github</span>
      </button>
    </div>
  );
}

export default AuthButtons;