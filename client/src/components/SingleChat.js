import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import { BsArrowLeftShort } from 'react-icons/bs';
import React, { useEffect, useState } from 'react';
import { ChatState } from '../context/Provider';
import { getSenderName, getSenderInfos } from '../chatlogics/ChatLogics';
import ProfileModal from '../components/misc/ProfileModal';
import UpdateGroupChatModal from './misc/UpdateGroupChatModal';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import Lottie from 'react-lottie';
import animationData from '../animation/typing.json';

import io from 'socket.io-client';

const ENDPOINT = 'https://notwhatsapp-clone.herokuapp.com/';
let socket, selectedChatCompare;

const SingleChat = ({ reFetchChats, setReFetchChats }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const toast = useToast();

  const defaultLottieOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);
      socket.emit('join chat', selectedChat._id);
    } catch (err) {
      toast({
        title: 'Could not fetch chat!',
        description: err.response.data.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left',
      });
      return;
    }
  };

  const sendMsg = async (e) => {
    if (e.key === 'Enter' && newMessage) {
      socket.emit('stop typing', selectedChat._id);
      try {
        const config = {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage('');

        const { data } = await axios.post(
          '/api/message',
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        socket.emit('new message', data);
        setMessages([...messages, data]);
      } catch (err) {
        toast({
          title: 'Could not send message!',
          description: err.response.data.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'bottom-left',
        });
        return;
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    socket.on('connected', () => {
      setSocketConnected(true);
    });
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on('message recieved', (newMsgRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMsgRecieved.chat._id
      ) {
        if (!notification.includes(newMsgRecieved)) {
          setNotification([newMsgRecieved, ...notification]);
          setReFetchChats(!reFetchChats);
        }
        return;
      } else {
        setMessages([...messages, newMsgRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }

    let timeoutTyping = new Date().getTime();
    let timeoutTime = 3000;

    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - timeoutTyping;

      if (timeDiff >= timeoutTime && typing) {
        socket.emit('stop typing', selectedChat._id);
        setTyping(false);
      }
    }, timeoutTime);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: '28px', md: '30px' }}
            pb={3}
            px={2}
            w='100%'
            display='flex'
            justifyContent={{ base: 'space-between' }}
            alignItems='center'
          >
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<BsArrowLeftShort />}
              onClick={() => setSelectedChat('')}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSenderName(user, selectedChat.users)}
                <ProfileModal user={getSenderInfos(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  reFetchChats={reFetchChats}
                  setReFetchChats={setReFetchChats}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display='flex'
            flexDir='column'
            justifyContent='flex-end'
            p={3}
            bg='#E8E8E8'
            w='100%'
            h='100%'
            borderRadius='lg'
            overflowY='hidden'
          >
            {loading ? (
              <Spinner
                size='xl'
                w={20}
                h={20}
                alignSelf='center'
                margin='auto'
              />
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflowY: 'scroll',
                  scrollbarWidth: 'none',
                }}
              >
                {<ScrollableChat messages={messages} />}
              </div>
            )}
            <FormControl onKeyDown={sendMsg} mt={3} isRequired>
              {isTyping ? <span>...</span> : <></>}
              <Input
                variant='filled'
                bg='#E0E0E0'
                placeholder='Start chatting...'
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display='flex'
          alignItems='center'
          justifyContent='center'
          h='100%'
        >
          <Text fontSize='3xl' pb={3}>
            Click a contact to start chatting!
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
