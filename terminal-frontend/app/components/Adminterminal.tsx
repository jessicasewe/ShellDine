"use client";

import { useState } from "react";

// API function to call backend login
const login = async (username: string, password: string) => {
  try {
    const response = await fetch(`http://localhost:5080/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const responseText = await response.text();
      if (responseText.includes("<html>")) {
        throw new Error("Unexpected HTML response from server.");
      }
      const errorData = JSON.parse(responseText);
      throw new Error(errorData.error || "Login failed.");
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "An error occurred during login.");
    } else {
      throw new Error("An error occurred during login.");
    }
  }
};

const AdminTerminal = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [expectingPassword, setExpectingPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCommand = (command: string) => {
    let response = "";
    switch (command.toLowerCase()) {
      case "help":
        response =
          "Available commands:\n1. login - Admin Login\n2. exit - Close the terminal";
        break;
      case "login":
        if (!isLoggingIn) {
          response = "Please enter your username:";
          setIsLoggingIn(true);
        }
        break;
      case "exit":
        response = "Goodbye! Type 'help' if you need me again.";
        setHistory([]);
        break;
      default:
        response = `Command not found: ${command}. Type 'help' for a list of commands.`;
    }
    setHistory((prev) => [...prev, `> ${command}`, response]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      if (isLoggingIn) {
        if (!username) {
          setUsername(input.trim());
          setHistory((prev) => [
            ...prev,
            `> ${input}`,
            "Please enter your password:",
          ]);
          setExpectingPassword(true);
        } else if (expectingPassword) {
          setPassword(input.trim());
          try {
            const token = await login(username, input.trim());
            localStorage.setItem("authToken", token);
            setHistory((prev) => [
              ...prev,
              "> [hidden]", // Replace password input with [hidden] in history
              "Login successful! Welcome to the Admin Terminal.",
            ]);
          } catch (error) {
            setErrorMessage((error as Error).message);
            setHistory((prev) => [
              ...prev,
              "> [hidden]",
              (error as Error).message,
            ]);
          }
          setIsLoggingIn(false);
          setUsername("");
          setPassword("");
          setExpectingPassword(false);
        }
      } else {
        handleCommand(input.trim());
      }
      setInput("");
    }
  };

  return (
    <div className="bg-black text-green-500 p-6 font-mono rounded-md shadow-lg max-w-3xl mx-auto">
      <div className="mb-4 text-yellow-500">
        🌟 Welcome to the Admin Terminal 🌟
      </div>
      <div className="overflow-y-auto max-h-60 mb-4">
        {history.map((line, index) => (
          <div key={index} className="text-green-400 whitespace-pre-line">
            {line}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-2 flex items-center">
          <span className="text-cyan-500">admin@Terminal</span>:~$
          <input
            className="bg-transparent border-none outline-none text-green-500 ml-2 flex-1"
            type={expectingPassword ? "password" : "text"}
            placeholder="Type a command..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
      </form>
      <div className="text-gray-400 text-sm">
        Type <span className="text-blue-400">help</span> to see available
        commands.
      </div>
    </div>
  );
};

export default AdminTerminal;
