import { useCountry } from '@/contexts/CountryContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, ExternalLink } from 'lucide-react';

const STORE_URL = 'https://collshp.com/mamaezenshopping';

const ProductShowcase = () => {
  const { isUSA } = useCountry();

  const handleOpenStore = () => {
    window.open(STORE_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-lg text-foreground">
            {isUSA ? 'Mom Shop' : 'Lojinha da Mamãe'}
          </h3>
        </div>
        <Badge variant="secondary" className="text-[10px] font-semibold">
          {isUSA ? 'Official affiliate store' : 'Loja oficial de afiliados'}
        </Badge>
      </div>

      <p className="text-xs text-muted-foreground mb-4">
        {isUSA
          ? 'All products below are loaded directly from your affiliate storefront.'
          : 'Todos os produtos abaixo são carregados diretamente da sua loja de afiliados.'}
      </p>

      <div className="rounded-xl border border-border overflow-hidden bg-muted/20">
        <iframe
          src={STORE_URL}
          title={isUSA ? 'Affiliate store storefront' : 'Vitrine da loja de afiliados'}
          className="w-full h-[640px] border-0"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>

      <div className="mt-4 pt-3 border-t border-border text-center">
        <Button
          onClick={handleOpenStore}
          variant="outline"
          className="w-full border-primary/30 text-primary hover:bg-primary/10 font-semibold"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          {isUSA ? 'Open full store' : 'Abrir loja completa'}
        </Button>
      </div>
    </Card>
  );
};

export default ProductShowcase;
