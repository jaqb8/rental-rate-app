export const register = async () => {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { Worker } = await import("bullmq");
    const { connection } = await import("./redis/connection");
    const { emailWorker } = await import("./redis/email-worker");

    const worker = new Worker<{ to: string; subject: string; body: string }>(
      "emailQueue",
      emailWorker,
      {
        connection,
        concurrency: 5,
        removeOnComplete: { count: 1000 },
        removeOnFail: { count: 5000 },
      },
    );

    worker.on("completed", (job) => {
      console.log(`Job completed for ${job.id}`);
    });
    worker.on("failed", (job, err) => {
      console.error(`${job?.id} has failed with ${err.message}`);
    });
    worker.on("stalled", (str) => {
      console.log(`Job stalled: ${str}`);
    });
  }
};
