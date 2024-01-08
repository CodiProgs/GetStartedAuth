"use client"

import { GetUserProfileQuery } from '@/gql/graphql';
import { GET_USER_PROFILE } from '@/graphql/queries/GetUserProfile';
import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import React from 'react';

function GetUserProfile() {
  const idOrEmail = useParams()?.idOrEmail || '';
  const { data, loading, error } = useQuery<GetUserProfileQuery>(GET_USER_PROFILE, { variables: { idOrEmail } })
  return (
    <div>
      {!loading ? (
        !error ? (
          <div>
            <h1>{data?.getUserProfile?.name}</h1>
            <p>Email: {data?.getUserProfile?.email}</p>
          </div>
        ) : (
          <p>Error: {error.message}</p>
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default GetUserProfile;