import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Broccoli",
  description: "Shopping made fun - A social app for grocery planning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="Broccoli" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Broccoli" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#E9E9D8" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/appicon.png" />
      </head>
      <body className={`${lexend.className} antialiased`} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
