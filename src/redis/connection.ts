import Redis from "ioredis";

export const connection = new Redis(process.env.KV_URL!, {
  maxRetriesPerRequest: null,
});
