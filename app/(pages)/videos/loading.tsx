import { PuffLoader, PulseLoader } from "react-spinners";

const Loading = () => {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      
      <PulseLoader color={"#27011d"} loading={true} />

    </div>
  );
};

export default Loading;
