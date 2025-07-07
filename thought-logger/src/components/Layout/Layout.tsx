import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50">
      <Header />
      <Navigation />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {children}
      </main>
    </div>
  );
}