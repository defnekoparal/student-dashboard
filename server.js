import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/ai", async (req, res) => {
  const { focus } = req.body;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer YOUR_OPENAI_API_KEY`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: `Student focus: ${focus}. Give a short helpful study suggestion.`
    })
  });

  const data = await response.json();
  res.json({ text: data.output[0].content[0].text });
});

app.listen(3000, () => console.log("Server running on port 3000"));
