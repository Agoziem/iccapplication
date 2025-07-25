"use client";
import Contacts from "./Contacts";
import Chat from "./Chat";
import { useState } from "react";

const WhatsappContainer: React.FC = () => {
  const [showlist, setShowlist] = useState<boolean>(true);

  return (
    <div className="row mt-1">
      <div className="col-md-4">
        <Contacts showlist={showlist} setShowlist={setShowlist}  />
      </div>
      <div className="col-md-8">
        <Chat showlist={showlist} setShowlist={setShowlist} />
      </div>
    </div>
  );
};

export default WhatsappContainer;
