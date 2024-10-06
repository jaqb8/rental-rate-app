import { EMAIL_SENDER } from "@/lib/constants";
import { transporter } from "@/lib/email";
import { Worker, Queue } from "bullmq";
import Redis from "ioredis";

const connection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});
console.info("🚀 Connected to Redis");

export const emailQueue = new Queue("emailQueue", {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});

const worker = new Worker<{ to: string; subject: string; body: string }>(
  "emailQueue",
  async (job) => {
    const { to, subject, body } = job.data;
    if (process.env.MOCK_SEND_EMAIL === "true") {
      console.info(
        "📨 Email sent to:",
        to,
        "with subject:",
        subject,
        "and body:",
        body,
      );
      return;
    }

    await transporter.sendMail({
      from: EMAIL_SENDER,
      to,
      subject,
      html: body,
    });
    console.info(`✅ Task [${job.id}] completed successfully`);
  },
  {
    connection,
    concurrency: 5,
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 5000 },
  },
);

export default worker;
