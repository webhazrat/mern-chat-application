import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import Avatar from "./Avatar";
import { UserContext } from "../contexts/UserContext";
import Loader from "./Loader";

const Header = () => {
  const [show, setShow] = useState(false);

  const { username, userId, setUserId, setUsername, loading } =
    useContext(UserContext);

  const logout = (e) => {
    e.preventDefault();
    axios.post("/logout").then(({ data }) => {
      setUserId(null);
      setUsername(null);
    });
  };

  if (loading) {
    return <Loader />;
  }

  if (!loading && !username && !userId) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <div className="flex justify-between items-center py-2 px-5 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-indigo-500">Messenger</h1>
        <div className="cursor-pointer relative" onClick={() => setShow(!show)}>
          <Avatar username={username} userId={userId} indicator={false} />
          <div
            className={`bg-white shadow-lg rounded-md w-60 absolute z-10 right-0 border border-gray-100 ${
              show ? "block" : "hidden"
            }`}
          >
            <div className="flex items-center gap-2 border-b border-gray-200 py-3 px-4">
              <Avatar username={username} userId={userId} indicator={false} />
              <span className="text-[17px] font-semibold">{username}</span>
            </div>
            <div className="flex flex-col gap-5 p-4">
              <Link to={"/profile"} className="flex items-center gap-2">
                <span>
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
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </span>
                Profile settings
              </Link>
              <Link to={"/messages"} className="flex items-center gap-2">
                <span>
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
                      d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                    />
                  </svg>
                </span>
                Messenger
              </Link>
              <div className="flex items-center gap-2">
                <span>
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
                      d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                    />
                  </svg>
                </span>
                Display accessibility
              </div>
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <span>
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
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                    />
                  </svg>
                </span>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Header;
