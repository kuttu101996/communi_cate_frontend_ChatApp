import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import axios from "axios";
import UserListItem from "../userAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [loading, setLoading] = useState(false);
  // const [search, setSearch] = useState("");
  const [groupChatName, setGroupChatName] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const { selectedChat, setSelectedChat, user } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [renameLoading, setRenameLoading] = useState(false);
  const toast = useToast();

  const handleRemove = async (userToRemove) => {
    if (
      selectedChat.groupAdmin._id !== user.userExist._id &&
      userToRemove._id !== user.userExist._id
    ) {
      toast({
        title: "Only admin can add or remove",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `https://chat-dev.onrender.com/api/chat/removefromgroup`,
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
        },
        config
      );
      if (userToRemove._id === user.userExist._id) {
        setSelectedChat();
      } else setSelectedChat(data);

      onClose();
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        status: "error",
        description: error.response.data.message,
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find((ele) => ele._id === userToAdd._id)) {
      toast({
        title: "User Already in the Group",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user.userExist._id) {
      toast({
        title: "Only admins can add new user!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `https://chat-dev.onrender.com/api/chat/addToGroup`,
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        status: "error",
        description: error.response.data.message,
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `https://chat-dev.onrender.com/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleSearch = async (query) => {
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `https://chat-dev.onrender.com/api/user?search=${query}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to search the user",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            display={"flex"}
            justifyContent={"center"}
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display={"flex"} w={"100%"} flexWrap={"wrap"} pb={4}>
              {selectedChat.users.map((ele) => {
                return (
                  <UserBadgeItem
                    key={ele._id}
                    user={ele}
                    handleFunction={() => handleRemove(ele)}
                  />
                );
              })}
            </Box>
            <FormControl display={"flex"}>
              <Input
                placeholder="Update group name here"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant={"solid"}
                backgroundColor={"teal.500"}
                color={"white"}
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add new user to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size={"lg"} />
            ) : (
              searchResult.map((ele) => {
                return (
                  <UserListItem
                    key={ele._id}
                    user={ele}
                    handleFunction={() => handleAddUser(ele)}
                  />
                );
              })
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              onClick={() => handleRemove(user.userExist)}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
