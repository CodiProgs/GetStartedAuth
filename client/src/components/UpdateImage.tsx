"use client";

import { UpdateImageMutation } from '@/gql/graphql';
import { UPDATE_IMAGE } from '@/graphql/mutation/UpdateImage';
import { URL_SERVER } from '@/utils/variables';
import { useMutation } from '@apollo/client';
import { GraphQLErrorExtensions } from 'graphql';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';
import { HiOutlinePhoto } from 'react-icons/hi2';

function UpdateImage() {
  const [updateImage] = useMutation<UpdateImageMutation>(UPDATE_IMAGE)
  const { update, data, status } = useSession()
  const [errors, setErrors] = React.useState<GraphQLErrorExtensions>({});
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const response = await updateImage({
        variables: {
          image: e.target.files[0]
        }
      }).catch(error => {
        if (error && error.graphQLErrors[0].extensions) {
          setErrors(error.graphQLErrors[0].extensions)
        }
      })
      response && response.data && update({
        avatar: response.data.updateImage
      })
    }
  }

  return (
    <div className='py-4'>
      <h2 className='text-2xl text-center mb-2'>Update avatar</h2>
      <label htmlFor="fileInput" className='relative group rounded-full'>
        {status !== 'loading' && data?.user.avatar !== 'null' ? (
          <Image width={1920} height={1080} src={data!.user?.avatar!.indexOf('http') === -1 ? URL_SERVER + data!.user?.avatar! : data!.user.avatar!} alt="" className='w-[200px] h-[200px] object-cover rounded-full cursor-pointer group-hover:shadow-[0_0_0_3px_#ffffff;] transition-all duration-300 hover:duration-300 max-xl:w-[150px] max-xl:h-[150px] max-md:max-w-[100px] max-md:h-[100px] max-[425px]:max-w-[80px] max-[425px]:max-h-[80px]' />
        ) : (
          <div className='w-[200px] h-[200px] object-cover rounded-full bg-slate-500' />
        )}
        <div className='absolute p-2 rounded-full bg-avatar w-full h-full inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:duration-300 flex items-center justify-center flex-col cursor-pointer text-center'>
          <HiOutlinePhoto size={32} stroke='white' />
          <p className='text-white'>Choose an avatar for your profile</p>
        </div>
      </label>
      <input type="file" className="hidden" id='fileInput' onChange={(e) => handleFileChange(e)} />
      {errors?.formatImage! && <p className='text-red-500 text-sm'>{errors?.formatImage as string}</p>}
    </div>
  );
}

export default UpdateImage;