import { Link } from "react-router-dom";
import Avatar from "./Avatar";
const Contact = ({ online, username, userId, selectedId }) => {
  return (
    <Link
      to={`/messages/${userId}`}
      className={`${
        selectedId === userId
          ? "bg-indigo-50 hover:bg-indigo-50"
          : "bg-white hover:bg-gray-100 "
      } p-3 rounded-lg cursor-pointer transition-all flex items-center gap-2`}
    >
      <Avatar online={online} username={username} userId={userId} />
      <div className="flex flex-col">
        <h4 className="text-indigo-500 text-[15px]">{username}</h4>
        <span className="text-[13px] text-gray-500">Something goes here</span>
      </div>
    </Link>
  );
};
export default Contact;
