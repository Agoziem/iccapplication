import React, { useCallback } from "react";
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

const Toolbar = ({ editor, content }) => {

  // add image
  const addImage = useCallback(() => {
    const url = window.prompt("URL");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  return (
    <>
      {editor ? (
        <div
          className="d-flex align-items-center gap-4 w-100 flex-wrap px-3 mb-2 rounded py-2"
          style={{
            border: "1px solid var(--bgDarkColor)",
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
            isActive={editor.isActive("undo")}
            Icon={IoArrowUndoSharp}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            isActive={editor.isActive("redo")}
            Icon={IoArrowRedo}
          />
          <ToolbarButton
            onClick={() => addImage()}
            isActive={editor.isActive("image")}
            Icon={FaRegImage}
          />
          <ToolbarButton
            onClick={() => setLink()}
            isActive={editor.isActive("link")}
            Icon={IoLink}
          />

          <ToolbarButton
            onClick={() => editor.chain().focus().unsetLink().run()}
            Icon={MdOutlineLinkOff}
          />
        </div>
      ) : null}
    </>
  );
};

export default Toolbar;
