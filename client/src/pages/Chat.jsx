import React from "react";
import { ChatState } from "../context/Provider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/misc/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import { useState } from "react";

const Chat = () => {
  const { user } = ChatState();
  const [reFetchChats, setReFetchChats] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}

      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats reFetchChats={reFetchChats} />}
        {user && (
          <ChatBox
            reFetchChats={reFetchChats}
            setReFetchChats={setReFetchChats}
          />
        )}
      </Box>
    </div>
  );
};

export default Chat;
