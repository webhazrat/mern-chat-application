import { useContext } from "react";
import Contact from "./Contact";
import _ from "lodash";
import { UserContext } from "../contexts/UserContext";
const People = ({ people, onlinePeople, selectedId }) => {
  const { userId: logggedInUser, username: loggedInUsername } =
    useContext(UserContext);
  const onlinePeopleWithoutCurrentUser = _.differenceWith(
    onlinePeople,
    [{ userId: logggedInUser, username: loggedInUsername }],
    _.isEqual
  );

  const offlinePeople = _.differenceWith(people, onlinePeople, _.isEqual);

  return (
    <>
      <div className="bg-white w-72 flex-shrink-0 border-r border-gray-200 p-2 h-[calc(100vh_-_61px)] overflow-auto">
        <h2 className="px-3 text-xl font-bold mb-3">Chats</h2>

        {onlinePeopleWithoutCurrentUser.length > 0 &&
          onlinePeopleWithoutCurrentUser.map(
            ({ userId, username }, index) =>
              userId && (
                <Contact
                  key={index}
                  online={true}
                  username={username}
                  userId={userId}
                  selectedId={selectedId}
                />
              )
          )}

        {offlinePeople.length > 0 &&
          offlinePeople.map(
            ({ userId, username }) =>
              userId && (
                <Contact
                  key={userId}
                  online={false}
                  username={username}
                  userId={userId}
                  selectedId={selectedId}
                />
              )
          )}
      </div>
    </>
  );
};
export default People;
