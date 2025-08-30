import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2, Shield } from 'lucide-react';
import { api } from '@/lib/api';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your comprehensive finance AI assistant. I can help you with credit scores, loans, investments, insurance, tax planning, banking, and all financial topics. Ask me anything about finance!",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Bubble animation effect
  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
        setShowBubble(true);
        setTimeout(() => setShowBubble(false), 3000);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const data = await api.sendChatMessage(
        inputMessage,
        localStorage.getItem('userId'),
        {
          creditScore: localStorage.getItem('userCreditScore'),
          name: localStorage.getItem('userName'),
          email: localStorage.getItem('userEmail')
        }
      );
      
      const botMessage = {
        id: Date.now() + 1,
        text: data.response || "I'm sorry, I couldn't process your request right now. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm experiencing some technical difficulties. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        {/* Floating bubble message */}
        {showBubble && (
          <div className="absolute bottom-20 right-0 mb-2 mr-2 animate-bounce">
            <div className="bg-white text-blue-800 px-3 py-2 rounded-lg shadow-lg border border-blue-200 text-sm whitespace-nowrap">
              Ask KYC Assistant your questions!
              <div className="absolute bottom-0 right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white transform translate-y-full"></div>
            </div>
          </div>
        )}
        
        {/* Chat button */}
        <Button
          onClick={() => {
            setIsOpen(true);
            setShowBubble(false);
          }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
          size="lg"
        >
          <div className="relative">
            <Shield className="h-6 w-6" />
            <MessageCircle className="h-4 w-4 absolute -top-1 -right-1" />
          </div>
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Blur overlay */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)}></div>
      
      {/* Chat interface */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className={`w-full max-w-2xl shadow-2xl border-blue-200 transition-all duration-300 ${isMinimized ? 'h-20' : 'h-[600px]'} bg-white`}>
          <CardHeader className="p-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative bg-white/20 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Know Your Credit</CardTitle>
                  <p className="text-blue-100 text-sm">AI Assistant</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white hover:bg-white/20 p-2 h-8 w-8"
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 p-2 h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        
          {!isMinimized && (
            <CardContent className="p-0 flex flex-col h-[520px]">
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md p-3 rounded-lg shadow-sm ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-800 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {message.sender === 'bot' && (
                          <div className="bg-blue-100 p-1 rounded-full">
                            <Bot className="h-4 w-4 text-blue-600" />
                          </div>
                        )}
                        {message.sender === 'user' && (
                          <div className="bg-blue-700 p-1 rounded-full">
                            <User className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed">{message.text}</p>
                          <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-1 rounded-full">
                          <Bot className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex space-x-3">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about finance - credit, loans, investments, tax, insurance..."
                    className="flex-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
};

export default ChatBot;
