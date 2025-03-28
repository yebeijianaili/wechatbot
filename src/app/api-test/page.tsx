"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function APITestPage() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rawResponse, setRawResponse] = useState<string>('');

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setRawResponse('');
    
    try {
      const startTime = Date.now();
      
      // 直接获取响应文本，而不是尝试解析JSON
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      
      const endTime = Date.now();
      const elapsed = endTime - startTime;
      
      // 获取原始响应文本
      const text = await res.text();
      setRawResponse(text);
      
      // 尝试解析JSON
      try {
        const data = JSON.parse(text);
        setResponse({
          status: res.status,
          statusText: res.statusText,
          headers: Object.fromEntries(res.headers.entries()),
          data,
          elapsed: `${elapsed} ms`
        });
      } catch (e) {
        setError(`解析响应失败: ${e instanceof Error ? e.message : '未知错误'}`);
      }
    } catch (e) {
      setError(`请求失败: ${e instanceof Error ? e.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold">API 诊断工具</h1>
      <p className="text-muted-foreground">测试 SiliconFlow API 连接和响应</p>
      
      <Card>
        <CardHeader>
          <CardTitle>API 测试</CardTitle>
          <CardDescription>发送测试消息到聊天 API</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input 
              placeholder="输入测试消息..." 
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
            />
            <Button onClick={testAPI} disabled={!message.trim() || loading}>
              {loading ? '测试中...' : '测试 API'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {error && (
        <Card className="border-red-300 bg-red-50 dark:bg-red-950/20">
          <CardHeader>
            <CardTitle className="text-red-600">错误</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="p-4 bg-red-100 dark:bg-red-900/20 rounded-md overflow-auto text-sm">
              {error}
            </pre>
            {rawResponse && (
              <>
                <div className="mt-4 font-semibold">原始响应:</div>
                <pre className="p-4 bg-red-100 dark:bg-red-900/20 rounded-md overflow-auto text-sm whitespace-pre-wrap">
                  {rawResponse}
                </pre>
              </>
            )}
          </CardContent>
        </Card>
      )}
      
      {response && (
        <Card>
          <CardHeader>
            <CardTitle>API 响应</CardTitle>
            <CardDescription>状态码: {response.status} ({response.statusText}) - 耗时: {response.elapsed}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">响应头:</h3>
                <pre className="p-4 bg-muted rounded-md overflow-auto text-sm">
                  {JSON.stringify(response.headers, null, 2)}
                </pre>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">响应体:</h3>
                <pre className="p-4 bg-muted rounded-md overflow-auto text-sm">
                  {JSON.stringify(response.data, null, 2)}
                </pre>
              </div>
              
              {response.data?.reply && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  <h3 className="font-medium mb-2">AI 回复:</h3>
                  <p className="whitespace-pre-wrap">{response.data.reply}</p>
                </div>
              )}
              
              {rawResponse && (
                <div>
                  <h3 className="font-medium mb-2">原始响应:</h3>
                  <pre className="p-4 bg-muted rounded-md overflow-auto text-sm whitespace-pre-wrap">
                    {rawResponse}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 