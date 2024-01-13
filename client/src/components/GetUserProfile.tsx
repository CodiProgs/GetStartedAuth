"use client"

import { GetUserProfileQuery } from '@/gql/graphql';
import { GET_USER_PROFILE } from '@/graphql/queries/GetUserProfile';
import { useQuery } from '@apollo/client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';
import { IoMdSettings } from "react-icons/io";

function GetUserProfile() {
  const nickname = useParams()?.nickname || '';
  const { data, loading, error } = useQuery<GetUserProfileQuery>(GET_USER_PROFILE, { variables: { nickname } })
  const { data: sessionData } = useSession()
  return (
    <div>
      {!loading ? (
        !error ? (
          <div className='flex gap-8 items-center'>
            <div>
              <h1>{data?.getUserProfile?.name}</h1>
              <p>Email: {data?.getUserProfile?.email}</p>
            </div>
            {sessionData?.user?.id === data?.getUserProfile?.id && (
              <Link href={'/settings'} className='group p-2'>
                <IoMdSettings size={24} className='text-themeColorTextSoft group-hover:text-themeColorText' />
              </Link>
            )}
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