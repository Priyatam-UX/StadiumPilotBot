import { OperationsProvider } from '@/context/OperationsContext';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata = {
  title: 'StadiumPilot AI by Priyatam',
  description: 'AI-powered stadium operations assistant for FIFA World Cup 2026 venue organizers. Built by Priyatam.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark`}>
      <body className="dark bg-[#020817]">
        <OperationsProvider>
          {children}
        </OperationsProvider>
      </body>
    </html>
  );
}
