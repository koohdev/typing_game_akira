import React, { useState, useEffect, useRef } from "react";
import { Terminal as TermIcon, Send } from "lucide-react";
import { SHOP_DATA } from "../constants";

interface CLIProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string, payload?: any) => void;
}

const CLI: React.FC<CLIProps> = ({ isOpen, onClose, onAction }) => {
  const [history, setHistory] = useState<
    { type: "user" | "sys"; text: string }[]
  >([
    { type: "sys", text: "NEO_TOKYO_NET [VERSION 11.0]" },
    { type: "sys", text: "ENTER COMMAND OR QUERY..." },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isOpen]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim();
    setHistory((prev) => [...prev, { type: "user", text: cmd }]);
    setInput("");
    setIsLoading(true);

    const parts = cmd.split(" ");
    const main = parts[0].toLowerCase();

    // Internal Commands
    if (main === "clear") {
      setHistory([]);
      setIsLoading(false);
      return;
    }

    if (main === "help") {
      setHistory((prev) => [
        ...prev,
        {
          type: "sys",
          text: 'AVAILABLE_COMMANDS: clear, clear_cache(), system.hack(add:AMOUNT), theme.set("THEME_NAME"), help',
        },
      ]);
      setIsLoading(false);
      return;
    }

    if (main === "clear_cache()") {
      onAction("RESET_DATA");
      setHistory((prev) => [
        ...prev,
        { type: "sys", text: "SYSTEM_WIPE_INITIATED..." },
      ]);
      setIsLoading(false);
      return;
    }

    // Cheat Code: system.hack(add:5000)
    if (main.startsWith("system.hack")) {
      const match = cmd.match(/add:(\d+)/);
      if (match) {
        const amount = parseInt(match[1]);
        onAction("ADD_FUNDS", amount);
        setHistory((prev) => [
          ...prev,
          {
            type: "sys",
            text: `SYSTEM_OVERRIDE_SUCCESS. FUNDS_TRANSFERRED: ¥${amount}`,
          },
        ]);
      } else {
        setHistory((prev) => [
          ...prev,
          { type: "sys", text: `SYNTAX_ERROR. USAGE: system.hack(add:1000)` },
        ]);
      }
      setIsLoading(false);
      return;
    }

    if (main.startsWith("theme.set")) {
      const tName = cmd.match(/\(([^)]+)\)/)?.[1]?.replace(/['"]/g, "");
      const theme = SHOP_DATA.themes.find((t) => t.id === tName);
      if (theme) {
        onAction("SET_THEME", theme.id);
        setHistory((prev) => [
          ...prev,
          { type: "sys", text: `THEME_APPLIED: ${theme.name}` },
        ]);
      } else {
        setHistory((prev) => [
          ...prev,
          { type: "sys", text: `ERROR: THEME '${tName}' NOT FOUND OR LOCKED.` },
        ]);
      }
      setIsLoading(false);
      return;
    }

    // Unknown command
    setHistory((prev) => [
      ...prev,
      {
        type: "sys",
        text: `ERROR: UNKNOWN_COMMAND '${cmd}'. TYPE 'clear' OR 'help' FOR AVAILABLE COMMANDS.`,
      },
    ]);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-black/95 border-l border-grid z-[60] flex flex-col font-term shadow-2xl animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-grid bg-grid/20 flex justify-between items-center text-akira-red">
        <div className="flex items-center gap-2">
          <TermIcon size={18} />
          <span>NET_TERMINAL</span>
        </div>
        <span className="text-xs animate-pulse">ONLINE</span>
      </div>

      {/* Output */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-2 text-sm"
        ref={scrollRef}
      >
        {history.map((line, i) => (
          <div
            key={i}
            className={`${
              line.type === "user" ? "text-white" : "text-accent"
            } break-words`}
          >
            <span className="opacity-50 mr-2">
              {line.type === "user" ? ">" : "#"}
            </span>
            {line.text}
          </div>
        ))}
        {isLoading && (
          <div className="text-accent animate-pulse">PROCESSING...</div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleCommand}
        className="p-4 border-t border-grid flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-700 font-term"
          placeholder="Type command..."
          autoFocus
        />
        <button type="submit" className="text-accent hover:text-white">
          <Send size={18} />
        </button>
      </form>

      <div className="p-2 bg-grid/30 text-[10px] text-gray-500 text-center uppercase">
        Press ESC to close | Help: 'theme.set("matrix")'
      </div>
    </div>
  );
};

export default CLI;
