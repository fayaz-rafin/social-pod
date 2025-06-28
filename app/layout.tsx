import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SocialPod",
  description: "A social app for grocery planning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="SocialPod" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SocialPod" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#FDE500" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/noname.png" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
