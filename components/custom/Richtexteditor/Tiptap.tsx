import React, { useEffect, useCallback, useState } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { useUploadRichTextImage, useDeleteRichTextImage } from "@/data/hooks/organization.hooks";
import { toast } from "sonner";
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
  const [isUploading, setIsUploading] = useState(false);
  
  // Hook for uploading images to the server
  const { mutateAsync: uploadRichTextImage } = useUploadRichTextImage();
  const { mutateAsync: deleteRichTextImage } = useDeleteRichTextImage();
  
  // Store mapping of image URLs to their server IDs for deletion
  const [imageIdMap, setImageIdMap] = useState<Map<string, number>>(new Map());
  
  // Helper function to upload image file and get persistent URL
  const uploadImageFile = useCallback(async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      toast.loading("Uploading image...", { id: "image-upload" });
      
      const uploadedImage = await uploadRichTextImage(file);
      
      // Store the mapping of URL to ID for future deletion
      if (uploadedImage.image_url && uploadedImage.id) {
        const imageId = typeof uploadedImage.id === 'string' ? parseInt(uploadedImage.id) : uploadedImage.id;
        setImageIdMap(prev => new Map(prev).set(uploadedImage.image_url!, imageId));
      }
      
      toast.dismiss("image-upload");
      toast.success("Image uploaded successfully!");
      
      return uploadedImage.image_url || null;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.dismiss("image-upload");
      toast.error("Failed to upload image. Please try again.");
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [uploadRichTextImage]);
  
  // Helper function to delete image from server
  const deleteImageFromServer = useCallback(async (imageUrl: string): Promise<void> => {
    try {
      const imageId = imageIdMap.get(imageUrl);
      if (imageId) {
        toast.loading("Deleting image...", { id: "image-delete" });
        
        await deleteRichTextImage(imageId);
        
        // Remove from local mapping
        setImageIdMap(prev => {
          const newMap = new Map(prev);
          newMap.delete(imageUrl);
          return newMap;
        });
        
        toast.dismiss("image-delete");
        toast.success("Image deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.dismiss("image-delete");
      toast.error("Failed to delete image from server.");
    }
  }, [imageIdMap, deleteRichTextImage]);
  
  // Callback to handle image uploads from toolbar
  const handleToolbarImageUpload = useCallback((imageUrl: string, imageId: number) => {
    setImageIdMap(prev => new Map(prev).set(imageUrl, imageId));
  }, []);

  // Handle drag and drop for images
  const handleDrop = useCallback(async (event: DragEvent, editor: Editor) => {
    const files = Array.from(event.dataTransfer?.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      event.preventDefault();
      
      // Upload each dropped image file to the server
      for (const file of imageFiles) {
        const persistentUrl = await uploadImageFile(file);
        if (persistentUrl) {
          editor.chain().focus().setImage({ src: persistentUrl }).run();
        }
      }
    }
    setIsDragOver(false);
  }, [uploadImageFile]);

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
          class: "custom-image-class position-relative",
        },
        allowBase64: true,
      }).extend({
        addNodeView() {
          return ({ node, editor, getPos }) => {
            const container = document.createElement('div');
            container.className = 'image-container position-relative d-inline-block';
            
            const img = document.createElement('img');
            img.src = node.attrs.src;
            img.className = 'custom-image-class';
            img.alt = node.attrs.alt || '';
            
            // Add delete button for images that have server IDs
            const imageUrl = node.attrs.src;
            const hasServerId = imageIdMap.has(imageUrl);
            
            if (hasServerId && editor.isEditable) {
              const deleteBtn = document.createElement('button');
              deleteBtn.innerHTML = '×';
              deleteBtn.className = 'btn btn-danger btn-sm position-absolute image-delete-btn';
              deleteBtn.style.cssText = 'top: 8px; right: 8px; width: 28px; height: 28px; border-radius: 50%; padding: 0; line-height: 1; z-index: 10; font-size: 18px;';
              deleteBtn.title = 'Delete image';
              deleteBtn.type = 'button';
              
              deleteBtn.onclick = async (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if (confirm('Are you sure you want to delete this image? This will also remove it from the server.')) {
                  // Delete from server
                  await deleteImageFromServer(imageUrl);
                  
                  // Remove from editor
                  const pos = getPos();
                  if (pos !== undefined) {
                    editor.chain().focus().deleteRange({ from: pos, to: pos + node.nodeSize }).run();
                  }
                }
              };
              
              container.appendChild(deleteBtn);
            }
            
            container.appendChild(img);
            return { dom: container };
          };
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
          
          imageItems.forEach(async (item) => {
            const file = item.getAsFile();
            if (file && editor) {
              const persistentUrl = await uploadImageFile(file);
              if (persistentUrl) {
                editor.chain().focus().setImage({ src: persistentUrl }).run();
              }
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
      <Toolbar editor={editor} content={item || ""} onImageUploaded={handleToolbarImageUpload} />
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
              item || isDragOver || isUploading ? 'd-none' : ''
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
            ) : isUploading ? (
              <div className="text-info">
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <strong>Uploading image...</strong>
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
