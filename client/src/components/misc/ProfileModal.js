import React from "react";
import {
  //   Button,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  //   ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { BsFillEyeFill } from "react-icons/bs";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          d={{ base: "flex" }}
          icon={<BsFillEyeFill />}
          onClick={onOpen}
        />
      )}

      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
            fontSize="40px"
            display="flex"
            justifyContent="center"
            textTransform="capitalize"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-around"
          >
            <Image
              borderRadius="full"
              boxSize="130px"
              src={user.picture}
              alt={user.name}
            />
            <Text fontSize={{ base: "28px", md: "30px" }}>{user.email}</Text>
          </ModalBody>

          {/* <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
