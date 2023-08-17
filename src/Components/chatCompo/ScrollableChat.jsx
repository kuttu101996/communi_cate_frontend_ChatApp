import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogics";
import { ChatState } from "../../context/ChatProvider";
import { Avatar, Tooltip } from "@chakra-ui/react";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const loggedUserId = user.userExist._id;
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((ele, index) => {
          return (
            <div key={ele._id} style={{ display: "flex" }}>
              {(isSameSender(messages, ele, index, loggedUserId) ||
                isLastMessage(messages, index, loggedUserId)) && (
                <Tooltip
                  label={ele.sender.name}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mt={"7px"}
                    mr={1}
                    size={"sm"}
                    cursor={"pointer"}
                    name={ele.sender.name}
                    src={ele.sender.pic}
                  />
                </Tooltip>
              )}
              <span
                style={{
                  backgroundColor: `${
                    ele.sender._id === loggedUserId ? "#BEE3F8" : "#B9F5D0"
                  }`,
                  borderRadius: "10px",
                  padding: "3px 15px",
                  maxWidth: "75%",
                  marginLeft: isSameSenderMargin(
                    messages,
                    ele,
                    index,
                    loggedUserId
                  ),
                  marginTop: isSameUser(messages, ele, index) ? "3px" : "10px",
                }}
              >
                {ele.content}
              </span>
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
