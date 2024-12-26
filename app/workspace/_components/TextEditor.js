import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import EditorExtensions from "../_components/EditorExtensions";
import Underline from '@tiptap/extension-underline';
import React, { useEffect } from 'react'
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

const TextEditor = ({fileId}) => {
  // get the notes stored in db
  const notes = useQuery(api.notes.getNotes, {
    fileId: fileId
  })
  
  const editor = useEditor({
        extensions: [StarterKit, Underline,
            Placeholder.configure({
                // Use a placeholder
                placeholder: 'Start making your notes here …',
              }),
        ],
        content: '',
        editorProps: {
            attributes: {
                class: "focus: outline-none h-screen p-5"
            }
        }
      });

  useEffect(() => {
    // set the notes to editor if any present in db
    editor && editor.commands.setContent(notes);
  }, [editor && notes]);

  return (
    <div>
    <EditorExtensions editor={editor} />
    <div className='overflow-scroll h-[88vh]'>
    <EditorContent editor={editor} />
    </div>
    </div>
  )
}

export default TextEditor