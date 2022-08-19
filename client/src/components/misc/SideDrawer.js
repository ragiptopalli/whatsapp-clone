import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { BsBellFill, BsChevronCompactDown, BsSearch } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { getSenderName } from "../../chatlogics/ChatLogics";
import { ChatState } from "../../context/Provider";
import ChatLoading from "./ChatLoading";
import ProfileModal from "./ProfileModal";
import UserListItem from "./UserListItem";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userInfos");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Enter something!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left",
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

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResults(data);
    } catch (err) {
      toast({
        title: "Could not fetch the contacts!",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
      return;
    }
  };

  const startChatting = async (userId) => {
    console.log("aaaa");
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);

      if (!chats.find((chat) => chat._id === data._id))
        setChats({ data, ...data });

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
      setSearch("");
      setSearchResults([]);
    } catch (err) {
      toast({
        title: "Could not fetch the chat!",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoadingChat(false);
      return;
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="#fff"
        w="100%"
        p="5px 10px 5px 10px"
        color="#000"
      >
        <Tooltip label="Search contacts" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <BsSearch />
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search Contact
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl">WhatsApp Clone</Text>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItem: "center",
          }}
        >
          <Menu>
            <MenuButton p={2} fontSize="2xl" justifyContent="center">
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BsBellFill />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "  No new messages!"}
              {notification.map((notify) => (
                <MenuItem
                  key={notify._id}
                  onClick={() => {
                    setSelectedChat(notify.chat);
                    setNotification(notification.filter((n) => n !== notify));
                  }}
                >
                  {notify.chat.isGroupChat
                    ? `New message in ${notify.chat.chatName}`
                    : `New message from ${getSenderName(
                        user,
                        notify.chat.users
                      )}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<BsChevronCompactDown />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.picture}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Contacts</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                focusBorderColor="green.300"
                _placeholder={{ fontSize: "15px" }}
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Search</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResults?.map((user, id) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => startChatting(user._id)}
                ></UserListItem>
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
