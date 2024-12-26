"use client"
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react';
import React from 'react'
import Image from 'next/image';
import { api } from '../../convex/_generated/api';
import Link from 'next/link';

const Dashboard = () => {
  const { user } = useUser();
  const fileList = useQuery(api.file_storage.getUserFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress
  });
  return (
    <div>
      <h2 className='font-medium text-3xl'>Workspace</h2>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-10'>
        {fileList?.length > 0 ? fileList.map((file, index) => (
          <Link href={`/workspace/${file?.fileId}`} key={index} className='flex p-5 shadow-md rounded-md flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all'>
            <Image src={'/pdf.png'} alt="file" width={50} height={50} />
            <h2 className='mt-3 font-medium text-xl'>{file?.fileName}</h2>
            {/* <h2>{file?._creationTime}</h2> */}
          </Link>
        ))
        :
          [1,2,3,4,5,6,7, 8, 9, 10].map((item, index) => (
            <div key={index} className='bg-slate-200 rounded-md h-[150px] animate-pulse'></div>
          ))
        }
      </div>
    </div>
  );
}

export default Dashboard;
