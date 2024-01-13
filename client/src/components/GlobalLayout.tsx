"use client";

import Header from '@/components/Header';
import { usePathname } from 'next/navigation';
import React from 'react';

function GlobalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const array = ['/admin', '/login/google/success'] // '/register', '/login',
  return (
    <>
      {array.includes(pathname) ?
        (<>{children}</>) : (
          <div className='max-w-7xl mx-auto'>
            <Header />
            {children}
          </div>
        )}
    </>
  );
}

export default GlobalLayout;