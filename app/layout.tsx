import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/common/error-boundary";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { WhatsAppFloating } from "@/components/common/whatsapp-floating";

export const metadata: Metadata = {
  title: "ALCONSTRUCCIONES SRL - Portfolio de Obras",
  description: "Portfolio de obras de construcción de ALCONSTRUCCIONES SRL",
  keywords: ["construcción", "obras", "arquitectura", "ALCONSTRUCCIONES"],
  authors: [{ name: "ALCONSTRUCCIONES SRL" }],
  openGraph: {
    title: "ALCONSTRUCCIONES SRL - Portfolio de Obras",
    description: "Portfolio de obras de construcción de ALCONSTRUCCIONES SRL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            {children}
            <Toaster position="top-right" richColors />
            <WhatsAppFloating />
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}

