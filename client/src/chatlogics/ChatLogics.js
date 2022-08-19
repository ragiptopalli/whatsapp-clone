export const getSenderName = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export const getSenderInfos = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const isSameSender = (messages, currMsg, currIndex, currUserId) => {
  return (
    currIndex < messages.length - 1 &&
    (messages[currIndex + 1].sender._id !== currMsg.sender._id ||
      messages[currIndex + 1].sender._id === undefined) &&
    messages[currIndex].sender._id !== currUserId
  );
};

export const isLastMessage = (messages, currIndex, currUserId) => {
  return (
    currIndex === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== currUserId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameSenderAlign = (messages, currMsg, currIndex, currUserId) => {
  if (
    currIndex < messages.length - 1 &&
    messages[currIndex + 1].sender._id === currMsg.sender._id &&
    messages[currIndex].sender._id !== currUserId
  )
    return 33;
  else if (
    (currIndex < messages.length - 1 &&
      messages[currIndex + 1].sender._id !== currMsg.sender._id &&
      messages[currIndex].sender._id !== currUserId) ||
    (currIndex === messages.length - 1 &&
      messages[currIndex].sender._id !== currUserId)
  )
    return 0;
  else return "auto";
};

export const isSameUser = (messages, currMsg, currIndex) => {
  return (
    currIndex > 0 && messages[currIndex - 1].sender._id === currMsg.sender._id
  );
};
