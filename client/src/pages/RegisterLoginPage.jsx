import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { Navigate } from "react-router-dom";

const RegisterLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("login");
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    both: "",
  });

  const {
    username: loggedInUsername,
    setUsername: setLoggedInUsername,
    setUserId,
  } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLoginOrRegister === "register" ? "/register" : "/login";

    if (username == "") {
      setErrors((prev) => ({ ...prev, username: "Username required" }));
    }
    if (password == "") {
      setErrors((prev) => ({ ...prev, password: "Password required" }));
    }
    if (username && password) {
      setErrors({
        username: "",
        password: "",
        both: "",
      });

      const payload = { username, password };
      try {
        const { data } = await axios.post(url, payload);
        setLoggedInUsername(username);
        setUserId(data.userId);
      } catch (err) {
        if (err.response.data.error?.username) {
          setErrors((prev) => ({
            ...prev,
            username: err.response.data.error.username,
          }));
        }

        if (err.response.data.error?.both) {
          setErrors((prev) => ({
            ...prev,
            both: err.response.data.error.both,
          }));
        }

        console.log(err);
      }
    }
  };

  const switchForm = (e, type) => {
    e.preventDefault();
    setIsLoginOrRegister(type);
    setErrors({
      username: "",
      password: "",
      both: "",
    });
  };

  if (loggedInUsername) {
    return <Navigate to={"/messages"} />;
  }

  return (
    <>
      <div className="bg-blue-50 h-screen flex justify-center items-center">
        <div className="w-full max-w-md bg-white rounded-lg p-10">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="username" className="label-control">
                Username
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-control "
                />
                {errors.username && (
                  <span className="text-[13px] text-red-500">
                    {errors.username}
                  </span>
                )}
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="label-control">
                Password
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                />
                {errors.password && (
                  <span className="text-[13px] text-red-500">
                    {errors.password}
                  </span>
                )}
              </div>
            </div>

            <button type="submit" className="btn-primary">
              {isLoginOrRegister === "register" ? "Register" : "Login"}
            </button>
            {errors.both && (
              <p className="text-center mt-2">
                <span className="text-[13px] text-red-500">{errors.both}</span>
              </p>
            )}
            <div className="text-center mt-3">
              {isLoginOrRegister === "register" && (
                <>
                  Already a member?{" "}
                  <button
                    type="button"
                    onClick={(e) => switchForm(e, "login")}
                    className="text-indigo-500 font-semibold"
                  >
                    Login
                  </button>
                </>
              )}

              {isLoginOrRegister === "login" && (
                <>
                  Do you have an account?{" "}
                  <button
                    type="button"
                    onClick={(e) => switchForm(e, "register")}
                    className="text-indigo-500 font-semibold"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default RegisterLoginPage;
