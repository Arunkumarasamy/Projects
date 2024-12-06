// UserContext.js
import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ role: "super_admin" }); // Default role is 'super_admin'

  const changeRole = (role) => {
    setUser((prevState) => ({ ...prevState, role }));
  };

  return (
    <UserContext.Provider value={{ user, changeRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
