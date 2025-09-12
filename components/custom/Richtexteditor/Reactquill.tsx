import React, { useState, useEffect, useRef } from "react";
import "react-quill/dist/quill.snow.css";
import "./custom-quill.css"; // Your custom CSS for Quill

interface ReactQuillEditorProps {
  item: Record<string, any>;
  setItem: (item: Record<string, any>) => void;
  keylabel: string;
  setHasStartedEditing?: (hasStarted: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  readOnly?: boolean;
  theme?: 'snow' | 'bubble';
}

interface QuillRef {
  getEditor: () => any;
}

const ReactQuillEditor: React.FC<ReactQuillEditorProps> = ({ 
  item, 
  setItem, 
  keylabel, 
  setHasStartedEditing,
  className = "",
  style = {},
  placeholder = "Enter text...",
  readOnly = false,
  theme = 'snow'
}) => {
  const [Editor, setEditor] = useState<React.ComponentType<any> | null>(null);
  const quillRef = useRef<QuillRef | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("react-quill")
        .then((mod) => {
          setEditor(() => mod.default);
        })
        .catch((error) => console.error("Error loading react-quill:", error));
    }
  }, []);

  useEffect(() => {
    if (Editor && quillRef.current) {
      const quill = quillRef.current.getEditor();
      const toolbar = quill.getModule("toolbar");

      const handleAddImage = () => {
        const url = window.prompt("Enter the image URL:");
        if (url && quillRef.current) {
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();
          if (range) {
            quill.insertEmbed(range.index, "image", url);
          }
        }
      };

      const handleDeleteImage = async () => {
        if (!quillRef.current) return;
        
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        if (range) {
          const [leaf] = quill.getLeaf(range.index);
          if (leaf && leaf.domNode && leaf.domNode.tagName === "IMG") {
            const imageUrl = leaf.domNode.src;

            // Make API call to delete the image from the server
            try {
              const response = await fetch("/api/delete-image", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ url: imageUrl }),
              });

              if (response.ok) {
                // Remove image from editor
                leaf.remove();
              } else {
                console.error("Failed to delete the image from the server");
              }
            } catch (error) {
              console.error("Error while deleting the image:", error);
            }
          }
        }
      };

      //   const handleAddMath = () => {
      //     const math = window.prompt('Enter the LaTeX math expression:');
      //     if (math) {
      //       const quill = quillRef.current.getEditor();
      //       const range = quill.getSelection();
      //       quill.insertEmbed(range.index, 'mathjax', math);
      //     }
      //   };

      toolbar.addHandler("image", handleAddImage);
      toolbar.addHandler("deleteImage", handleDeleteImage);
      //   toolbar.addHandler('mathjax', handleAddMath);

      quill.on("text-change", () => {
        setHasStartedEditing && setHasStartedEditing(true);
      });
    }
  }, [Editor]);

  const modules = {
    toolbar: {
      container: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "image", "video", "mathjax"],
        ["clean"],
        ["deleteImage"],
      ],
      handlers: {
        image: () => {}, // Handlers will be added in useEffect
        deleteImage: () => {},
        // mathjax: () => {},
      },
    },
    // imageResize: {
    //   modules: ['Resize', 'DisplaySize', 'Toolbar'],
    // },
    // mathjax: {
    //   preview: true,
    // },
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "mathjax",
  ];

  return (
    <div className={className} style={style}>
      {Editor && (
        <Editor
          ref={quillRef}
          theme={theme}
          modules={modules}
          formats={formats}
          value={item[keylabel] || ""}
          placeholder={placeholder}
          readOnly={readOnly}
          onChange={(content: string) => {
            setItem({ ...item, [keylabel]: content });
          }}
        />
      )}
    </div>
  );
};

export default ReactQuillEditor;
