export default function ChatWindow({ messages }) {
  return (
    <div className="space-y-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${
            msg.sender === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-md px-4 py-2 rounded-xl shadow ${
              msg.sender === "user"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            {msg.text}
          </div>
        </div>
      ))}
    </div>
  );
}
