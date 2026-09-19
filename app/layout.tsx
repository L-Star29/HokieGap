import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HokieGap — Find your next good hour",
  description: "Find study and break spaces between Virginia Tech classes.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

