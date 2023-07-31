import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

const UserContextProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("UserContext");

  useEffect(() => {
    axios
      .get("/profile")
      .then(({ data }) => {
        setUserId(data.userId);
        setUsername(data.username);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, []);

  return (
    <UserContext.Provider
      value={{ username, setUsername, userId, setUserId, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
