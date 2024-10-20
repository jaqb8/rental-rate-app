import { EMAIL_SENDER } from "@/lib/constants";
import { transporter } from "@/lib/email";
import { type Job, Queue } from "bullmq";
import { connection } from "./connection";

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

export const emailWorker = async (job: Job) => {
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
};
