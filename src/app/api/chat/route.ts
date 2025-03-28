import { NextResponse } from 'next/server';

// 直接硬编码API密钥和模型（测试用，后续应移回环境变量）
const SILICONFLOW_API_KEY = "sk-plttdqwxwihwgdriluxwzhifjuhktayxtqnwcmllsejhoxax";
// 切换到全球负载均衡端点，根据SiliconFlow文档建议
const API_URL = "https://api.siliconflow.com/v1/chat/completions";
// 使用指定的模型
const MODEL = "deepseek-ai/DeepSeek-R1";

// 调试模式：如果API密钥是占位符，使用模拟数据
const DEBUG_MODE = false;

// 记录环境变量信息（不包含密钥完整内容）
console.log(`API环境配置: 模型=${MODEL}, 测试模式=${DEBUG_MODE}, API密钥设置=${SILICONFLOW_API_KEY ? '已设置' : '未设置'}`);

export async function POST(request: Request) {
  try {
    console.log("收到聊天请求");
    const { message } = await request.json();

    if (!message) {
      console.log("请求无消息内容");
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
      max_tokens: 800,
      stream: true // 开启流式输出
    };

    console.log(`准备向SiliconFlow API发送请求: ${JSON.stringify({
      url: API_URL,
      model: MODEL,
      messageLength: message.length,
      streamMode: true
    })}`);

    // 添加超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60秒超时，流式传输通常需要更长时间

    try {
      // 发送请求到SiliconFlow API
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SILICONFLOW_API_KEY}`,
          "Accept": "text/event-stream"
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId); // 清除超时

      console.log(`收到API响应: 状态=${response.status}, 类型=${response.headers.get('content-type')}`);

      // 检查HTTP状态码
      if (!response.ok) {
        let errorMessage = `API请求失败，状态码: ${response.status}`;
        try {
          const errorBody = await response.json();
          errorMessage = errorBody.error?.message || errorMessage;
        } catch {
          // 无法解析错误响应，使用默认错误消息
        }
        console.error("SiliconFlow API返回错误:", errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: response.status });
      }

      // 确保响应是可读流
      if (!response.body) {
        throw new Error("响应中没有数据流");
      }

      // 使用流式处理
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      
      const transformStream = new TransformStream({
        async start(controller) {
          // 流开始时的初始化
          controller.enqueue(encoder.encode('{"reply":"'));
        },
        async transform(chunk, controller) {
          // 处理每个数据块
          const text = decoder.decode(chunk);
          const lines = text.split('\n').filter(line => line.trim() !== '');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6); // 移除 'data: ' 前缀
              
              if (data === '[DONE]') {
                // 流结束标记
                continue;
              }
              
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices[0]?.delta?.content || '';
                if (content) {
                  // 处理内容中的双引号和反斜杠以避免JSON解析错误
                  const escapedContent = content
                    .replace(/\\/g, '\\\\')
                    .replace(/"/g, '\\"')
                    .replace(/\n/g, '\\n')
                    .replace(/\r/g, '\\r')
                    .replace(/\t/g, '\\t');
                  
                  controller.enqueue(encoder.encode(escapedContent));
                }
              } catch (e) {
                console.error('解析数据块失败:', e, data);
              }
            }
          }
        },
        async flush(controller) {
          // 流结束时完成JSON
          controller.enqueue(encoder.encode('"}'));
        }
      });

      // 使用 ReadableStream.pipeThrough 将响应流传递给转换流
      const stream = response.body.pipeThrough(transformStream);
      
      console.log("流式响应开始");
      return new Response(stream, {
        headers: {
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff'
        }
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (apiError: any) {
      clearTimeout(timeoutId);
      if (apiError.name === 'AbortError') {
        console.error("API请求超时");
        return NextResponse.json(
          { error: "API请求超时，请稍后再试" },
          { status: 504 }
        );
      }
      throw apiError; // 重新抛出其他错误
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("处理聊天请求时出错:", error);
    return NextResponse.json(
      { error: error instanceof Error ? `错误: ${error.message}` : "处理请求时出错" },
      { status: 500 }
    );
  }
} 