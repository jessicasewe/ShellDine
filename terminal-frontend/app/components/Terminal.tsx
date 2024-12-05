"use client";

const Terminal = () => {
  return (
    <div className="bg-black text-green-500 p-6 font-mono rounded-md shadow-lg max-w-3xl mx-auto">
      <div className="mb-4 text-yellow-500">🌟 Welcome to ShellDine 🌟</div>
      <div className="mb-2">
        <span className="text-cyan-500">shelldine@Terminal</span>:~$
        <input
          className="bg-transparent border-none outline-none text-green-500 ml-2 w-2/3"
          type="text"
          placeholder="Type a command..."
        />
      </div>
      <div className="text-gray-400 text-sm">
        Commands available: <span className="text-blue-400">help</span>,{" "}
        <span className="text-blue-400">clear</span>,{" "}
        <span className="text-blue-400">exit</span>
      </div>
    </div>
  );
};

export default Terminal;
