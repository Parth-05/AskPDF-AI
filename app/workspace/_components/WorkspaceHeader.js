import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'
import { Button } from '../../../components/ui/button'
import Link from 'next/link'

const WorkspaceHeader = ({ fileName }) => {
  return (
    <div className='p-4 flex justify-between shadow-md'>
      <Link href={"/dashboard"}>
        <Image src={'/logo.svg'} alt="logo" width={35} height={35} />
      </Link>
      {/* File Name */}
      <h2 className='font-bold'>{fileName}</h2>

      {/* User Profile Button */}
      <UserButton />
    </div>
  )
}

export default WorkspaceHeader