import { Router, type IRouter } from "express";
import { db, notesTable } from "@workspace/db";
import { openai } from "@workspace/integrations-openai-ai-server";
import { ProcessNoteBody, ProcessNoteTextBody, GetNoteByIdParams, DeleteNoteParams } from "@workspace/api-zod";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

const SYSTEM_PROMPTS: Record<string, string> = {
  simplify: `You are an expert at simplifying complex notes. Your task is to:
1. Read the extracted text from the user's notes image
2. Create a simplified, easy-to-understand summary
3. Use clear bullet points for key concepts
4. Highlight the most important ideas
5. Use simple language, avoid jargon where possible
6. Format with clear sections if the notes cover multiple topics

Respond with clean, structured markdown.`,

  organize: `You are an expert at organizing and structuring information. Your task is to:
1. Read the extracted text from the user's notes image
2. Reorganize the content into a logical, hierarchical structure
3. Create clear headings and subheadings
4. Group related concepts together
5. Add a brief summary at the top
6. Create an outline if appropriate

Respond with well-structured markdown using headers (##, ###), bullet points, and numbered lists.`,

  quiz: `You are an expert educator who creates effective study quizzes. Your task is to:
1. Read the extracted text from the user's notes image
2. Create 5-10 meaningful questions that test understanding of the key concepts
3. For each question, provide 4 multiple choice options (A, B, C, D)
4. Mark the correct answer clearly
5. Add a brief explanation for why each answer is correct

Format your response exactly like this:
**Quiz: [Topic Name]**

**Question 1:** [Question text]
A) [Option A]
B) [Option B]  
C) [Option C]
D) [Option D]
✓ **Correct Answer: [Letter]** - [Brief explanation]

[Continue for all questions...]`,
};

router.post("/notes/process", async (req, res) => {
  const parseResult = ProcessNoteBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { imageBase64, mimeType, mode, title } = parseResult.data;

  try {
    const extractionResponse = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please extract and transcribe all the text you can see in this notes image. Preserve the structure as much as possible. If you cannot read certain parts clearly, indicate that with [unclear]. Return only the extracted text, nothing else.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
    });

    const extractedText = extractionResponse.choices[0]?.message?.content ?? "";

    const processResponse = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPTS[mode] ?? SYSTEM_PROMPTS.simplify,
        },
        {
          role: "user",
          content: `Here are the extracted notes:\n\n${extractedText}`,
        },
      ],
    });

    const result = processResponse.choices[0]?.message?.content ?? "";

    const noteTitle = title || `Notes - ${new Date().toLocaleDateString()}`;

    const [inserted] = await db
      .insert(notesTable)
      .values({
        title: noteTitle,
        mode,
        extractedText,
        result,
        imageBase64,
        mimeType,
      })
      .returning();

    res.json({
      id: inserted.id,
      title: inserted.title,
      mode: inserted.mode,
      extractedText: inserted.extractedText,
      result: inserted.result,
      createdAt: inserted.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to process note");
    res.status(500).json({ error: "Failed to process note" });
  }
});

router.post("/notes/process-text", async (req, res) => {
  const parseResult = ProcessNoteTextBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { text, mode, title } = parseResult.data;

  try {
    const processResponse = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPTS[mode] ?? SYSTEM_PROMPTS.simplify,
        },
        {
          role: "user",
          content: `Here are the notes:\n\n${text}`,
        },
      ],
    });

    const result = processResponse.choices[0]?.message?.content ?? "";
    const noteTitle = title || `Notes - ${new Date().toLocaleDateString()}`;

    const [inserted] = await db
      .insert(notesTable)
      .values({
        title: noteTitle,
        mode,
        extractedText: text,
        result,
        imageBase64: null,
        mimeType: null,
      })
      .returning();

    res.json({
      id: inserted.id,
      title: inserted.title,
      mode: inserted.mode,
      extractedText: inserted.extractedText,
      result: inserted.result,
      createdAt: inserted.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to process text note");
    res.status(500).json({ error: "Failed to process text note" });
  }
});

router.get("/notes/history", async (req, res) => {
  try {
    const notes = await db
      .select({
        id: notesTable.id,
        title: notesTable.title,
        mode: notesTable.mode,
        extractedText: notesTable.extractedText,
        result: notesTable.result,
        mimeType: notesTable.mimeType,
        createdAt: notesTable.createdAt,
      })
      .from(notesTable)
      .orderBy(desc(notesTable.createdAt));

    res.json({
      notes: notes.map((n) => ({
        ...n,
        createdAt: n.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get note history");
    res.status(500).json({ error: "Failed to get note history" });
  }
});

router.get("/notes/history/:id", async (req, res) => {
  const parseResult = GetNoteByIdParams.safeParse({ id: Number(req.params.id) });
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  try {
    const [note] = await db
      .select()
      .from(notesTable)
      .where(eq(notesTable.id, parseResult.data.id));

    if (!note) {
      res.status(404).json({ error: "Note not found" });
      return;
    }

    res.json({
      ...note,
      createdAt: note.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get note");
    res.status(500).json({ error: "Failed to get note" });
  }
});

router.delete("/notes/history/:id", async (req, res) => {
  const parseResult = DeleteNoteParams.safeParse({ id: Number(req.params.id) });
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  try {
    const deleted = await db
      .delete(notesTable)
      .where(eq(notesTable.id, parseResult.data.id))
      .returning();

    if (deleted.length === 0) {
      res.status(404).json({ error: "Note not found" });
      return;
    }

    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete note");
    res.status(500).json({ error: "Failed to delete note" });
  }
});

export default router;
