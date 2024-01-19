"use client"

import React from 'react';
import Input from './Input';
import { useMutation } from '@apollo/client';
import { UPDATE_USER } from '@/graphql/mutation/UpdateUser';
import { UpdateUserMutation } from '@/gql/graphql';
import { GraphQLErrorExtensions } from 'graphql';
import { useSession } from 'next-auth/react';

function UpdateUser() {
  const { data, update } = useSession();
  const [updateUser] = useMutation<UpdateUserMutation>(UPDATE_USER);
  const [errors, setErrors] = React.useState<GraphQLErrorExtensions>({});

  const [updateData, setUpdateData] = React.useState({
    name: '',
    nickname: '',
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({})
    const response = await updateUser({
      variables: {
        name: updateData.name ? updateData.name : undefined,
        nickname: updateData.nickname ? updateData.nickname : undefined
      }
    }).catch(error => {
      if (error && error.graphQLErrors[0] && error.graphQLErrors[0].extensions) {
        setErrors(error.graphQLErrors[0].extensions)
      }
    })

    if (response && response.data) {
      await update({
        name: response.data.updateUser.name,
        nickname: response.data.updateUser.nickname
      })
    }
  }

  return (
    <form className='flex flex-col w-full gap-4' onSubmit={onSubmit}>
      <Input type="text" label='Name' value={data?.user?.name!} onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })} error={errors?.name as string} />
      <Input type="text" label='Nickname' value={data?.user?.nickname!} onChange={(e) => setUpdateData({ ...updateData, nickname: e.target.value })} error={errors?.nickname as string} />
      <div className='flex justify-between items-center gap-4'>
        <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-10 text-center rounded'>Update</button>
      </div>
    </form>
  );
}

export default UpdateUser;