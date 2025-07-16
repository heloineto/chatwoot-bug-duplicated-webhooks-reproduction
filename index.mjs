import express from "express";
import dotenv from "dotenv";
import z from "zod";

dotenv.config({ quiet: true });

const environment = z
  .object({
    PORT: z.number({ coerce: true }).default(3000),
  })
  .parse(process.env);

const app = express();
app.use(express.json());

const seenMessageIds = new Set();

app.post("/webhook", (req, res) => {
  const messages = z
    .array(
      z.object({
        id: z.number(),
        content: z.string(),
        message_type: z.number(),
      })
    )
    .parse(req.body.conversation.messages);

  for (const message of messages) {
    if (seenMessageIds.has(message.id)) {
      console.error(`🔴 DUPLICATE MESSAGE DETECTED! Message ID: ${message.id}`);
    } else {
      seenMessageIds.add(message.id);
    }
    console.log(`content=${message.content}\nid=${message.id}`);
  }

  res.sendStatus(200);
});

app.listen(environment.PORT, () => {
  console.log(`Server listening on port ${environment.PORT}`);
});
