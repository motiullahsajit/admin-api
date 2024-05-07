"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [resetStep, setResetStep] = useState("login");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [timer, setTimer] = useState(300);
  const timerRef: any = useRef(null);

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/admin", {
        username,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("userId", user.id);
      localStorage.setItem("token", token);

      router.push("/dashboard");
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("Invalid username or password");
    }
  };

  const handleInitiateReset = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:3000/api/admin/initiate`,
        {
          email,
        }
      );
      if (response?.data?.success === true) {
        alert(response.data.message);
        setResetStep("reset-confirm");
      } else {
        setResetStep("login");
      }
    } catch (error: any) {
      console.error("Initiate reset failed:", error.response.data);
      setErrorMessage(error.response.data.message);
    }
  };

  const handleResetPassword = async (e: any) => {
    e.preventDefault();

    try {
      await axios.post(`http://localhost:3000/api/admin/confirm`, {
        code: verificationCode,
        newPassword,
      });

      setResetStep("login");
      setErrorMessage(
        "Password reset successful. Please login with your new password."
      );
    } catch (error: any) {
      console.error("Password reset failed:", error.response.data);
      setErrorMessage(error.response.data.message);
    }
  };

  const handleSteps = (step: string) => {
    setResetStep(step);
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => {
      clearTimer();
    };
  }, []);

  useEffect(() => {
    if (
      newPassword !== "" &&
      confirmNewPassword !== "" &&
      newPassword !== confirmNewPassword
    ) {
      setErrorMessage("Passwords do not match");
    } else {
      setErrorMessage("");
    }
  }, [newPassword, confirmNewPassword]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div>
        {resetStep === "login" && (
          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-3 w-[400px] bg-gray-200 p-10 rounded"
          >
            <label htmlFor="username">Username</label>
            <input
              className="h-[40px] px-3 rounded"
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
            <label htmlFor="password">Password</label>
            <input
              className="h-[40px] px-3 rounded"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}

            <button
              className="h-[40px]  text-white px-3 rounded  bg-gray-700"
              type="submit"
            >
              Login
            </button>
            <button
              onClick={() => handleSteps("initiate-reset")}
              className="h-[40px]  text-white px-3 rounded bg-gray-700"
              type="button"
            >
              Forgot Password?
            </button>
          </form>
        )}
        {resetStep === "initiate-reset" && (
          <form
            onSubmit={handleInitiateReset}
            className="flex flex-col gap-3 w-[400px] bg-gray-200 p-10 rounded"
          >
            <label htmlFor="email">Email</label>
            <input
              className="h-[40px] px-3 rounded"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />

            <button
              className="h-[40px] text-white px-3 rounded  bg-gray-700"
              type="submit"
            >
              Confirm
            </button>
            <button
              onClick={() => handleSteps("login")}
              className="h-[40px] text-white px-3 rounded bg-gray-700"
              type="button"
            >
              Back to Login
            </button>
          </form>
        )}
        {resetStep === "reset-confirm" && (
          <form
            onSubmit={handleResetPassword}
            className="flex flex-col gap-3 w-[400px] bg-gray-200 p-10 rounded"
          >
            <label htmlFor="verificationCode">Verification Code</label>
            <input
              className="h-[40px] px-3 rounded"
              type="text"
              name="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Verification Code"
              required
            />
            <label htmlFor="newPassword">New Password</label>
            <input
              className="h-[40px] px-3 rounded"
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              required
            />
            <label htmlFor="confirmNewPassword">Confirm New Password</label>
            <input
              className="h-[40px] px-3 rounded"
              type="password"
              name="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Confirm New Password"
              required
            />
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <p>
              Time remaining: {Math.floor(timer / 60)}:
              {timer % 60 < 10 ? "0" + (timer % 60) : timer % 60}
            </p>
            <button
              className="h-[40px] text-white px-3 rounded bg-gray-700"
              type="submit"
            >
              Reset Password
            </button>
            <button
              onClick={() => handleSteps("login")}
              className="h-[40px] text-white px-3 rounded bg-gray-700"
              type="button"
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
