import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCountry } from '@/contexts/CountryContext';
import { lovable } from '@/integrations/lovable/index';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, LogIn, Baby, Moon, Music, Heart, BookOpen, Calendar, Pill } from 'lucide-react';
import { toast } from 'sonner';
import CountrySelector from '@/components/CountrySelector';

const FloatingIcon = ({ icon: Icon, className, style }: { icon: any; className: string; style?: React.CSSProperties }) => (
  <div className={`absolute opacity-15 text-primary ${className}`} style={style}>
    <Icon className="w-full h-full" />
  </div>
);

const Login = () => {
  const { user, loading } = useAuth();
  const { isUSA } = useCountry();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate('/', { replace: true });
  }, [user, loading, navigate]);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await lovable.auth.signInWithOAuth('google', {
        redirect_uri: window.location.origin,
      });
      if (error) {
        console.error('OAuth error:', error);
        toast.error(isUSA ? 'Login failed. Try again.' : 'Falha no login. Tente novamente.');
      }
    } catch (e) {
      console.error('OAuth exception:', e);
      toast.error(isUSA ? 'Login failed. Try again.' : 'Falha no login. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--bg-gradient-start))] via-[hsl(var(--bg-gradient-middle))] to-[hsl(var(--bg-gradient-end))] flex items-center justify-center">
        <Sparkles className="w-10 h-10 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--bg-gradient-start))] via-[hsl(var(--bg-gradient-middle))] to-[hsl(var(--bg-gradient-end))] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating background icons as app preview */}
      <FloatingIcon icon={Baby} className="w-16 h-16 top-[8%] left-[10%] animate-pulse" />
      <FloatingIcon icon={Moon} className="w-12 h-12 top-[15%] right-[15%] animate-bounce" style={{animationDuration: '3s'} as any} />
      <FloatingIcon icon={Music} className="w-14 h-14 top-[30%] left-[5%] animate-pulse" />
      <FloatingIcon icon={Heart} className="w-10 h-10 top-[25%] right-[8%] animate-ping" style={{animationDuration: '4s'} as any} />
      <FloatingIcon icon={BookOpen} className="w-12 h-12 bottom-[30%] left-[12%] animate-pulse" />
      <FloatingIcon icon={Calendar} className="w-14 h-14 bottom-[20%] right-[10%] animate-bounce" style={{animationDuration: '4s'} as any} />
      <FloatingIcon icon={Pill} className="w-10 h-10 bottom-[10%] left-[20%] animate-pulse" />
      <FloatingIcon icon={Sparkles} className="w-8 h-8 top-[50%] right-[5%] animate-ping" style={{animationDuration: '5s'} as any} />

      {/* Decorative circles */}
      <div className="absolute top-[-10%] right-[-10%] w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 rounded-full bg-secondary/5 blur-3xl" />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />

      {/* Feature preview strip */}
      <div className="absolute top-6 left-0 right-0 flex justify-center gap-3 px-4">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/30 backdrop-blur-sm border border-border/30 text-[10px] text-muted-foreground">
          <Baby className="w-3 h-3 text-primary" />
          <span>{isUSA ? 'Baby Guides' : 'Guias do Bebê'}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/30 backdrop-blur-sm border border-border/30 text-[10px] text-muted-foreground">
          <Music className="w-3 h-3 text-primary" />
          <span>{isUSA ? 'Soothing Music' : 'Músicas Relaxantes'}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/30 backdrop-blur-sm border border-border/30 text-[10px] text-muted-foreground">
          <Moon className="w-3 h-3 text-primary" />
          <span>{isUSA ? 'Sleep Tracker' : 'Tracker de Sono'}</span>
        </div>
      </div>

      {/* Bottom feature strip */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 px-4">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/30 backdrop-blur-sm border border-border/30 text-[10px] text-muted-foreground">
          <Heart className="w-3 h-3 text-primary" />
          <span>{isUSA ? 'Pregnancy' : 'Gravidez'}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/30 backdrop-blur-sm border border-border/30 text-[10px] text-muted-foreground">
          <Pill className="w-3 h-3 text-primary" />
          <span>{isUSA ? 'Medicine Guide' : 'Guia de Remédios'}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/30 backdrop-blur-sm border border-border/30 text-[10px] text-muted-foreground">
          <BookOpen className="w-3 h-3 text-primary" />
          <span>E-books</span>
        </div>
      </div>

      <Card className="w-full max-w-sm p-8 bg-card/80 backdrop-blur-xl border-primary/20 shadow-2xl shadow-primary/10 space-y-6 relative z-10">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-7 h-7 text-primary animate-pulse" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              {isUSA ? 'Mom Zen' : 'Mamãe Zen'}
            </h1>
            <Sparkles className="w-7 h-7 text-secondary animate-pulse" />
          </div>
          <p className="text-muted-foreground text-sm">
            {isUSA ? '✨ Premium motherhood app ✨' : '✨ App premium de maternidade ✨'}
          </p>
          <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary font-semibold text-xs border border-primary/30">
            PREMIUM
          </span>
        </div>

        <div className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            {isUSA ? 'Sign in to access your premium experience' : 'Faça login para acessar sua experiência premium'}
          </p>

          <Button
            onClick={handleGoogleLogin}
            className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold text-base shadow-lg shadow-primary/20"
            size="lg"
          >
            <LogIn className="w-5 h-5 mr-2" />
            {isUSA ? 'Sign in with Google' : 'Entrar com Google'}
          </Button>
        </div>

        <div className="pt-2">
          <CountrySelector />
        </div>

        <p className="text-[10px] text-center text-muted-foreground/60">
          {isUSA ? 'By signing in you agree to our terms' : 'Ao entrar você concorda com nossos termos'}
        </p>
      </Card>
    </div>
  );
};

export default Login;
