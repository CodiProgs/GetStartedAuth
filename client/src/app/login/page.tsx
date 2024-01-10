import LogInForm from '@/components/LogInForm';
import React from 'react';
import { FcGoogle } from "react-icons/fc";
import { IoLogoGithub } from "react-icons/io";

function page() {
  return (
    <div className='max-w-xl mx-auto py-6 bg-themeColorBgSoft absolute top-1/4 left-0 right-0 h-max w-full'>
      <div className='w-[80%] mx-auto flex flex-col items-center'>
        <h1 className="text-3xl font-bold capitalize mb-8">Sign in with</h1>
        <div className='flex items-center justify-between w-full gap-8'>
          <button className='flex items-center gap-2 border border-stone-400 justify-center w-full py-3 rounded-md hover:bg-stone-600'>
            <FcGoogle size={20} />
            <span>Google</span>
          </button>
          <button className='flex items-center gap-2 border border-stone-400 justify-center w-full py-3 rounded-md hover:bg-stone-600'>
            <IoLogoGithub size={20} />
            <span>Github</span>
          </button>
        </div>
        <div className='my-4 text-stone-300'>- OR -</div>
        <LogInForm />
      </div>
    </div>
  );
}

export default page;