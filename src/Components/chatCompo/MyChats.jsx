import {
  Avatar,
  Box,
  Button,
  Stack,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "../../config/ChatLogics";
import GroupChatModal from "../miscellaneous/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState({});
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        "https://comm-u-cate.onrender.com/api/chat",
        config
      );
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")).userExist);
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir={"column"}
      alignItems={"center"}
      p={3}
      bg={"white"}
      w={{ base: "100%", md: "31%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        display={"flex"}
        w={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
        color={"grey"}
      >
        My Chats
        <GroupChatModal>
          <Button
            color={"grey"}
            display={"flex"}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display={"flex"}
        flexDir={"column"}
        p={3}
        w={"100%"}
        h={"100%"}
        borderRadius={"lg"}
        overflowY={"hidden"}
        bg={"#F8F8F8"}
      >
        {chats.length > 0 ? (
          <Stack overflowY={"scroll"}>
            {chats?.map((chat) => {
              return (
                <Box
                  display={"flex"}
                  onClick={() => setSelectedChat(chat)}
                  cursor={"pointer"}
                  px={3}
                  py={2}
                  borderRadius={"lg"}
                  bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  key={chat._id}
                >
                  <div>
                    {chat.users?.map((ele) => {
                      if (ele._id !== loggedUser._id) {
                        return (
                          <Tooltip
                            label={ele.name}
                            placement="bottom-start"
                            hasArrow
                            key={ele._id}
                          >
                            <Avatar
                              mt={"7px"}
                              mr={1}
                              size={"sm"}
                              cursor={"pointer"}
                              name={ele.name}
                              src={ele.pic}
                            />
                          </Tooltip>
                        );
                      }
                    })}
                  </div>
                  <div>
                    <Text>
                      {!chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName}
                    </Text>
                    {chat.latestMessage && (
                      <Text fontSize="xs">
                        <b>
                          {chat.latestMessage.sender.name ===
                          user.userExist.name
                            ? "You"
                            : chat.latestMessage.sender.name}
                          {": "}
                        </b>
                        {chat.latestMessage.content.length > 50
                          ? chat.latestMessage.content.substring(0, 51) + "..."
                          : chat.latestMessage.content}
                      </Text>
                    )}
                  </div>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
