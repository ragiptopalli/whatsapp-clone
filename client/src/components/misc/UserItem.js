import { Badge } from "@chakra-ui/react";
import { BsX } from "react-icons/bs";
import React from "react";

const UserItem = ({ user, handleFunction }) => {
  return (
    <Badge
      display="flex"
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={10}
      colorScheme="purple"
      cursor="pointer"
      onClick={handleFunction}
    >
      {user.name}
      <BsX style={{ fontSize: "15px", marginLeft: "5px" }} />
    </Badge>
  );
};

export default UserItem;
