import React, { useState, useEffect } from "react";
import "../style.css";
import { ChatState } from "../../context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import ProfileModal from "../miscellaneous/ProfileModal";
import UpdateGroupChatModal from "../miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "lottie-react";
import typingAnni from "../../animation/typing.json";

const ENDPOINT = "https://cc-qzzn.onrender.com/";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast();

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stopTyping", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          "https://cc-qzzn.onrender.com/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        setNewMessage("");
        setFetchAgain(!fetchAgain);
        // fetchMessages();
        socket.emit("newMessage", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          status: "error",
          description: error.response.data.message,
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `https://cc-qzzn.onrender.com/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("joinChat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        status: "error",
        description: "Failed to load chats",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    fetchMessages();
    if (selectedChat) {
      // console.log(selectedChat._id);
      setNotification(
        notification.filter((ele) => {
          return ele.chat._id !== selectedChat._id;
        })
      );
    }
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user.userExist);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stopTyping", () => setIsTyping(false));
  }, [user.userExist]);

  useEffect(() => {
    socket.on("messageRcv", (newMessageRcv) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRcv.chat._id
      ) {
        // Notification
        if (!notification.includes(newMessageRcv)) {
          setNotification([newMessageRcv, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRcv]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stopTyping", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w={"100%"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={{ base: "space-between" }}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {selectedChat.isGroupChat ? (
              <>
                <Text>{selectedChat.chatName.toUpperCase()}</Text>
                {
                  <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  />
                }
              </>
            ) : (
              <>
                {getSender(user.userExist, selectedChat.users)}
                <ProfileModal
                  user={getSenderFull(user.userExist, selectedChat.users)}
                ></ProfileModal>
              </>
            )}
          </Box>
          <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={"#E8E8E8"}
            w={"100%"}
            h={"100%"}
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {loading ? (
              <Spinner
                size={"xl"}
                w={20}
                h={20}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? (
                <div style={{ width: "8%" }}>
                  <Lottie
                    width={"70px"}
                    style={{ marginBottom: 10, marginLeft: 0 }}
                    animationData={typingAnni}
                    loop={true}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant={"filled"}
                bg={"whiteAlpha.900"}
                placeholder="Write your message here"
                onChange={typingHandler}
                value={newMessage}
                _hover={{ bg: "#E0E0E0" }}
                color={"rgb(80, 80, 80)"}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          height={"100%"}
          w={"100%"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Text fontSize={"4xl"}>Select an user to start conversation</Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
