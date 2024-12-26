import { useAction, useMutation } from 'convex/react'
import { Bold, Italic, Sparkle, Underline } from 'lucide-react'
import { useParams } from 'next/navigation'
import React from 'react'
import { api } from "../../../convex/_generated/api";
import { chatSession } from '../../../configs/AIModel';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';

const EditorExtensions = ({ editor }) => {

    const {fileId} = useParams();
    const searchAI = useAction(api.myActions.search);

    const saveNotes = useMutation(api.notes.addNotes);
    const {user} = useUser();

    // save user notes
    const saveUserNotes = async () => {
        try {
            // show message
            toast("Saving the notes.")
            // save notes to db
            await saveNotes({
                notes:editor.getHTML(),
                fileId: fileId,
                createdBy: user?.primaryEmailAddress?.emailAddress
            });
            toast("Notes saved successfully.")
        } catch (error) {
            toast("Error in saving notes!")
        }
        
    }

    const onAiClick = async() => {
        toast("AI is getting your answer...")
        const selectedText = editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to,
            ' '
        );

        const result = await searchAI({ 
            query: selectedText,
            fileId: fileId
        })

        const unformattedAns = JSON.parse(result)

        let allUnformattedAnswer = "";
        unformattedAns && unformattedAns.forEach(item => {
            allUnformattedAnswer += item.pageContent;
        });

        const PROMPT = "For question: " + selectedText + " and with the given content as answer," + " please give correct answer in HTML format. The answer content is: " + allUnformattedAnswer;

        const aiModelResult = await chatSession.sendMessage(PROMPT);
        const finalAnswer = aiModelResult.response.text().replace('```', '').replace('html', '');
        
        const allText = editor.getHTML();
        editor.commands.setContent(allText + '<p><strong>Answer: </strong>'+finalAnswer+'</p>')

        // saveNotes({
        //     notes:editor.getHTML(),
        //     fileId: fileId,
        //     createdBy: user?.primaryEmailAddress?.emailAddress
        // })
        // save user notes
        // saveUserNotes();

    }

    return editor && (
        <div className='p-5 flex justify-between'>
            <div className="control-group">
                <div className="button-group flex gap-3">
                    {/* Bold */}
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={editor.isActive('bold') ? 'text-blue-500' : ''}
                    >
                        <Bold />
                    </button>
                    {/* Italic */}
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={editor.isActive('italic') ? 'text-blue-500' : ''}
                    >
                        <Italic />
                    </button>
                    {/* Underline */}
                    <button
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={editor.isActive('underline') ? 'text-blue-500' : ''}
                    >
                        <Underline />
                    </button>

                    <button
                        onClick={() => onAiClick()}
                        className={'hover:text-blue-500'}
                    >
                        <Sparkle />
                    </button>
                </div>
            </div>
        <div className="flex gap-2 items-end">
        <Button onClick={() => saveUserNotes()}>Save Notes</Button>
        </div>
        </div>
    )
}

export default EditorExtensions