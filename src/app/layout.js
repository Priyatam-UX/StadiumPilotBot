import { OperationsProvider } from '@/context/OperationsContext';
import './globals.css';

export const metadata = {
  title: 'StadiumPilot AI',
  description: 'AI-powered stadium operations assistant for FIFA World Cup 2026 venue organizers.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Load Inter & Outfit Google Fonts for high premium design */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <OperationsProvider>
          {children}
        </OperationsProvider>
      </body>
    </html>
  );
}
