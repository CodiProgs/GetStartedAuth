"use client"

import { GetUserProfileQuery } from '@/gql/graphql';
import { GET_USER_PROFILE } from '@/graphql/queries/GetUserProfile';
import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import React from 'react';

function GetUserProfile() {
  const nickname = useParams()?.nickname || '';
  const { data, loading, error } = useQuery<GetUserProfileQuery>(GET_USER_PROFILE, { variables: { nickname } })
  return (
    <div>
      {!loading ? (
        !error ? (
          <div>
            <h1>{data?.getUserProfile?.name}</h1>
            <p>Email: {data?.getUserProfile?.email}</p>
          </div>
        ) : (
          error.message === 'Unauthorized' ? (
            <p>You are not authorized</p>
          ) : (
            <p>User not found</p>
          )
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default GetUserProfile;