import { useEffect, useRef, useState } from 'react';
import Smartyamen from "./imgs/YamenSuitCropped.png";

const personalities = {
  yamengpt: {
    name: 'YamenGPT 🧠',
    img: Smartyamen,
    bgColor: 'bg-blue-600',
    textColor: 'text-white',
    description: 'A smart AI bot focused on delivering precise answers and thoughtful insights.',
  },
  yamen: {
    name: 'Yamen 🤪',
    img: 'https://i.imgur.com/4Yf2Wqk.png',
    bgColor: 'bg-yellow-500',
    textColor: 'text-black',
    description: 'A goofy, fun-loving bot that likes to keep the chat light and humorous.',
  },
};

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [personality, setPersonality] = useState('yamengpt');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // modal open + animation state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Open modal with animation
  const openModal = () => {
    setModalVisible(true);
    setTimeout(() => setModalOpen(true), 10); // small delay to trigger transition
  };

  // Close modal with animation
  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setModalVisible(false), 300); // match animation duration
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const res = await fetch('https://yamengpt-server.vercel.app/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages, personality }),
    });

    const data = await res.json();
    const aiReply = data?.choices?.[0]?.message?.content || 'Error';

    setMessages([...newMessages, { role: 'assistant', content: aiReply }]);
    setLoading(false);
  };

  const switchPersonality = (name) => {
    setMessages([]);
    setPersonality(name);
    setInput('');
    setSidebarOpen(false);
  };

  const resetChat = () => {
    setMessages([]);
  };

  const currentPersonality = personalities[personality];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex overflow-hidden">
      {/* Sidebar toggle arrow */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle personalities sidebar"
        className="fixed left-0 top-1/2 transform -translate-y-1/2 z-50 bg-gray-800 rounded-r-lg p-2 hover:bg-gray-700 transition"
      >
        <svg
          className={`w-6 h-6 text-white transition-transform duration-300 ${
            sidebarOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-800 shadow-lg z-40 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 flex flex-col p-6`}
      >
        <h2 className="text-xl font-bold mb-6 text-center">Choose Personality</h2>
        <div className="flex flex-col gap-6">
          {Object.entries(personalities).map(([key, p]) => (
            <button
              key={key}
              onClick={() => switchPersonality(key)}
              className={`flex items-center gap-4 px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none ${
                personality === key
                  ? `${p.bgColor} ${p.textColor} font-semibold shadow-lg`
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              <img
                src={p.img}
                alt={p.name}
                className="w-12 h-12 rounded-full object-cover select-none"
                draggable={false}
              />
              <span className="text-lg">{p.name}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main
        className={`flex-1 transition-margin duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-0'
        } max-w-4xl mx-auto flex flex-col h-screen px-6 py-4`}
      >
        <h1 className="text-3xl font-bold text-center mb-4">{currentPersonality.name} Chat</h1>

        {/* Chat messages container */}
        <div
          ref={chatRef}
          className="bg-gray-800 rounded-xl p-4 flex-1 overflow-y-auto flex flex-col gap-3 scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-gray-700 mb-4"
          style={{
            scrollbarColor: '#2563eb #374151',
            scrollbarWidth: 'thin',
          }}
        >
          {messages.map((msg, i) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={i}
                className={`max-w-[80%] px-4 py-2 rounded-xl ${
                  isUser ? 'self-end bg-blue-600 text-right' : 'self-start bg-gray-700 text-left'
                }`}
              >
                <div
                  className={`text-xs font-semibold mb-1 ${
                    isUser ? 'text-blue-400' : 'text-yellow-400'
                  }`}
                >
                  {isUser ? 'You' : currentPersonality.name}
                </div>
                <div>{msg.content}</div>
              </div>
            );
          })}

          {loading && (
            <div className="self-start bg-gray-700 px-4 py-2 rounded-xl flex items-center gap-2">
              <span className="text-yellow-400 font-semibold">{currentPersonality.name} is typing</span>
              <span className="dots flex space-x-1">
                <span className="dot animate-bounce">.</span>
                <span className="dot animate-bounce delay-150">.</span>
                <span className="dot animate-bounce delay-300">.</span>
              </span>
            </div>
          )}
        </div>

        {/* Input/buttons and personality picture container */}
        <div className="flex items-center gap-4">
          {/* Input and buttons */}
          <div className="flex gap-2 flex-1 items-center">
            <input
              type="text"
              className="flex-1 p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Say something..."
              disabled={loading}
              autoComplete="off"
              spellCheck={false}
            />
            <button
              className="bg-blue-600 px-5 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              onClick={sendMessage}
              disabled={loading}
            >
              Send
            </button>
            <button
              onClick={resetChat}
              className="bg-red-600 px-4 py-3 rounded-lg hover:bg-red-700"
              disabled={loading}
            >
              Reset Chat
            </button>
          </div>

          {/* Bigger Personality profile picture with click handler */}
          <img
            src={currentPersonality.img}
            alt={currentPersonality.name}
            className="w-24 h-24 rounded-full object-cover select-none border-4 border-blue-600 shadow-lg cursor-pointer"
            draggable={false}
            onClick={openModal}
          />
        </div>
      </main>

      {/* Modal popup */}
      {modalVisible && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300 ${
            modalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={closeModal}
        >
          <div
            className={`bg-gray-800 rounded-lg p-8 max-w-lg w-full relative transform transition-transform duration-300 ${
              modalOpen ? 'scale-100' : 'scale-90'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-white hover:text-red-500 font-bold text-3xl leading-none"
              aria-label="Close popup"
              onClick={closeModal}
            >
              &times;
            </button>
            <img
              src={currentPersonality.img}
              alt={currentPersonality.name}
              className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-blue-600 shadow-md"
              draggable={false}
            />
            <h2 className="text-3xl font-bold text-center mb-4">{currentPersonality.name}</h2>
            <p className="text-center text-gray-300 text-lg">{currentPersonality.description}</p>
          </div>
        </div>
      )}

      {/* Custom scrollbar styles and bounce animation dots */}
      <style>{`
        /* For Firefox */
        * {
          scrollbar-width: thin;
          scrollbar-color: #2563eb #374151;
        }
        /* For Chrome, Edge, Safari */
        *::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        *::-webkit-scrollbar-track {
          background: #374151; /* gray-700 */
          border-radius: 8px;
        }
        *::-webkit-scrollbar-thumb {
          background-color: #2563eb; /* blue-600 */
          border-radius: 8px;
          border: 2px solid #374151;
        }
        /* Bounce animation dots */
        .dot {
          animation-name: bounce;
          animation-duration: 1.4s;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
}
