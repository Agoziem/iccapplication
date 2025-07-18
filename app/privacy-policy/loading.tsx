import { PuffLoader } from "react-spinners";

const Loading = () => {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <PuffLoader color="#27011d" />
    </div>
  );
};

export default Loading;
