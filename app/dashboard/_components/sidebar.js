"use client"
import Image from 'next/image';
import React from 'react'
import { Button } from "../../../components/ui/button"
import { Progress } from "../../../components/ui/progress"
import { LayoutIcon, Shield } from 'lucide-react';
import UploadPDFDialog from './upload-pdf-dialog';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Sidebar = () => {
    const { user } = useUser();
    const path = usePathname();
    const fileList = useQuery(api.file_storage.getUserFiles, {
        userEmail: user?.primaryEmailAddress?.emailAddress
    });
    return (
        <div className='shadow-md h-screen p-7'>
        <div className='flex items-center justify-evenly'>
            <Image src={"/logo.svg"} alt='logo' width={35} height={35} color='purple' />
            <span className='font-bold'>AskPDF AI</span>
            </div>
            <div className='mt-10'>

                <UploadPDFDialog isMaxFile={fileList?.length >= 5 ? true : false}>
                    {/* <Button className='w-full'>+ Upload PDF
                </Button> */}
                </UploadPDFDialog>
                <Link href="/dashboard" className={`flex gap-2 items-center p-3 mt-5 hover:bg-slate-100 rounded-lg cursor-pointer ${path == "/dashboard" && 'bg-slate-200'}`}>

                    <LayoutIcon />
                    <h2>Workspace</h2>

                </Link>
                <Link href="/dashboard/upgrade" className={`flex gap-2 items-center p-3 hover:bg-slate-100 rounded-lg cursor-pointer ${path == "/dashboard/upgrade" && 'bg-slate-200'}`}>

                    <Shield />
                    <h2>Upgrade</h2>

                </Link>
            </div>
            <div className='absolute bottom-24 w-[80%]'>
                <Progress value={(fileList?.length / 5) * 100} />
                <p className='text-sm mt-1'>{fileList?.length} out of 5 PDF uploaded</p>
                <p className='text-sm text-gray-400 mt-2'>Upgrade to Upload more PDF</p>
            </div>
        </div>
    )
}

export default Sidebar;