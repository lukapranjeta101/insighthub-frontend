import { useState } from "react";
import { Send } from "lucide-react";

export default function ChatInput({ onSend }) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  return (
    <div className="flex items-center gap-3 mt-4">
      <input
        className="flex-1 border rounded-xl px-4 py-2 bg-gray-100 outline-none"
        placeholder="Type a message..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 flex items-center gap-2"
      >
        <Send size={18} /> Send
      </button>
    </div>
  );
}
