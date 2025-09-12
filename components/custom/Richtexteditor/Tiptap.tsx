import React, { useEffect } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import "./Tiptap.css";

interface TiptapProps {
  item: string;
  setItem: (value: string) => void;
  setHasStartedEditing?: (value: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  editable?: boolean;
}

const Tiptap: React.FC<TiptapProps> = ({ 
  item, 
  setItem, 
  setHasStartedEditing,
  className = "",
  style = {},
  placeholder = "Enter your content...",
  editable = true
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        HTMLAttributes: {
          class: "custom-image-class",
        },
      }),
      Link.configure({
        openOnClick: true,
        autolink: false,
        HTMLAttributes: {
          class: "custom-link-class text-secondary",
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: `tiptapinput d-flex flex-column px-2 py-2 justify-content-start align-items-start w-100 gap-3 rounded ${className}`,
      },
    },
    editable,
    content: item || "",
    onUpdate: ({ editor }: { editor: Editor }) => {
      if (setHasStartedEditing) {
        setHasStartedEditing(true);
      }
      setItem(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor) {
      const currentContent = editor.getHTML();
      const newContent = item || "";

      // Set the content only if it's different
      if (currentContent !== newContent) {
        editor.commands.setContent(newContent);
      }
    }
  }, [item, editor]);

  return (
    <div className={`w-100 ${className}`} style={style}>
      <Toolbar editor={editor} content={item || ""} />
      <EditorContent
        style={{
          whiteSpace: "pre-line",
        }}
        editor={editor}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Tiptap;
