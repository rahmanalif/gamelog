import type { Metadata } from "next";
import "./globals.css";
import AuthInitializer from "@/component/auth-initializer";
import ReduxProvider from "@/component/redux-provider";
import KonamiEgg from "@/component/konami-egg";

export const metadata: Metadata = {
  title: "Gamelog - Track games you've played.",
  description: "The social network for game lovers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600&family=Literata:opsz,wght@7..72,600;7..72,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-surface">
        <ReduxProvider>
          <AuthInitializer />
          <KonamiEgg />
          <main className="grow">{children}</main>
        </ReduxProvider>
      </body>
    </html>
  );
}
