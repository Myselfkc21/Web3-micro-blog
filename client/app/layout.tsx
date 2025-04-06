import type { Metadata } from "next";
import "./globals.css";
import { TwitterProvider } from "./context/TwitterContext";

export const metadata: Metadata = {
  title: "Twitter Clone",
  description: "A Twitter-like application with styled sidebar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.classList.toggle('dark', theme === 'dark');
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-white dark:bg-black text-black dark:text-white">
        <TwitterProvider>
          <div className="min-h-screen">{children}</div>
        </TwitterProvider>
      </body>
    </html>
  );
}
