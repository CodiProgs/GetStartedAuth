"use client";

import { ApolloProvider } from '@apollo/client';
import React from 'react';
import { client } from './apolloClient';
import { SessionProvider } from 'next-auth/react';

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <SessionProvider>
        {children}
      </SessionProvider>
    </ApolloProvider>
  );
}

export default Providers;