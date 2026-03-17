import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jailbreak Match-3',
  description: 'Escape the prison by matching contraband',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-stone-950 text-stone-100 min-h-screen">{children}</body>
    </html>
  );
}