import fetch from "node-fetch";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { resumeUrl } = req.body;

  try {
    // 1. Fetch the resume PDF from Google Drive
    const pdfResponse = await fetch(resumeUrl);
    const pdfBuffer = await pdfResponse.arrayBuffer();

    // 2. Send to DeepSeek/OpenAI for text extraction + analysis
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
              content: `Extract all technical skills (e.g., JavaScript, React, Python) from this resume PDF as a JSON array. Only return the array: ${Buffer.from(
                pdfBuffer
              ).toString("base64")}`,
            },
          ],
        }),
      }
    );

    const aiData = await aiResponse.json();
    const skills = JSON.parse(aiData.choices[0].message.content);

    res.status(200).json({ skills });
  } catch (error) {
    res.status(500).json({ error: "AI processing failed" });
  }
};
