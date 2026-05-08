import type { Metadata } from "next";
import "./globals.css";
import LoadingScreen from "./components/LoadingScreen";

export const metadata: Metadata = {
  title: "Hari & Jothi 🌸",
  description: "Our little corner of the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh' }}>
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}