"use client";

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/toast";

// 消息类型定义
type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export default function ChatBot() {
  // 状态管理
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // 删除自动滚动效果
  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

  // 保留函数但不自动调用，允许手动触发滚动
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 发送消息
  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // 创建助手消息占位符
      const assistantMessage: Message = {
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };
      
      // 添加空的助手消息到列表
      setMessages(prev => [...prev, assistantMessage]);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '请求失败');
      }
      
      // 处理流式响应
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法获取响应流');
      }
      
      const decoder = new TextDecoder();
      let responseText = '';
      let partialJSON = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        partialJSON += chunk;
        
        try {
          // 尝试解析累积的JSON
          const result = JSON.parse(partialJSON);
          
          if (result.reply !== undefined) {
            responseText = result.reply;
            
            // 更新助手消息内容
            setMessages(prev => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              if (lastMessage && lastMessage.role === 'assistant') {
                lastMessage.content = responseText;
              }
              return newMessages;
            });
          }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          // JSON不完整，继续累积
          continue;
        }
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      toast({
        title: "发送失败",
        description: error instanceof Error ? error.message : "请求异常，请稍后再试",
        variant: "destructive",
      });
      
      // 移除失败的助手消息
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };
  
  // 处理按键事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[70vh] border rounded-xl overflow-hidden bg-card shadow-md">
      {/* 聊天头部 */}
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center space-x-2">
          <Avatar className="h-10 w-10 ring-2 ring-blue-500/20">
            <AvatarImage src="/yebj.svg" alt="夜北见" />
            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-600">夜北</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">夜北见</h3>
            <p className="text-xs text-muted-foreground">由SiliconFlow API提供支持</p>
          </div>
        </div>
      </div>
      
      {/* 聊天消息区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="mb-1">没有聊天记录</p>
            <p className="text-sm">发送一条消息，开始与夜北见聊天吧！</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-muted rounded-tl-none'
                }`}
              >
                <div className="break-words whitespace-pre-wrap">{msg.content}</div>
                <div
                  className={`text-xs mt-1 ${
                    msg.role === 'user' ? 'text-blue-100' : 'text-muted-foreground'
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[75%] rounded-2xl px-4 py-3 bg-muted rounded-tl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* 输入区域 */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            placeholder="输入消息..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={sendMessage} 
            disabled={!input.trim() || isLoading}
          >
            发送
          </Button>
          {messages.length > 0 && (
            <Button 
              variant="outline" 
              size="icon" 
              onClick={scrollToBottom}
              title="滚动到底部"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 