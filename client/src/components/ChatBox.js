import React from "react";
import { ChatState } from "../context/Provider";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";

const ChatBox = ({ reFetchChats, setReFetchChats }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="#fff"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
      color="#000"
    >
      <SingleChat
        reFetchChats={reFetchChats}
        setReFetchChats={setReFetchChats}
      />
    </Box>
  );
};

export default ChatBox;
