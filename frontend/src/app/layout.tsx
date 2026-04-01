import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SaaS Multimodal Inteligente",
  description: "Plataforma SaaS accesible con capacidades multimodales y soporte estructural avanzado WCAG 2.1.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased font-sans bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
