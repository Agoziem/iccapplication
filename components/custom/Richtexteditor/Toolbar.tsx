import React, { useCallback, useState } from "react";
import { Editor } from "@tiptap/react";
import { FaCode } from "react-icons/fa";
import { LuHeading2, LuListOrdered } from "react-icons/lu";
import { BsList } from "react-icons/bs";
import ToolbarButton from "./ToolbarButton"; // Adjust the import path as needed
import { FaRegImage } from "react-icons/fa6";
import { BiSolidQuoteAltLeft } from "react-icons/bi";
import { IoArrowRedo, IoArrowUndoSharp, IoLink } from "react-icons/io5";
import {
  MdFormatUnderlined,
  MdOutlineFormatBold,
  MdOutlineFormatItalic,
  MdOutlineLinkOff,
  MdOutlineStrikethroughS,
} from "react-icons/md";
import ImageUploader from "@/components/custom/Imageuploader/ImageUploader";
import Modal from "../Modal/modal";

interface ToolbarProps {
  editor: Editor | null;
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

const Toolbar: React.FC<ToolbarProps> = ({
  editor,
  content,
  className = "",
  style = {},
}) => {
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  // Handle image upload
  const handleImageUpload = useCallback(
    (url: string) => {
      if (!editor || !url) return;

      editor.chain().focus().setImage({ src: url }).run();
      setShowImageUpload(false);
      setImageUrl("");
    },
    [editor]
  );

  // Handle file upload from ImageUploader
  const handleFileUpload = useCallback(
    (fileOrUrl: File | string) => {
      if (!editor) return;

      if (typeof fileOrUrl === "string") {
        setImageUrl(fileOrUrl);
      } else {
        // For File objects, we'd need to handle upload to server
        // For now, we'll create a local URL (temporary solution)
        const url = URL.createObjectURL(fileOrUrl);
        setImageUrl(url);
      }
    },
    [editor]
  );

  // add image with upload option
  const addImage = useCallback(() => {
    if (!editor) return;

    // Open upload modal directly (better UX)
    setShowImageUpload(true);
  }, [editor]);

  const closeModal = useCallback(() => {
    setShowImageUpload(false);
    setImageUrl("");
  }, []);

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <>
      <div
        className={`d-flex align-items-center gap-4 w-100 flex-wrap px-3 mb-2 rounded py-2 ${className}`}
        style={{
          border: "1px solid var(--bgDarkColor)",
          ...style,
        }}
      >
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          Icon={MdOutlineFormatBold}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          Icon={MdOutlineFormatItalic}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          Icon={MdFormatUnderlined}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          Icon={MdOutlineStrikethroughS}
        />
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          Icon={LuHeading2}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          Icon={BsList}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          Icon={LuListOrdered}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          Icon={BiSolidQuoteAltLeft}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setCode().run()}
          isActive={editor.isActive("code")}
          Icon={FaCode}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          isActive={false} // undo/redo don't have active states
          Icon={IoArrowUndoSharp}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          isActive={false} // undo/redo don't have active states
          Icon={IoArrowRedo}
        />
        <ToolbarButton
          onClick={addImage}
          isActive={editor.isActive("image")}
          Icon={FaRegImage}
        />
        <ToolbarButton
          onClick={setLink}
          isActive={editor.isActive("link")}
          Icon={IoLink}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetLink().run()}
          isActive={false}
          Icon={MdOutlineLinkOff}
        />
      </div>

      {/* Image Upload Modal */}

      <Modal showmodal={showImageUpload} toggleModal={closeModal}>
        <div className="p-3">
          <h5 className="">Upload Image</h5>
          <div className="mb-3">
            <label className="form-label">Upload Image File</label>
            <ImageUploader
              value={imageUrl}
              onChange={handleFileUpload}
              placeholder="Choose an image file"
            />
          </div>

          <div className="text-center my-3">
            <strong>OR</strong>
          </div>

          <div className="mb-3">
            <label htmlFor="imageUrl" className="form-label">
              Enter Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              className="form-control"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowImageUpload(false);
                setImageUrl("");
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleImageUpload(imageUrl)}
              disabled={!imageUrl}
            >
              Insert Image
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Toolbar;
