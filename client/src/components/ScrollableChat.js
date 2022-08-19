import { Avatar, Tooltip } from "@chakra-ui/react";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderAlign,
  isSameUser,
} from "../chatlogics/ChatLogics";
import { ChatState } from "../context/Provider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((msg, i) => (
          <div style={{ display: "flex" }} key={msg._id}>
            {(isSameSender(messages, msg, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip
                label={msg.sender.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={msg.sender.name}
                  src={msg.sender.picture}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  msg.sender._id === user._id ? "#00A884" : "#0A1014"
                }`,
                color: "#fff",
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderAlign(messages, msg, i, user._id),
                marginTop: isSameUser(messages, msg, i, user._id) ? 3 : 10,
              }}
            >
              {msg.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
