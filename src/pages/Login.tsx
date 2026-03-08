import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCountry } from '@/contexts/CountryContext';
import { lovable } from '@/integrations/lovable/index';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, Shield, Star, ChevronDown, Baby
} from 'lucide-react';
import mamaeZenLogo from '@/assets/mamae-zen-logo.png';
import previewGuias from '@/assets/preview-guias.png';
import previewMusicas from '@/assets/preview-musicas.png';
import previewGravidez from '@/assets/preview-gravidez.png';
import previewEmergencia from '@/assets/preview-emergencia.png';
import previewLojinha from '@/assets/preview-lojinha.png';
import previewPlayer from '@/assets/preview-player.png';
import { toast } from 'sonner';
import CountrySelector from '@/components/CountrySelector';

const features = [
  { image: previewGuias, labelPt: 'Guias do Bebê', labelEn: 'Baby Guides' },
  { image: previewMusicas, labelPt: 'Músicas', labelEn: 'Music' },
  { image: previewGravidez, labelPt: 'Gravidez', labelEn: 'Pregnancy' },
  { image: previewEmergencia, labelPt: 'Emergência', labelEn: 'Emergency' },
  { image: previewLojinha, labelPt: 'Lojinha', labelEn: 'Shop' },
  { image: previewPlayer, labelPt: 'Player', labelEn: 'Player' },
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
            <div className="w-28 h-28 rounded-3xl overflow-hidden shadow-2xl shadow-primary/40">
              <img src={mamaeZenLogo} alt="Mamãe Zen" className="w-full h-full object-cover" />
            </div>
          </div>
          
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-[hsl(300,80%,70%)] to-secondary bg-clip-text text-transparent">
                {isUSA ? 'Welcome to Mamãe Zen' : 'Bem-vinda ao Mamãe Zen'}
              </span>
            </h1>
            <p className="text-muted-foreground text-sm mt-2 max-w-xs mx-auto leading-relaxed">
              {isUSA 
                ? 'Protect your baby and feel prepared for any situation.' 
                : 'Proteja o seu bebê e sinta-se preparada para qualquer situação.'}
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
          <div className="grid grid-cols-3 gap-3">
            {features.map((feat, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-1.5 rounded-2xl bg-card/50 backdrop-blur-sm border border-primary/20 transition-all duration-500 group overflow-hidden relative hover:scale-[1.03]"
                style={{
                  boxShadow: '0 0 12px hsl(330 85% 60% / 0.25), 0 0 30px hsl(280 75% 55% / 0.15), inset 0 1px 0 hsl(330 85% 60% / 0.1)',
                }}
              >
                {/* Neon glow border effect */}
                <div className="absolute inset-0 rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
                  background: 'linear-gradient(135deg, hsl(330 85% 60% / 0.15), hsl(280 75% 55% / 0.1), hsl(330 85% 60% / 0.15))',
                }} />
                <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
                  background: 'linear-gradient(135deg, hsl(330 85% 60% / 0.4), hsl(280 75% 55% / 0.3), hsl(330 85% 60% / 0.4))',
                  filter: 'blur(6px)',
                }} />
                <div className="w-full aspect-[9/16] overflow-hidden rounded-t-2xl relative z-[1]">
                  <img 
                    src={feat.image} 
                    alt={isUSA ? feat.labelEn : feat.labelPt}
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <span className="text-[10px] font-semibold text-primary/80 group-hover:text-primary text-center leading-tight pb-2 px-1 relative z-[1] transition-colors duration-300">
                  {isUSA ? feat.labelEn : feat.labelPt}
                </span>
              </div>
            ))}
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

      {/* Footer section */}
      <div className="relative z-10 pb-8 px-6 space-y-6">
        
        {/* Testimonials */}
        <div className="max-w-sm mx-auto space-y-3">
          <p className="text-xs font-semibold text-center text-foreground/70">
            {isUSA ? '💬 What moms are saying' : '💬 O que as mamães dizem'}
          </p>
          <div className="space-y-2">
            {[
              { 
                textPt: '"Esse app me salvou nas madrugadas! Super completo."', 
                textEn: '"This app saved me during late nights! Super complete."',
                namePt: '— Ana, mãe do Miguel', nameEn: '— Ana, mom of Miguel'
              },
              { 
                textPt: '"Amo o player de músicas e os guias práticos!"', 
                textEn: '"I love the music player and practical guides!"',
                namePt: '— Juliana, mãe da Sofia', nameEn: '— Juliana, mom of Sofia'
              },
              { 
                textPt: '"Indispensável pra qualquer mãe de primeira viagem."', 
                textEn: '"Essential for any first-time mom."',
                namePt: '— Camila, grávida de 32 sem.', nameEn: '— Camila, 32 weeks pregnant'
              },
            ].map((t, i) => (
              <div key={i} className="p-3 rounded-2xl bg-card/40 backdrop-blur-sm border border-border/20">
                <p className="text-[11px] text-foreground/80 italic leading-relaxed">
                  {isUSA ? t.textEn : t.textPt}
                </p>
                <p className="text-[10px] text-primary/70 font-medium mt-1">
                  {isUSA ? t.nameEn : t.namePt}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-sm mx-auto grid grid-cols-3 gap-3">
          {[
            { value: '10k+', labelPt: 'Mamães ativas', labelEn: 'Active moms' },
            { value: '4.9★', labelPt: 'Avaliação', labelEn: 'Rating' },
            { value: '50+', labelPt: 'Recursos', labelEn: 'Features' },
          ].map((stat, i) => (
            <div key={i} className="text-center p-3 rounded-2xl bg-card/30 border border-border/20">
              <p className="text-lg font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-[9px] text-muted-foreground mt-0.5">{isUSA ? stat.labelEn : stat.labelPt}</p>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="space-y-2">
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
          <p className="text-[9px] text-center text-muted-foreground/30">
            {isUSA ? 'By signing in you agree to our terms' : 'Ao entrar você concorda com nossos termos'}
          </p>
          <p className="text-[9px] text-center text-muted-foreground/40 font-medium">
            © {new Date().getFullYear()} Mamãe Zen Premium — {isUSA ? 'All rights reserved' : 'Todos os direitos reservados'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
