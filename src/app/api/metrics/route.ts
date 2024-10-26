import { env } from "@/env";
import type { NextRequest } from "next/server";
import { collectDefaultMetrics, Registry } from "prom-client";

const registry = new Registry();
collectDefaultMetrics({ register: registry });

const ALLOWED_IPS = ["::1", "0.0.0.0", env.PROMETHEUS_IP];

export async function GET(req: NextRequest) {
  const clientIP = req.headers.get("x-forwarded-for") ?? req.ip ?? "";

  console.log("Client IP:", clientIP);
  if (!ALLOWED_IPS.includes(clientIP)) {
    return new Response("Access denied", { status: 403 });
  }

  return new Response(await registry.metrics(), {
    headers: {
      "Content-Type": registry.contentType,
    },
  });
}
