import React, { useEffect, useState } from 'react'
import { MessageCircle, X, Send, Minimize2, Maximize2, Phone } from 'lucide-react'

export default function FloatingWidgets() {
  const [visible, setVisible] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMinimized, setChatMinimized] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
  setVisible(true)
  setTimeout(() => {
    setChatOpen(true)
    setMessages([{ from: 'bot', text: 'Hi! How can I help you today?' }])
  }, 1000)
}, [])


  const hideWidgets = () => {
    setVisible(false)
    localStorage.setItem('widgetsHidden', 'true')
  }

  const handleSend = async () => {
    if (!input.trim()) return
    const userMessage = input
    setMessages(prev => [...prev, { from: 'user', text: userMessage }])
    setInput('')
    setIsTyping(true)

    try {
      const res = await fetch('https://mos-chatbot.onrender.com/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      })

      const data = await res.json()
      setIsTyping(false)
      setMessages(prev => [...prev, { from: 'bot', text: data.reply }])
    } catch (error) {
      setIsTyping(false)
      setMessages(prev => [...prev, { from: 'bot', text: 'Sorry, something went wrong.' }])
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const toggleChat = () => {
    setChatOpen(!chatOpen)
    if (!chatOpen) setUnreadCount(0)
  }

  const toggleMinimize = () => setChatMinimized(!chatMinimized)

  if (!visible) return null

  return (
    <>
      {chatOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setChatOpen(false)}
        />
      )}

      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 sm:gap-3">
        <button
          onClick={hideWidgets}
          className="group bg-gray-800 hover:bg-red-500 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
          title="Hide all widgets"
        >
          <X className="w-4 h-4 transition-transform group-hover:rotate-90" />
        </button>

        <a
          href="https://wa.me/447301096908"
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-green-500 hover:bg-green-600 text-white p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 relative"
          title="Chat on WhatsApp"
        >
          <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
          <Phone className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
        </a>

        <div className="relative">
          {chatOpen ? (
            <div className={`
              fixed md:relative
              inset-x-4 bottom-20 md:inset-auto md:bottom-auto
              w-auto md:w-80 lg:w-96
              bg-white rounded-2xl shadow-2xl border border-gray-200 
              overflow-hidden transition-all duration-300 ease-in-out
              ${chatMinimized ? 'h-12' : 'h-96 md:h-auto'}
            `}>
              <div className="bg-gradient-to-r from-[#b8934d] to-[#b8934d] text-white p-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src="/logo.jpg" 
                      alt="Helpin Hand Tutor" 
                      className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div>
                    <span className="text-sm sm:text-base font-semibold block">Helping Hand Tutor</span>
                    <span className="text-xs text-white opacity-90">Online now</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={toggleMinimize}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                    title={chatMinimized ? "Maximize" : "Minimize"}
                  >
                    {chatMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={() => setChatOpen(false)}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                    title="Close chat"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!chatMinimized && (
                <>
                  <div className="relative p-3 h-64 md:h-72 overflow-y-auto custom-scrollbar">
                    <div 
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
                      style={{ backgroundImage: 'url(/images/hero-background.png)' }}
                    ></div>
                    <div className="absolute inset-0 bg-[#0d1a2e] bg-opacity-30"></div>

                    <div className="relative z-10 space-y-3">
                      {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`
                            max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-lg
                            ${msg.from === 'bot'
                              ? 'bg-white text-gray-800 border border-gray-100 rounded-tl-md backdrop-blur-sm' 
                              : 'bg-gradient-to-r from-[#c54d42] to-[#9e1b1b] text-white rounded-tr-md'}
                            transform transition-all duration-200 hover:scale-105
                          `}>
                            {msg.text}
                          </div>
                        </div>
                      ))}

                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-white text-gray-800 p-3 rounded-2xl rounded-tl-md shadow-lg border border-gray-100 flex items-center gap-1 backdrop-blur-sm">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white border-t border-gray-100 p-3 backdrop-blur-sm">
                    <div className="flex items-end gap-2">
                      <div className="flex-1 relative">
                        <textarea
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="w-full px-4 py-2 text-sm border border-gray-200 rounded-full resize-none outline-none focus:ring-2 focus:ring-[#c54d42] focus:border-transparent transition-all duration-200 max-h-20 bg-white bg-opacity-90"
                          placeholder="Type your message..."
                          rows="1"
                          style={{ minHeight: '40px', height: 'auto' }}
                        />
                      </div>
                      <button 
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className="bg-gradient-to-r from-[#b8934d] to-[#b8934d] hover:from-[#0d1a2e] hover:to-[#0d1a2e] disabled:from-gray-300 disabled:to-gray-400 text-white p-2 rounded-full transition-all duration-200 transform hover:scale-110 disabled:scale-100 disabled:cursor-not-allowed shadow-md"
                        title="Send message"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={toggleChat}
              className="group relative bg-gradient-to-r from-[#b8934d] to-[#b8934d] hover:from-[#0d1a2e] hover:to-[#0d1a2e] text-white p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
              title="Open support chat"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#c54d42] to-[#9e1b1b] rounded-full animate-ping opacity-20 group-hover:opacity-30"></div>
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
              {unreadCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-bounce">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </div>
              )}
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  )
}
