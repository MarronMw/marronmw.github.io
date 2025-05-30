const fetch = require("node-fetch");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { resumeUrl } = JSON.parse(event.body);

  try {
    // 1. Fetch PDF from Google Drive
    const pdfResponse = await fetch(resumeUrl);
    const pdfBuffer = await pdfResponse.arrayBuffer();

    // 2. Call AI API (e.g., DeepSeek/OpenAI)
    const aiResponse = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "user",
              content: `Extract technical skills from this resume as a JSON array. Return ONLY the array: ${Buffer.from(
                pdfBuffer
              ).toString("base64")}`,
            },
          ],
        }),
      }
    );

    const aiData = await aiResponse.json();
    const skills = JSON.parse(aiData.choices[0].message.content);

    return {
      statusCode: 200,
      body: JSON.stringify({ skills }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "AI processing failed" }),
    };
  }
};
