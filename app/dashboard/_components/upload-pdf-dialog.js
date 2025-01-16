"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogClose,
    DialogTitle,
    DialogTrigger,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useAction, useMutation } from 'convex/react';
import { FileEdit, LoaderIcon } from 'lucide-react';
import {api} from "../../../convex/_generated/api";
import uuid4 from 'uuid4';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';


const UploadPDFDialog = ({children, isMaxFile}) => {

    const generateUploadUrl = useMutation(api.file_storage.generateUploadUrl);
    const addFileEntry = useMutation(api.file_storage.addFileEntryToDb);
    const getFileUrl = useMutation(api.file_storage.getFileUrl);
    const embedDocument = useAction(api.myActions.ingest);
    const {user} = useUser();
    const [file, setFile] = useState();
    const [fileName, setFileName] = useState();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const onFileSelect = (event) => {
        setFile(event.target.files[0])
    }
    const onUpload = async () => {
        setLoading(true)
         // Step 1: Get a short-lived upload URL
        const postUrl = await generateUploadUrl();

        // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file?.type },
        body: file,
      });
      const { storageId } = await result.json();
    // Step 3: Save the storage id to Db
    const fileId = uuid4();
    const fileUrl = await getFileUrl({storageId: storageId})
    const resp = await addFileEntry({
        fileId: fileId,
        storageId: storageId,
        fileName: fileName ? fileName : "Unititled File",
        fileUrl: fileUrl,
        createdBy: user?.primaryEmailAddress?.emailAddress
    });
    console.log(resp);

    // Api call to fetch Pdf processed data
    const apiResp = await axios.get("/api/pdf-loader?pdfUrl="+fileUrl);
    await embedDocument({
        splitText: apiResp.data.result,
        fileId: fileId
    });
    setLoading(false)
    setOpen(false)
    }

    return (
        <Dialog open={open}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)} disabled={isMaxFile} className="w-full">+ Upload PDF File</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Pdf File</DialogTitle>
                    <DialogDescription asChild>
                        <div className=''>
                            <h2 className='mt-5'>Select file to upload</h2>
                            <div className='gap-2 p-3 rounded-md border'>
                                <input type='file' accept='application/pdf' onChange={(event) => onFileSelect(event)} />
                            </div>
                            <div className='mt-2'>
                                <label> File Name *</label>
                                <Input placeholder="File Name" onChange={(e) => setFileName(e.target.value)} />
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-end">
                    <DialogClose asChild>
                        <Button onClick={() => setOpen(false)} type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                    <Button onClick={onUpload} disabled={loading}>
                        {loading ? <LoaderIcon className='animate-spin' /> : "Upload"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}

export default UploadPDFDialog