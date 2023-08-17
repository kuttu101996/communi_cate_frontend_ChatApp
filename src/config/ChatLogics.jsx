export const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const isSameSender = (messages, currMsg, index, loggedUserId) => {
  return (
    index < messages.length - 1 &&
    (messages[index + 1].sender._id !== currMsg.sender._id ||
      messages[index + 1].sender._id === undefined) &&
    messages[index].sender._id !== loggedUserId
  );
};

export const isLastMessage = (messages, index, loggedUserId) => {
  return (
    index === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== loggedUserId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameSenderMargin = (messages, currMsg, index, loggedUserId) => {
  if (
    index < messages.length - 1 &&
    messages[index + 1].sender._id === currMsg.sender._id &&
    currMsg.sender._id !== loggedUserId
  )
    return "33px";
  else if (
    (index < messages.length - 1 &&
      messages[index + 1].sender._id !== currMsg.sender._id &&
      messages[index].sender._id !== loggedUserId) ||
    (index === messages.length - 1 &&
      messages[index].sender._id !== loggedUserId)
  )
    return "0px";
  else return "auto";
};

export const isSameUser = (messages, currMsg, index) => {
  return index > 0 && messages[index - 1].sender._id === currMsg.sender._id;
};
