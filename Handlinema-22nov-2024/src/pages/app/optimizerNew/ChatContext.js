import React, { useState, createContext } from "react";
import { chatData } from "./ChatData";

export const ChatContext = createContext();

export const ChatContextProvider = (props) => {
  const [chat, setChat] = useState(chatData);

  // Function for deleting a conversation
  const deleteConvo = (id) => {
    let data = chat;
    data = data.filter((item) => item.id !== id);
    setChat([...data]);
  };

  // Universal function for any props
  const propAction = (id, prop) => {
    let data = chat;
    const index = data.findIndex((item) => item.id === id);
    data[index][prop] = true;
    setChat([...data]);
  };

  return (
    <ChatContext.Provider
      value={{
        chatState: [chat, setChat],
        chatData: chat,
        deleteConvo: deleteConvo,
        propAction: propAction,
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
};
