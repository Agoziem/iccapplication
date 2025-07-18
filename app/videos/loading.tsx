import { PuffLoader, PulseLoader } from "react-spinners";
import { FC } from "react";

const Loading: FC = () => {
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
