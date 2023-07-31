const Avatar = ({ online, username, userId, small, indicator = true }) => {
  const colors = [
    "bg-red-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-blue-500",
    "bg-yellow-500",
  ];
  let color;
  if (userId) {
    const userIdBase = parseInt(userId, 16);
    const colorIndex = userIdBase % colors.length;
    color = colors[colorIndex];
  }
  return (
    <>
      <div
        className={`${!small ? "w-11 h-11" : "w-8 h-8"} flex-shrink-0 ${
          color ? color : colors[0]
        } rounded-full uppercase flex justify-center items-center text-white font-bold relative`}
      >
        {username?.[0]}
        {online && indicator && (
          <div className="absolute bottom-0 right-0 w-[10px] h-[10px] bg-green-500 shadow-lg shadow-black rounded-full ring-2 ring-white"></div>
        )}
        {!online && !small && indicator && (
          <div className="absolute bottom-0 right-0 w-[10px] h-[10px] bg-gray-400 shadow-lg shadow-black rounded-full ring-2 ring-white"></div>
        )}
      </div>
    </>
  );
};
export default Avatar;
