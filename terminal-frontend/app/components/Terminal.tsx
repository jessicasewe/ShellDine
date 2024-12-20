"use client";

import { useState, useEffect } from "react";

interface MenuItem {
  name: string;
  price: string;
  description: string;
  emoji: string;
}

const Terminal = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);

  // Fetch menu from backend
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch("http://localhost:5080/api/menu"); // Replace with your API endpoint
        const data = await response.json();
        setMenu(data);
      } catch (error) {
        setHistory((prev) => [
          ...prev,
          "Failed to load the menu. Please try again later.",
        ]);
      }
    };
    fetchMenu();
  }, []);

  const handleCommand = (command: string) => {
    let response = "";
    switch (command.toLowerCase()) {
      case "help":
        response =
          "Available commands: \n1. menu - View the food menu\n2. order [item] - Order a food item\n3. clear - Clear the terminal\n4. exit - Close the terminal";
        break;
      case "menu":
        if (menu.length === 0) {
          response = "Menu is loading... Please wait.";
        } else {
          response =
            "🍴 Menu:\n" +
            menu
              .map(
                (item) =>
                  `${item.emoji} ${item.name} - $${item.price}\n   ${item.description}`
              )
              .join("\n");
        }
        break;
      case "clear":
        setHistory([]);
        return;
      case "exit":
        response = "Goodbye! Type 'help' if you need me again.";
        break;
      default:
        if (command.startsWith("order")) {
          const itemName = command.split(" ")[1];
          const menuItem = menu.find(
            (item) => item.name.toLowerCase() === itemName.toLowerCase()
          );
          if (menuItem) {
            response = `Order placed for ${menuItem.name}. Thank you! 🍴`;
          } else {
            response = `Item '${itemName}' not found in the menu.`;
          }
        } else {
          response = `Command not found: ${command}. Type 'help' for a list of commands.`;
        }
    }
    setHistory((prev) => [...prev, `> ${command}`, response]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleCommand(input.trim());
      setInput("");
    }
  };

  return (
    <div className="bg-black text-green-500 p-6 font-mono rounded-md shadow-lg max-w-3xl mx-auto">
      <div className="mb-4 text-yellow-500">🌟 Welcome to ShellDine 🌟</div>
      <div className="overflow-y-auto max-h-60 mb-4">
        {history.map((line, index) => (
          <div key={index} className="text-green-400 whitespace-pre-line">
            {line}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-2 flex items-center">
          <span className="text-cyan-500">shelldine@Terminal</span>:~$
          <input
            className="bg-transparent border-none outline-none text-green-500 ml-2 flex-1"
            type="text"
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

export default Terminal;
