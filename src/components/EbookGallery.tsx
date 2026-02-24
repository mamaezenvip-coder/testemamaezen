import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Download, Eye, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCountry } from '@/contexts/CountryContext';

import cover1 from '@/assets/ebook-cover-1.jpg';
import cover2 from '@/assets/ebook-cover-2.jpg';
import cover3 from '@/assets/ebook-cover-3.jpg';
import cover4 from '@/assets/ebook-cover-4.jpg';
import cover5 from '@/assets/ebook-cover-5.jpg';

interface Ebook {
  id: number;
  title: string;
  titleEN: string;
  description: string;
  descriptionEN: string;
  cover: string;
  file: string;
  category: string;
  categoryEN: string;
}

const ebooks: Ebook[] = [
  {
    id: 1,
    title: 'Primeiros Passos do Bebê',
    titleEN: "Baby's First Steps",
    description: 'Guia completo para acompanhar os primeiros marcos do desenvolvimento do seu bebê.',
    descriptionEN: 'Complete guide to follow your baby\'s first developmental milestones.',
    cover: cover1,
    file: '/ebooks/Primeiros-Passos-do-Bebe.pdf',
    category: 'Bebê',
    categoryEN: 'Baby',
  },
  {
    id: 2,
    title: 'Odeio Ser Mãe',
    titleEN: 'I Hate Being a Mom',
    description: 'Um olhar honesto sobre os desafios da maternidade que ninguém conta.',
    descriptionEN: 'An honest look at the challenges of motherhood nobody talks about.',
    cover: cover2,
    file: '/ebooks/Odeio_ser_mae.pdf',
    category: 'Maternidade',
    categoryEN: 'Motherhood',
  },
  {
    id: 3,
    title: 'O Diadema de Cinzas',
    titleEN: 'The Ash Diadem',
    description: 'Uma história envolvente de fantasia e superação para momentos de relaxamento.',
    descriptionEN: 'An engaging fantasy story of overcoming for relaxation moments.',
    cover: cover3,
    file: '/ebooks/O-Diadema-de-Cinzas.pdf',
    category: 'Literatura',
    categoryEN: 'Literature',
  },
  {
    id: 4,
    title: 'O Despertar da Mãe Confiante',
    titleEN: 'The Awakening of the Confident Mother',
    description: 'Desperte a mãe confiante que existe em você com técnicas práticas.',
    descriptionEN: 'Awaken the confident mother within you with practical techniques.',
    cover: cover4,
    file: '/ebooks/O-Despertar-da-Mae-Confiante.pdf',
    category: 'Autoajuda',
    categoryEN: 'Self-help',
  },
  {
    id: 5,
    title: 'As 7 Técnicas Avançadas Kabutizukito',
    titleEN: 'The 7 Advanced Kabutizukito Techniques',
    description: 'Técnicas avançadas para equilíbrio emocional e bem-estar na maternidade.',
    descriptionEN: 'Advanced techniques for emotional balance and well-being in motherhood.',
    cover: cover5,
    file: '/ebooks/AS-7-TECNICAS-AVANCADAS-KABUTIZUKITO.pdf',
    category: 'Bem-estar',
    categoryEN: 'Wellness',
  },
];

const EbookGallery = () => {
  const { isUSA } = useCountry();
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);

  const handleDownload = (ebook: Ebook) => {
    const link = document.createElement('a');
    link.href = ebook.file;
    link.download = ebook.file.split('/').pop() || 'ebook.pdf';
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-lg text-foreground">
          {isUSA ? '📚 E-book Gallery' : '📚 Galeria de E-books'}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {ebooks.map((ebook) => (
          <Card
            key={ebook.id}
            className="overflow-hidden border-primary/20 bg-card/80 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
            onClick={() => setSelectedEbook(ebook)}
          >
            <div className="aspect-[2/3] overflow-hidden relative">
              <img
                src={ebook.cover}
                alt={ebook.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <Eye className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="p-3 space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                {isUSA ? ebook.categoryEN : ebook.category}
              </span>
              <h4 className="text-xs font-bold text-foreground leading-tight line-clamp-2">
                {isUSA ? ebook.titleEN : ebook.title}
              </h4>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedEbook} onOpenChange={() => setSelectedEbook(null)}>
        <DialogContent className="sm:max-w-md bg-card border-border max-h-[90vh] overflow-y-auto">
          {selectedEbook && (
            <>
              <DialogHeader>
                <DialogTitle className="text-foreground text-lg">
                  {isUSA ? selectedEbook.titleEN : selectedEbook.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="aspect-[2/3] max-h-64 mx-auto overflow-hidden rounded-lg">
                  <img
                    src={selectedEbook.cover}
                    alt={selectedEbook.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-full">
                  {isUSA ? selectedEbook.categoryEN : selectedEbook.category}
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isUSA ? selectedEbook.descriptionEN : selectedEbook.description}
                </p>
                <Button
                  onClick={() => handleDownload(selectedEbook)}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                  size="lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isUSA ? 'Download E-book' : 'Baixar E-book'}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EbookGallery;
