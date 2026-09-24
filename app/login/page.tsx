'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Browser client use karna zaroori hai taaki middleware ke liye cookies set ho sakein
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false); // Error aane par loading state reset karna zaroori hai
    } else {
      router.push('/admin');
      router.refresh(); // Middleware ko nayi cookies read karne ke liye force refresh
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-md sm:mt-16">
      <div className="nb-card bg-nb-purple/30 p-6 sm:p-8">
        <div className="mb-8 text-center">
          <div className="nb-icon mx-auto mb-4 h-14 w-14 bg-nb-yellow text-2xl">
            🔐
          </div>
          <h2 className="text-3xl">Admin Access</h2>
          <p className="mt-2 font-medium text-ink/70">Login to manage Sem 5 Notes</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="rounded-lg border-2 border-ink bg-nb-pink p-3 text-sm font-bold shadow-nb-sm">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-extrabold uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="nb-input"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-extrabold uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="nb-input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="nb-btn mt-4 w-full bg-nb-green py-3 text-base disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-nb"
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
}