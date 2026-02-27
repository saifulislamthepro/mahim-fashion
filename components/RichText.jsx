"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    immediatelyRender: false,
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="rte-container">
        <div className="rte-toolbar">
            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
            <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}>•</button>
        </div>

        <EditorContent editor={editor} className="rte-editor" />
    </div>

  );
}
