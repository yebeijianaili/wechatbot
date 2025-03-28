import { NextResponse } from 'next/server';

// 环境变量中获取API密钥，如果不存在则使用默认值（实际使用时应替换为你的API密钥）
// 在实际部署时，需要在.env.local文件中设置这个值
const SILICONFLOW_API_KEY = process.env.SILICONFLOW_API_KEY || "your_api_key_here";
// SiliconFlow API接口地址
const API_URL = "https://api.siliconflow.cn/v1/chat/completions";
// 使用的模型，可以根据SiliconFlow提供的模型列表进行调整
const MODEL = process.env.SILICONFLOW_MODEL || "Qwen/Qwen2.5-72B-Instruct";

// 调试模式：如果API密钥是占位符，使用模拟数据
const DEBUG_MODE = SILICONFLOW_API_KEY === "your_api_key_here";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "消息不能为空" },
        { status: 400 }
      );
    }

    // 调试模式：返回模拟数据
    if (DEBUG_MODE) {
      console.log("调试模式：返回模拟数据而不是调用API");
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟网络延迟
      
      return NextResponse.json({
        reply: `[调试模式] 你好！我是夜北见。你说: "${message}"\n\n这是一条模拟回复，因为您尚未设置有效的SiliconFlow API密钥。请在.env.local文件中设置有效的API密钥后重启服务器。😊`
      });
    }

    // 构建请求体
    const requestBody = {
      model: MODEL,
      messages: [
        { 
          role: "system", 
          content: "你是一个名叫'夜北见'的聊天助手。你应该用友好、有帮助的方式回答问题，同时展现出一些个性，偶尔可以用emoji表情。" 
        },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 800
    };

    // 发送请求到SiliconFlow API
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SILICONFLOW_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    // 检查API响应是否成功
    if (!response.ok) {
      console.error("SiliconFlow API返回错误:", data);
      return NextResponse.json(
        { error: data.error?.message || "API请求失败" },
        { status: response.status }
      );
    }

    // 从API响应中提取助手的回复
    const assistantReply = data.choices[0]?.message?.content || "抱歉，我无法回答这个问题。";

    return NextResponse.json({
      reply: assistantReply
    });
  } catch (error) {
    console.error("处理聊天请求时出错:", error);
    return NextResponse.json(
      { error: "处理请求时出错" },
      { status: 500 }
    );
  }
} 