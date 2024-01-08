"use client";

import { ApolloProvider } from '@apollo/client';
import React from 'react';
import { client } from './apolloClient';
import { SessionProvider } from 'next-auth/react';
import ErrorHandler from '@/components/ErrorHandler';

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <SessionProvider>
        <ErrorHandler>
          {children}
        </ErrorHandler>
      </SessionProvider>
    </ApolloProvider>
  );
}

export default Providers;