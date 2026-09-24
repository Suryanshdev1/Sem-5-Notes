'use client';

import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(!!session);
    });

    // Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-background">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/"
          className="nb-btn bg-nb-yellow px-3 py-1.5 text-base sm:text-lg"
        >
          📚 Sem 5 Notes
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-2">
          {isAdmin ? (
            <>
              <Link href="/admin" className="nb-btn bg-nb-green px-3 py-1.5 text-sm">
                Upload
              </Link>
              <Link href="/admin/manage" className="nb-btn bg-nb-blue px-3 py-1.5 text-sm">
                Manage
              </Link>
              <button
                onClick={handleLogout}
                className="nb-btn bg-nb-pink px-3 py-1.5 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="nb-btn bg-white px-3 py-1.5 text-sm">
              Admin Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}