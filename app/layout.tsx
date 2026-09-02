import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { AuthProvider } from '@/lib/AuthContext';

export const metadata: Metadata = {
  title: 'My Google AI Studio App',
  description: 'An application built with Google AI Studio.',
  openGraph: {
    title: 'My Google AI Studio App',
    description: 'An application built with Google AI Studio.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Google AI Studio App',
    description: 'An application built with Google AI Studio.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-[#F0F2F5] text-[#111827] font-sans min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
