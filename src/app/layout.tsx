import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'AirdropFarm — Auto-Farming Dashboard',
  description: 'Track and auto-farm crypto airdrops',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <AuthProvider>
          <AuthGuard>
            <Sidebar />
            <main className="ml-60 min-h-screen p-6">{children}</main>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
