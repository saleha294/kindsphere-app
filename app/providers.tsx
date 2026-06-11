'use client';

import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  // Skeleton global provider that can be wrapped in Supabase client, ThemeProvider, etc.
  return <>{children}</>;
}
