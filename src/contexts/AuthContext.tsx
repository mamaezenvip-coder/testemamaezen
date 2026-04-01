import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { checkRateLimit } from '@/utils/rateLimiter';

interface LicenseInfo {
  isActive: boolean;
  expiresAt: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  license: LicenseInfo;
  licenseLoading: boolean;
  signOut: () => Promise<void>;
  activateKey: (key: string) => Promise<{ success: boolean; message: string }>;
  refreshLicense: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [license, setLicense] = useState<LicenseInfo>({ isActive: false, expiresAt: null });
  const [licenseLoading, setLicenseLoading] = useState(true);

  const checkLicense = async (userId: string) => {
    setLicenseLoading(true);
    try {
      const { data, error } = await supabase
        .from('key_activations')
        .select('expires_at')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('License check error:', error);
        setLicense({ isActive: false, expiresAt: null });
      } else if (data && new Date(data.expires_at) > new Date()) {
        setLicense({ isActive: true, expiresAt: data.expires_at });
      } else {
        setLicense({ isActive: false, expiresAt: null });
      }
    } catch (e) {
      console.error('License check failed:', e);
      setLicense({ isActive: false, expiresAt: null });
    } finally {
      setLicenseLoading(false);
    }
  };

  const refreshLicense = async () => {
    if (user) await checkLicense(user.id);
  };

  const activateKey = async (key: string): Promise<{ success: boolean; message: string }> => {
    const { allowed, retryAfterMs } = checkRateLimit('activate-key');
    if (!allowed) {
      const seconds = Math.ceil(retryAfterMs / 1000);
      return { success: false, message: `Too many attempts. Wait ${seconds}s.` };
    }

    const sanitizedKey = key.trim().replace(/[^a-zA-Z0-9\-_]/g, '').slice(0, 50);
    if (!sanitizedKey) return { success: false, message: 'Invalid key format' };

    try {
      const { data, error } = await supabase.rpc('activate_license_key', {
        p_key: sanitizedKey,
        p_device_id: navigator.userAgent.slice(0, 100),
      });

      if (error) return { success: false, message: error.message };
      
      const result = data as { success: boolean; message: string; expires_at?: string };
      if (result.success) {
        setLicense({ isActive: true, expiresAt: result.expires_at || null });
      }
      return { success: result.success, message: result.message };
    } catch (e) {
      return { success: false, message: 'Unexpected error' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setLicense({ isActive: false, expiresAt: null });
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        setTimeout(() => checkLicense(session.user.id), 0);
      } else {
        setLicense({ isActive: false, expiresAt: null });
        setLicenseLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        checkLicense(session.user.id);
      } else {
        setLicenseLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, license, licenseLoading, signOut, activateKey, refreshLicense }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
