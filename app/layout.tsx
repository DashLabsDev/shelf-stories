import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shelf Stories — The bookshelf",
  description:
    "A collection, one book at a time. Browse the shelves, spine by spine.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
