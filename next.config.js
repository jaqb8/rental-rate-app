/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  images: {
    domains: ["utfs.io", "images.unsplash.com"],
  },
  experimental: {
    serverComponentsExternalPackages: ["@node-rs/argon2"],
    instrumentationHook: true,
  },
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: "/landing/:path*",
        has: [{ type: "host", value: "rentalrate.me" }],
      },
      {
        source: "/:path*",
        destination: "/app/:path*",
        has: [{ type: "host", value: "app.rentalrate.me" }],
      },
    ];
  },
};

export default config;
