import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="w-full max-w-2xl mx-auto space-y-6 py-4">
        <Link to="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </Link>

        <Card className="bg-card border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl">Política de Privacidade</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-primary mb-2">1. Informações Gerais</h2>
              <p>
                O aplicativo <strong>Mamãe Zen</strong> foi desenvolvido para auxiliar mamães no cuidado com seus bebês, 
                oferecendo guias práticos, ferramentas de acompanhamento e recursos educacionais.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-primary mb-2">2. Coleta de Dados</h2>
              <p className="mb-2">Este aplicativo coleta e armazena localmente em seu dispositivo:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Seu nome (informado voluntariamente)</li>
                <li>Registros de sono do bebê</li>
                <li>Registros de alimentação</li>
                <li>Preferências de uso do aplicativo</li>
              </ul>
              <p className="mt-2">
                <strong>Importante:</strong> Todos os dados são armazenados apenas no seu dispositivo através 
                do localStorage do navegador. Não enviamos, compartilhamos ou armazenamos seus dados em servidores externos.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-primary mb-2">3. Geolocalização</h2>
              <p>
                O aplicativo pode solicitar acesso à sua localização para mostrar hospitais e clínicas próximas 
                em caso de emergência. Esta funcionalidade é opcional e você pode recusar o acesso a qualquer momento. 
                A localização não é armazenada ou compartilhada.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-primary mb-2">4. Cookies e Armazenamento Local</h2>
              <p>
                Utilizamos o localStorage do navegador para salvar suas preferências e dados de uso. 
                Você pode limpar esses dados a qualquer momento através das configurações do seu navegador.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-primary mb-2">5. Segurança</h2>
              <p>
                Como todos os dados são armazenados localmente no seu dispositivo, a segurança depende 
                da proteção do seu próprio aparelho. Recomendamos manter seu dispositivo seguro e atualizado.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-primary mb-2">6. Links Externos</h2>
              <p>
                O aplicativo pode conter links para sites externos (como Google Maps para rotas). 
                Não somos responsáveis pelas políticas de privacidade destes sites.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-primary mb-2">7. Alterações na Política</h2>
              <p>
                Esta política de privacidade pode ser atualizada periodicamente. Recomendamos que você 
                a revise regularmente para estar ciente de quaisquer mudanças.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-primary mb-2">8. Isenção de Responsabilidade</h2>
              <p>
                Este aplicativo fornece informações educacionais e não substitui consultas médicas profissionais. 
                Sempre consulte um pediatra ou médico qualificado para questões relacionadas à saúde do seu bebê.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-primary mb-2">9. Contato</h2>
              <p>
                Para dúvidas sobre esta política de privacidade, entre em contato através do desenvolvedor do aplicativo.
              </p>
            </section>

            <div className="pt-6 border-t space-y-2">
              <p className="text-xs text-muted-foreground text-center">
                <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center space-y-2">
            <p className="text-sm font-semibold">
              © {new Date().getFullYear()} Mamãe Zen Premium
            </p>
            <p className="text-xs text-muted-foreground">
              Todos os direitos reservados a <strong className="text-primary">Hemerson Deckson</strong>
            </p>
            <p className="text-xs text-muted-foreground">
              Desenvolvido com 💝 por <strong className="text-primary">Hemerson Deckson</strong> com a ajuda de{" "}
              <a 
                href="https://lovable.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline font-semibold"
              >
                Lovable.dev
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;
