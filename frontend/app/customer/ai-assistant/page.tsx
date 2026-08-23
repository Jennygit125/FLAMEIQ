"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Send, Bell, Headphones, AlertCircle, ChevronRight, ChevronDown, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AiAssistantPage() {
  const { token, user } = useAuth();
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    
    const newUserMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          message: text,
          history: messages
        })
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const result = await response.json();
      const aiReply = result.data?.reply || "I'm sorry, I couldn't process that request.";
      
      setMessages((prev) => [...prev, { role: "assistant", content: aiReply }]);
    } catch (err: any) {
      setError(err.message || "Connection error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage(inputValue);
    }
  };

  const quickPrompts = [
    "How much did I spend on gas this month?",
    "When should I place my next order?",
    "How much gas do I have left?",
    "Show my previous gas orders",
    "When will my gas run out?",
    "When should I refill?"
  ];

  const searchHistory = [
    "How much did I spend on gas this month?",
    "When should I place my next order?",
    "How much gas do I have left?",
    "Show my previous gas orders"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] w-full bg-white rounded-xl border border-slate-200 overflow-hidden font-sans text-slate-900 shadow-sm relative z-10 -mt-4 md:-mt-6">
      {/* Header */}
      <header className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
        <div>
          <div className="flex items-center text-xs text-slate-500 mb-1.5 font-medium">
            <span>Dashboard</span>
            <ChevronRight size={12} className="mx-1" />
            <span className="text-slate-700">Ai Assistant</span>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800">FlameIntel Assistant</h1>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-50 border border-green-100 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-semibold text-green-700 uppercase tracking-wider">Online</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">Your smart gas companion</p>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
            <Bell size={16} />
          </button>
          <button className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
            <Headphones size={16} />
          </button>
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 ml-1">
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-sm font-bold text-slate-600 uppercase">
              {user?.name ? user.name.substring(0,2) : "FI"}
            </div>
            <span className="text-sm font-bold text-slate-700 flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors">
              {user?.name || "User"} <ChevronDown size={14} className="text-slate-400" />
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Chat Area */}
        <div className="flex-1 flex flex-col border-r border-slate-100 bg-[#fbfcfd] relative">
          
          {/* Chat History Container */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col gap-6">
            
            {messages.length === 0 && !isLoading && !error && (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <Image src="/images/logo.png" alt="FlameIQ" width={120} height={30} className="mb-4 opacity-50 grayscale" />
                <p>Start a conversation by typing below!</p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start items-start gap-4'} max-w-[100%]`}>
                {msg.role === 'assistant' && (
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-500 flex items-center justify-center shrink-0 shadow-sm overflow-hidden text-white font-bold text-xs md:text-sm">
                    FI
                  </div>
                )}
                
                <div className={`
                  ${msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm px-5 py-3 shadow-sm md:max-w-[80%]' 
                    : 'bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4 md:p-5 shadow-sm min-w-[200px] md:max-w-[85%] relative text-slate-700'
                  }
                `}>
                  {msg.role === 'assistant' && (
                    <>
                      <div className="absolute top-0 -left-[9px] w-0 h-0 border-t-[0px] border-t-transparent border-r-[10px] border-r-white border-b-[10px] border-b-transparent"></div>
                      <div className="absolute top-[-1px] -left-[10px] w-0 h-0 border-t-[0px] border-t-transparent border-r-[11px] border-r-slate-200 border-b-[11px] border-b-transparent -z-10"></div>
                    </>
                  )}
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-4 max-w-[90%] md:max-w-[85%]">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-500 flex items-center justify-center shrink-0 shadow-sm overflow-hidden text-white font-bold text-xs md:text-sm">
                  FI
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-5 shadow-sm flex items-center justify-center relative">
                   <div className="absolute top-0 -left-[9px] w-0 h-0 border-t-[0px] border-t-transparent border-r-[10px] border-r-white border-b-[10px] border-b-transparent"></div>
                   <div className="absolute top-[-1px] -left-[10px] w-0 h-0 border-t-[0px] border-t-transparent border-r-[11px] border-r-slate-200 border-b-[11px] border-b-transparent -z-10"></div>
                   <Loader2 size={20} className="text-slate-400 animate-spin" />
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-4 max-w-[90%] md:max-w-[85%]">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-500 flex items-center justify-center shrink-0 shadow-sm overflow-hidden text-white font-bold text-xs md:text-sm">
                  FI
                </div>
                <div className="pt-2">
                   <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-5 md:p-6 shadow-sm min-w-[200px] md:min-w-[280px] flex flex-col items-center justify-center text-center relative">
                      <div className="absolute top-0 -left-[9px] w-0 h-0 border-t-[0px] border-t-transparent border-r-[10px] border-r-white border-b-[10px] border-b-transparent"></div>
                      <div className="absolute top-[-1px] -left-[10px] w-0 h-0 border-t-[0px] border-t-transparent border-r-[11px] border-r-slate-200 border-b-[11px] border-b-transparent -z-10"></div>
                      
                      <AlertCircle size={28} className="text-red-400 mb-3" />
                      <p className="text-slate-700 font-medium text-sm">No response.</p>
                      <p className="text-slate-500 text-sm mt-0.5">{error}</p>
                   </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 md:p-6 bg-white border-t border-slate-100 shrink-0">
            {/* Pill Prompts */}
            <div className="flex flex-wrap gap-2 mb-4 justify-center">
              {["When should I refill?", "When will my gas run out?", "How much gas do I have left?"].map((prompt, i) => (
                <button 
                  key={i} 
                  onClick={() => sendMessage(prompt)}
                  className="px-4 py-1.5 rounded-full border border-slate-200 text-xs font-medium text-slate-600 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-all shadow-sm"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <div className="relative max-w-4xl mx-auto">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder="How can I help with your gas today?"
                className="w-full pl-6 pr-14 py-4 rounded-full border border-slate-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 placeholder:text-slate-400 transition-all disabled:opacity-70 disabled:bg-slate-50"
              />
              <button 
                onClick={() => sendMessage(inputValue)}
                disabled={isLoading || !inputValue.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1e40af] text-white flex items-center justify-center hover:bg-blue-800 transition-colors shadow-md disabled:opacity-50 disabled:hover:bg-[#1e40af]"
              >
                <Send size={18} className="-ml-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Quick Prompts & History */}
        <div className="w-80 shrink-0 bg-[#fafafa] hidden lg:flex flex-col p-6 gap-6 overflow-y-auto">
          
          {/* Quick Prompts Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
            <h3 className="font-bold text-slate-800 text-sm mb-1">Quick Prompts</h3>
            {quickPrompts.map((prompt, i) => (
              <button 
                key={i}
                onClick={() => sendMessage(prompt)}
                className="text-left w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-white text-xs font-medium text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Search History Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
            <h3 className="font-bold text-slate-800 text-sm mb-1">Search History</h3>
            {searchHistory.map((prompt, i) => (
              <button 
                key={i}
                onClick={() => sendMessage(prompt)}
                className="text-left w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-white text-xs font-medium text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}