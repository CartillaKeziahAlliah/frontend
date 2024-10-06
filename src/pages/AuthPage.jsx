import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "./login";
import RegisterForm from "./signup";
import Background from "../assets/Login1.svg";
const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <div
      style={{
        background: `url(${Background})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      className="flex min-h-screen"
    >
      {/* Left Side - Logo Section */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex w-[80%] h-[80%] flex-col items-center justify-center">
          <img
            src="https://static.wixstatic.com/media/a7269e_9526c565a65f452ab7ab04f1fb03b196~mv2.png/v1/fit/w_2500,h_1330,al_c/a7269e_9526c565a65f452ab7ab04f1fb03b196~mv2.png"
            alt="School Logo"
            className="w-[80%] h-[80%] mb-4"
          />
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <LoginForm />
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <RegisterForm />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            {isLogin ? (
              <>
                Don&apos;t have an account?{" "}
                <span
                  onClick={toggleForm}
                  className="text-blue-500 hover:underline cursor-pointer"
                >
                  Register
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span
                  onClick={toggleForm}
                  className="text-blue-500 hover:underline cursor-pointer"
                >
                  Login
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
