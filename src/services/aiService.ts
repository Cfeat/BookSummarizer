export interface SummaryResult {
  title: string;
  coreInsights: string[];
  chapterAnalysis: { chapter: string; summary: string }[];
  actionableTakeaways: string[];
  fullSummary: string;
}

export async function generateSummary(text: string, type: 'book' | 'paper' | 'report' = 'book'): Promise<SummaryResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  
  if (!apiKey) {
    throw new Error("DeepSeek API Key is missing. Please set DEEPSEEK_API_KEY in your environment.");
  }

  const prompt = `
    你是一位专业的书籍和文献分析师。请分析以下文本（类型：${type}）。
    
    你的目标是提供一份结构清晰、高质量的中文摘要，包含以下内容：
    1. 标题 (Title)：内容的简洁标题。
    2. 核心洞察 (Core Insights)：3-5 个关键主题或主要思想。
    3. 章节解析 (Chapter Analysis)：主要章节或部分的细分，并附带简要总结。
    4. 行动建议 (Actionable Takeaways)：读者可以应用的实用点或教训。
    5. 全文摘要 (Full Summary)：2-3 段的综合摘要。

    请严格按照以下 JSON 格式返回结果（不要包含 markdown 代码块标记，直接返回 JSON 字符串）：
    {
      "title": "String",
      "coreInsights": ["String", "String", ...],
      "chapterAnalysis": [{"chapter": "String", "summary": "String"}, ...],
      "actionableTakeaways": ["String", "String", ...],
      "fullSummary": "String"
    }

    以下是需要分析的文本：
    ${text.slice(0, 100000)} 
  `;
  // Note: Truncating to 100k chars as a safety measure, though DeepSeek supports 64k context usually, 
  // we should be mindful. Actually DeepSeek V3 supports 64k. 
  // Let's assume the user provides reasonable length or we might need to chunk.
  // For this demo, we send it as is (up to a limit).

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "You are a helpful assistant that outputs JSON." },
          { role: "user", content: prompt }
        ],
        stream: false,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${response.status} ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    return JSON.parse(content) as SummaryResult;
  } catch (error) {
    console.error("Error generating summary:", error);
    throw error;
  }
}
