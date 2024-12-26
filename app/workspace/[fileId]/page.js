"use client"
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import  WorkspaceHeader  from "../_components/WorkspaceHeader";
import PDFViwer from "../_components/PDFViewer";
import TextEditor from "../_components/TextEditor";
import { useQuery } from 'convex/react';
import { api } from "../../../convex/_generated/api";

const WorkSpace = () => {
    const { fileId } = useParams();
    const fileInfo = useQuery(api.file_storage.getFileRecord, 
      {
        fileId: fileId
      }
    );

    useEffect(() => {
    }, [fileInfo]);
    
  return (
    <div>
        <WorkspaceHeader fileName={fileInfo?.fileName}/>
        <div className='grid grid-cols-2 gap-5'>
          <div>
            {/* Text Editor */}
            <TextEditor fileId={fileId} />
          </div>
          <div>
          {/* PDF Viewer */}
          <PDFViwer fileUrl={fileInfo?.fileUrl}/>
          </div>
        </div>
    </div>
  )
}

export default WorkSpace