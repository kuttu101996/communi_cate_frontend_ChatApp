import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideComing from "../miscellaneous/SideComing";
import MyChats from "./MyChats";
import ChatBox from "./ChatBox";

const Chat = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <div style={{ width: "100%" }}>
      {user && <SideComing />}
      <Box
        display="flex"
        justifyContent={"space-between"}
        w={"100%"}
        h={"91vh"}
        p={"10px"}
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chat;
