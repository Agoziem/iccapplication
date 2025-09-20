import React, { useEffect, useCallback, useState } from "react";
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
  const [isDragOver, setIsDragOver] = useState(false);

  // Handle drag and drop for images
  const handleDrop = useCallback((event: DragEvent, editor: Editor) => {
    const files = Array.from(event.dataTransfer?.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      event.preventDefault();
      
      // For each dropped image file, create a temporary URL and insert it
      imageFiles.forEach(file => {
        const url = URL.createObjectURL(file);
        editor.chain().focus().setImage({ src: url }).run();
      });
    }
    setIsDragOver(false);
  }, []);

  const handleDragEnter = useCallback((event: DragEvent) => {
    event.preventDefault();
    const items = Array.from(event.dataTransfer?.items || []);
    const hasImageFiles = items.some(item => item.type.startsWith('image/'));
    if (hasImageFiles) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((event: DragEvent) => {
    event.preventDefault();
    // Only set drag over to false if we're leaving the editor entirely
    const target = event.target as HTMLElement;
    const editor = target.closest('.tiptapinput');
    if (!editor || !editor.contains(event.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        HTMLAttributes: {
          class: "custom-image-class",
        },
        allowBase64: true,
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
        class: `tiptapinput d-flex flex-column px-2 py-2 justify-content-start align-items-start w-100 gap-3 rounded ${className} ${isDragOver ? 'dragover' : ''}`,
      },
      handleDrop: (view, event) => {
        if (editor) {
          handleDrop(event, editor);
          return true;
        }
        return false;
      },
      handlePaste: (view, event) => {
        // Handle pasted images
        const items = Array.from(event.clipboardData?.items || []);
        const imageItems = items.filter(item => item.type.startsWith('image/'));
        
        if (imageItems.length > 0) {
          event.preventDefault();
          
          imageItems.forEach(item => {
            const file = item.getAsFile();
            if (file) {
              const url = URL.createObjectURL(file);
              editor?.chain().focus().setImage({ src: url }).run();
            }
          });
          return true;
        }
        return false;
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
      <div 
        className="position-relative"
        onDragEnter={(e) => {
          e.preventDefault();
          const dt = e.dataTransfer;
          if (dt.types.includes('Files')) {
            setIsDragOver(true);
          }
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          const target = e.target as HTMLElement;
          const currentTarget = e.currentTarget as HTMLElement;
          if (!currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragOver(false);
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
        }}
      >
        <EditorContent
          style={{
            whiteSpace: "pre-line",
            minHeight: "120px",
          }}
          editor={editor}
          placeholder={placeholder}
        />
        {editable && (
          <div 
            className={`position-absolute top-50 start-50 translate-middle text-muted small text-center ${
              item || isDragOver ? 'd-none' : ''
            }`}
            style={{
              pointerEvents: "none",
              transition: "opacity 0.2s ease",
              maxWidth: "80%"
            }}
          >
            {isDragOver ? (
              <div className="text-primary">
                <strong>Drop images here to insert them</strong>
              </div>
            ) : (
              <div>
                {placeholder || "Start typing... or drag & drop images here"}
                <br />
                <small className="text-muted">You can also paste images directly (Ctrl+V)</small>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tiptap;
