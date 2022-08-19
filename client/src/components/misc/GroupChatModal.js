import {
  Box,
  Button,
  FormControl,
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
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../../context/Provider";
import UserListItem from "../misc/UserListItem";
import UserItem from "./UserItem";

const GroupChatModal = ({ children }) => {
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const { user, chats, setChats } = ChatState();

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

  const handleAddGroup = (userAdded) => {
    if (selectedUsers.includes(userAdded)) {
      toast({
        title: "Contact already added",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userAdded]);
  };

  const handleRemoveFromGroup = (removedUser) => {
    setSelectedUsers(
      selectedUsers.filter((sel) => sel._id !== removedUser._id)
    );
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill in all the fields!",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((usr) => usr._id)),
        },
        config
      );

      setChats([data, ...chats]);
      onClose();
      toast({
        title: "Group successfully created!",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    } catch (err) {
      toast({
        title: "Failed to create the group",
        description: err.response.data,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose} isCenetered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="28px" display="flex" justifyContent="center">
            Add group participants
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Group name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Type contact name"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box display="flex" w="100%" flexWrap="wrap">
              {selectedUsers.map((usr) => (
                <UserItem
                  key={usr._id}
                  user={usr}
                  handleFunction={() => handleRemoveFromGroup(usr)}
                />
              ))}
            </Box>
            {loading ? (
              <Spinner />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleSubmit}>
              Create chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
