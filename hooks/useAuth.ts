'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === 'SIGNED_OUT') {
        router.push('/auth/login');
      }
    });

    // Initial session check
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      router.push('/dashboard');
      router.refresh();
    }

    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    if (!error) {
      router.push(
        '/auth/login?message=Check your email to confirm your account',
      );
    }

    return { error };
  };

  const signOut = async () => {
    await supabaseClient.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
}
