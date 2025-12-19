import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/common/error-boundary";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { WhatsAppFloating } from "@/components/common/whatsapp-floating";

export const metadata: Metadata = {
  title: {
    default: "ALCONSTRUCCIONES SRL - Construcción de Calidad",
    template: "%s | ALCONSTRUCCIONES SRL"
  },
  description: "Empresa líder en construcción de obras de calidad. Especialistas en viviendas, edificios, obras comerciales e industriales. Construyendo sueños con compromiso y excelencia desde 2020.",
  keywords: [
    "construcción",
    "obras",
    "arquitectura",
    "ALCONSTRUCCIONES",
    "construcción de viviendas",
    "edificios",
    "obras comerciales",
    "obras industriales",
    "construcción en Argentina",
    "empresa constructora"
  ],
  authors: [{ name: "ALCONSTRUCCIONES SRL" }],
  creator: "ALCONSTRUCCIONES SRL",
  publisher: "ALCONSTRUCCIONES SRL",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://alconstrucciones.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "/",
    siteName: "ALCONSTRUCCIONES SRL",
    title: "ALCONSTRUCCIONES SRL - Construcción de Calidad",
    description: "Empresa líder en construcción de obras de calidad. Especialistas en viviendas, edificios, obras comerciales e industriales.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "ALCONSTRUCCIONES SRL - Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ALCONSTRUCCIONES SRL - Construcción de Calidad",
    description: "Empresa líder en construcción de obras de calidad. Especialistas en viviendas, edificios, obras comerciales e industriales.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Agregar cuando tengas Google Search Console
    // google: 'verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch for Supabase */}
        <link rel="dns-prefetch" href="https://*.supabase.co" />
      </head>
      <body className="antialiased">
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

