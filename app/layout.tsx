// Root layout — minimal wrapper
// The actual layout with <html> and <body> is in app/[lang]/layout.tsx
// This file exists only to satisfy Next.js App Router requirements

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
