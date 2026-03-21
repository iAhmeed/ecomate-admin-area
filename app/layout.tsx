import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoMate — Admin Area",
  description: "Admin dashboard for managing EcoMate agency services, partners, and client feedback.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
