import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  XIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "react-share";
import { toast } from "react-hot-toast";

const ShareButtons = ({ url, title }) => {
  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard successfully");
  };

  return (
    <>
      <div className="d-flex">
        <div
          className="rounded-circle d-flex justify-content-center align-items-center  me-2"
          style={{
            cursor: "pointer",
            width: "32px",
            height: "32px",
            backgroundColor: "var(--bgDarkerColor)",
            color: "var(--light)",
          }}
          onClick={() => {
            copyLink();
          }}
        >
          <i className="bi bi-link-45deg h5 mb-0"></i>
        </div>
        <FacebookShareButton url={url} title={title} className="me-2">
          <FacebookIcon size={32} round={true} style={{ cursor: "pointer" }} />
        </FacebookShareButton>
        <TwitterShareButton url={url} title={title} className="me-2">
          <XIcon size={32} round={true} style={{ cursor: "pointer" }} />
        </TwitterShareButton>
        <LinkedinShareButton url={url} title={title} className="me-2">
          <LinkedinIcon size={32} round={true} style={{ cursor: "pointer" }} />
        </LinkedinShareButton>
        <WhatsappShareButton
          url={url}
          title={title}
          separator=":: "
          className="me-2"
        >
          <WhatsappIcon size={32} round={true} style={{ cursor: "pointer" }} />
        </WhatsappShareButton>
      </div>
    </>
  );
};

export default ShareButtons;
