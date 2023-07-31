import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useParams } from "react-router-dom";
import _ from "lodash";
import { scrollToLastMessage } from "../utilities.js";
import axios from "axios";
import Header from "../components/Header";
import Messages from "../components/Messages";
import People from "../components/People";

const ChatPage = () => {
  const [ws, setWs] = useState(null);
  const [people, setPeople] = useState([]);
  const [onlinePeople, setOnlinePeople] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [newMessageText, setNewMessageText] = useState("");
  const [messages, setMessages] = useState([]);

  const { id } = useParams();
  const lastMessage = useRef(null);

  const { username, userId } = useContext(UserContext);

  useEffect(() => {
    connectToWs();
  }, [selectedId]);

  useEffect(() => {
    scrollToLastMessage(lastMessage);
  }, [messages]);

  useEffect(() => {
    axios.get("/people").then(({ data: people }) => {
      setPeople(people);
    });
  }, [onlinePeople]);

  useEffect(() => {
    if (id) {
      axios.get(`/messages/${id}`).then(({ data }) => {
        setSelectedId(id);
        setMessages(data);
      });
    } else {
      setSelectedId("");
    }
  }, [id]);

  const connectToWs = () => {
    const ws = new WebSocket("ws://localhost:5000");
    console.log("Connected!");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () => {
      setTimeout(() => {
        console.log("Disconnected! Try to connect");
        connectToWs();
      }, 1000);
    });
  };

  const handleMessage = (res) => {
    const responseData = JSON.parse(res.data);
    if ("online" in responseData) {
      const { online } = responseData;
      setOnlinePeople(_.uniqWith(online, _.isEqual));
    } else if ("text" in responseData) {
      if (responseData.sender === selectedId) {
        setMessages((prev) => [...prev, { ...responseData }]);
      }
    }
  };

  const sendMessage = (e, file = null) => {
    if (e) e.preventDefault();
    ws.send(
      JSON.stringify({
        recipient: selectedId,
        text: newMessageText,
        file,
      })
    );
    if (file) {
      setTimeout(() => {
        axios.get(`/messages/${selectedId}`).then(({ data }) => {
          setMessages(data);
        });
      }, 500);
    } else {
      setNewMessageText("");
      setMessages((prev) => [
        ...prev,
        {
          text: newMessageText,
          sender: userId,
          recipient: selectedId,
          _id: Date.now(),
        },
      ]);
    }
  };

  const sendFile = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        sendMessage(null, {
          name: e.target.files[0].name,
          data: reader.result,
        });
      };
    }
  };

  return (
    <div>
      <div className="h-screen flex flex-col">
        <Header />
        <div className="flex grow">
          <People
            people={people}
            onlinePeople={onlinePeople}
            selectedId={selectedId}
          />
          <div className="bg-white grow flex flex-col h-[calc(100vh_-_61px)] ">
            <Messages
              selectedId={selectedId}
              messages={messages}
              sendFile={sendFile}
              sendMessage={sendMessage}
              newMessageText={newMessageText}
              setNewMessageText={setNewMessageText}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatPage;
