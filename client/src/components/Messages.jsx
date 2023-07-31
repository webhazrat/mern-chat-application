import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { uniqBy } from "lodash";
import axios from "axios";
import Avatar from "./Avatar";
const Messages = ({
  selectedId,
  lastMessage,
  messages,
  sendMessage,
  sendFile,
  newMessageText,
  setNewMessageText,
}) => {
  const { username, userId } = useContext(UserContext);

  const messagesWithoutDupicate = uniqBy(messages, "_id");
  return (
    <>
      <div className="grow overflow-auto mb-2">
        {!selectedId && (
          <div className="h-full flex justify-center items-center text-gray-400">
            No selected person
          </div>
        )}
        {!!selectedId && (
          <div ref={lastMessage} className="h-full p-4 flex flex-col gap-4">
            {messagesWithoutDupicate.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === userId ? " flex-row-reverse" : ""
                } gap-2`}
              >
                {message.recipient === userId && (
                  <Avatar
                    username={username}
                    userId={message.sender}
                    small={true}
                  />
                )}
                <div
                  className={`p-3 ${
                    message.sender === userId
                      ? "bg-indigo-500 text-white rounded-l-xl rounded-tr-xl"
                      : "bg-gray-200 rounded-r-xl rounded-tl-xl"
                  }`}
                >
                  {message.text}
                  {message.file && (
                    <div>
                      <a
                        className="flex items-center gap-1 underline"
                        href={
                          axios.defaults.baseURL + "/uploads/" + message.file
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                          />
                        </svg>
                        {message.file}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {!!selectedId && (
        <div className="p-4 bg-white">
          <form className="w-full" onSubmit={sendMessage}>
            <div className="flex items-center gap-2">
              <label
                htmlFor="attachment"
                className="w-7 h-7 rounded-full transition-all hover:bg-gray-100 flex justify-center items-center cursor-pointer"
              >
                <input
                  type="file"
                  name="attachment"
                  id="attachment"
                  className="hidden"
                  onChange={sendFile}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-indigo-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                  />
                </svg>
              </label>
              <div className="relative grow">
                <input
                  type="text"
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  className="form-control !pr-12"
                  placeholder="Aa"
                />
                <button
                  type="submit"
                  className="h-full flex items-center absolute top-0 right-0 px-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
export default Messages;
