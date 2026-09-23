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
    <header className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Sem 5 Notes
        </Link>
        
        <nav className="space-x-5 flex items-center">
          {isAdmin ? (
            <>
              <Link href="/admin" className="text-sm font-semibold text-gray-600 hover:text-blue-600">
                Upload
              </Link>
              <Link href="/admin/manage" className="text-sm font-semibold text-gray-600 hover:text-blue-600">
                Manage
              </Link>
              <button 
                onClick={handleLogout} 
                className="text-sm font-semibold text-red-600 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-md transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900">
              Admin Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}