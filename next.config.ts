import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const isExport = process.env.OUTPUT_EXPORT === "true";

const nextConfig: NextConfig = {
  output: isExport ? "export" : undefined,
  poweredByHeader: false,
  images: {
    unoptimized: isExport ? true : false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  ...(isExport
    ? {}
    : {
        async headers() {
          return [
            {
              source: "/(.*)",
              headers: securityHeaders,
            },
          ];
        },
        async redirects() {
          return [
            {
              source: "/docs/cv/cv-muhammad-faisal-amir.pdf",
              destination: "/docs/cv/cv-muhammad-faisal-amir-en.pdf",
              permanent: true,
            },
            {
              source: "/docs/CV-Muhammad-Faisal-Amir-EN.pdf",
              destination: "/docs/cv/cv-muhammad-faisal-amir-en.pdf",
              permanent: true,
            },
            {
              source: "/docs/CV-Muhammad-Faisal-Amir-ID.pdf",
              destination: "/docs/cv/cv-muhammad-faisal-amir-id.pdf",
              permanent: true,
            },
            {
              source: "/docs/CV-Muhammad-Faisal-Amir-EN.md",
              destination: "/docs/cv/cv-muhammad-faisal-amir-en.md",
              permanent: true,
            },
            {
              source: "/docs/CV-Muhammad-Faisal-Amir-ID.md",
              destination: "/docs/cv/cv-muhammad-faisal-amir-id.md",
              permanent: true,
            },
          ];
        },
      }),
};

export default withSerwist(nextConfig);
