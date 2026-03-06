import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCountry } from '@/contexts/CountryContext';
import { lovable } from '@/integrations/lovable/index';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, Baby, Moon, Music, Heart, BookOpen, Calendar, Pill, 
  ShoppingBag, Shield, Star, ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';
import CountrySelector from '@/components/CountrySelector';

const features = [
  { icon: Baby, labelPt: 'Guias do Bebê', labelEn: 'Baby Guides', color: 'from-pink-500/20 to-rose-500/20' },
  { icon: Moon, labelPt: 'Tracker de Sono', labelEn: 'Sleep Tracker', color: 'from-indigo-500/20 to-purple-500/20' },
  { icon: Music, labelPt: 'Músicas Relaxantes', labelEn: 'Soothing Music', color: 'from-violet-500/20 to-fuchsia-500/20' },
  { icon: Heart, labelPt: 'Gravidez', labelEn: 'Pregnancy', color: 'from-rose-500/20 to-pink-500/20' },
  { icon: Pill, labelPt: 'Guia de Remédios', labelEn: 'Medicine Guide', color: 'from-emerald-500/20 to-teal-500/20' },
  { icon: BookOpen, labelPt: 'E-books Grátis', labelEn: 'Free E-books', color: 'from-amber-500/20 to-orange-500/20' },
  { icon: Calendar, labelPt: 'Rotina do Bebê', labelEn: 'Baby Routine', color: 'from-cyan-500/20 to-blue-500/20' },
  { icon: ShoppingBag, labelPt: 'Lojinha', labelEn: 'Mom Shop', color: 'from-fuchsia-500/20 to-pink-500/20' },
];

const FloatingOrb = ({ className }: { className: string }) => (
  <div className={`absolute rounded-full blur-3xl animate-pulse ${className}`} />
);

const Login = () => {
  const { user, loading } = useAuth();
  const { isUSA } = useCountry();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate('/', { replace: true });
  }, [user, loading, navigate]);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth('google', {
        redirect_uri: window.location.origin,
      });
      if (error) {
        console.error('OAuth error:', error);
        toast.error(isUSA ? 'Login failed. Try again.' : 'Falha no login. Tente novamente.');
        setIsLoggingIn(false);
      }
    } catch (e) {
      console.error('OAuth exception:', e);
      toast.error(isUSA ? 'Login failed. Try again.' : 'Falha no login. Tente novamente.');
      setIsLoggingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--bg-gradient-start))] via-[hsl(var(--bg-gradient-middle))] to-[hsl(var(--bg-gradient-end))] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30 animate-pulse">
            <Baby className="w-8 h-8 text-primary-foreground" />
          </div>
          <Sparkles className="w-6 h-6 text-primary animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--bg-gradient-start))] via-[hsl(var(--bg-gradient-middle))] to-[hsl(var(--bg-gradient-end))] flex flex-col relative overflow-hidden">
      
      {/* Animated background orbs */}
      <FloatingOrb className="w-80 h-80 bg-primary/8 top-[-10%] right-[-15%]" />
      <FloatingOrb className="w-96 h-96 bg-secondary/6 bottom-[-15%] left-[-20%]" />
      <FloatingOrb className="w-64 h-64 bg-accent/10 top-[40%] left-[60%]" />
      <FloatingOrb className="w-48 h-48 bg-primary/5 top-[20%] left-[-5%]" />

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        
        {/* Logo & Brand */}
        <div className="text-center mb-8 space-y-4">
          <div className="relative inline-flex">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center shadow-2xl shadow-primary/40 relative">
              <Baby className="w-10 h-10 text-primary-foreground" />
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-secondary flex items-center justify-center shadow-lg">
                <Sparkles className="w-3 h-3 text-secondary-foreground" />
              </div>
            </div>
          </div>
          
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-[hsl(300,80%,70%)] to-secondary bg-clip-text text-transparent">
                {isUSA ? 'Mom Zen' : 'Mamãe Zen'}
              </span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1.5">
              {isUSA ? 'The complete app for modern moms' : 'O app completo para mamães modernas'}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/25">
            <Star className="w-3.5 h-3.5 text-primary fill-primary" />
            <span className="text-xs font-bold text-primary tracking-wider">PREMIUM</span>
            <Star className="w-3.5 h-3.5 text-primary fill-primary" />
          </div>
        </div>

        {/* Features grid */}
        <div className="w-full max-w-sm mb-8">
          <div className="grid grid-cols-4 gap-3">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-card/40 backdrop-blur-sm border border-border/30 hover:border-primary/30 transition-all duration-300 group"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-[9px] font-medium text-muted-foreground text-center leading-tight">
                    {isUSA ? feat.labelEn : feat.labelPt}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Login card */}
        <div className="w-full max-w-sm space-y-4">
          <div className="p-6 rounded-3xl bg-card/60 backdrop-blur-xl border border-border/40 shadow-2xl shadow-primary/5 space-y-5">
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                {isUSA ? 'Start your journey' : 'Comece sua jornada'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {isUSA ? 'Sign in to unlock all features' : 'Faça login para desbloquear tudo'}
              </p>
            </div>

            <Button
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="w-full h-14 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-bold text-base rounded-2xl shadow-xl shadow-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
              size="lg"
            >
              {isLoggingIn ? (
                <Sparkles className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {isLoggingIn 
                ? (isUSA ? 'Signing in...' : 'Entrando...') 
                : (isUSA ? 'Continue with Google' : 'Continuar com Google')}
            </Button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground/60">
              <Shield className="w-3 h-3" />
              <span>{isUSA ? 'Secure login powered by Google' : 'Login seguro via Google'}</span>
            </div>
          </div>

          {/* Country selector */}
          <div className="flex justify-center">
            <div className="px-4 py-2 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/20">
              <CountrySelector />
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="mt-8 flex flex-col items-center gap-1 text-muted-foreground/40 animate-bounce">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {/* Bottom trust bar */}
      <div className="relative z-10 pb-6 px-6">
        <div className="flex items-center justify-center gap-6 text-[10px] text-muted-foreground/50">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            {isUSA ? 'Privacy guaranteed' : 'Privacidade garantida'}
          </span>
          <span>•</span>
          <span>{isUSA ? '100% secure' : '100% seguro'}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            Premium
          </span>
        </div>
        <p className="text-[9px] text-center text-muted-foreground/30 mt-2">
          {isUSA ? 'By signing in you agree to our terms' : 'Ao entrar você concorda com nossos termos'}
        </p>
      </div>
    </div>
  );
};

export default Login;
