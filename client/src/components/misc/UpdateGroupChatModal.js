import React, { useState } from "react";
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
import { BsFillEyeFill } from "react-icons/bs";
import { ChatState } from "../../context/Provider";
import UserItem from "./UserItem";
import axios from "axios";
import UserListItem from "./UserListItem";

const UpdateGroupChatModal = ({
  reFetchChats,
  setReFetchChats,
  fetchMessages,
}) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleRemoveFromGroup = async (removeUser) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      removeUser._id !== user._id
    ) {
      toast({
        title: "Only admins can remove participant/s!",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.users.length <= 3) {
      console.log("shka je tu ba ei");
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/remove_from_group",
        { chatId: selectedChat._id, userId: removeUser._id },
        config
      );

      removeUser._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setReFetchChats(!reFetchChats);
      fetchMessages();
      setLoading(false);
    } catch (err) {
      toast({
        title: "Failed to add participant/s!",
        description: err.response.data.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const handleGroupRename = async () => {
    if (!groupChatName) {
      toast({
        title: "Please enter a new name!",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setRenameLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/rename_group",
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      );
      setGroupChatName(data);
      setReFetchChats(!reFetchChats);
      setRenameLoading(false);
      //   toast({
      //     title: "Group chat name has been updated!",
      //     status: "success",
      //     duration: 2000,
      //     isClosable: true,
      //     position: "top",
      //   });
      //   onClose();
    } catch (err) {
      toast({
        title: "Please enter a new name!",
        description: err.response.data.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddToGroup = async (addUser) => {
    if (selectedChat.users.find((usr) => usr._id === addUser._id)) {
      toast({
        title: "User already in the group!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only group admins can add participants",
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
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/add_to_group",
        { chatId: selectedChat._id, userId: addUser._id },
        config
      );

      setSelectedChat(data);
      setReFetchChats(!reFetchChats);
      setLoading(false);
    } catch (err) {
      toast({
        title: "Failed to add participant/s!",
        description: err.response.data.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (err) {
      toast({
        title: "Failed to load the search results!",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<BsFillEyeFill />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" display="flex" justifyContent="center">
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((usr) => (
                <UserItem
                  key={usr._id}
                  user={usr}
                  handleFunction={() => handleRemoveFromGroup(usr)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleGroupRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl display="flex">
              <Input
                placeholder="Add participants to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult
                ?.slice(0, 3)
                .map((usr) => (
                  <UserListItem
                    key={usr._id}
                    user={usr}
                    handleFunction={() => handleAddToGroup(usr)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => handleRemoveFromGroup(user)}
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
