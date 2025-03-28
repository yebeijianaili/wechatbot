import ChatBot from "@/components/ChatBot";

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">夜北见 - AI 聊天助手</h1>
      <p className="text-muted-foreground mb-8">
        有什么想聊的？我是你的智能助手夜北见，很高兴为你提供帮助！
      </p>
      
      <ChatBot />
    </div>
  );
} 