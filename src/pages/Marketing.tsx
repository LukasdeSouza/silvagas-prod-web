import { Package, ShoppingCart, Gift, Trophy, Star, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import logo from "@/assets/silva-gas-logo-home.png";

const Marketing = () => {
  const features = [
    {
      icon: ShoppingCart,
      title: "Pedidos Rápidos",
      description: "Faça seus pedidos de gás de forma rápida e prática direto pelo app"
    },
    {
      icon: Package,
      title: "Gestão Completa",
      description: "Acompanhe seus pedidos, histórico e entregas em tempo real"
    },
    {
      icon: Star,
      title: "Sistema de Pontos",
      description: "Acumule pontos a cada compra e troque por descontos exclusivos"
    },
    {
      icon: Gift,
      title: "Sorteios",
      description: "Participe de sorteios exclusivos e concorra a prêmios incríveis"
    },
    {
      icon: Trophy,
      title: "Recompensas",
      description: "Níveis de resgate pré-definidos com vantagens crescentes"
    },
    {
      icon: Shield,
      title: "Segurança",
      description: "Sistema seguro e confiável para suas compras e dados pessoais"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <img 
          src={logo} 
          alt="Silva Gás Logo" 
          className="h-32 mx-auto mb-8 animate-scale-in"
        />
        <h1 className="text-5xl font-bold mb-4 bg-gradient-elegant bg-clip-text text-transparent">
          Silva Gás
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Seu parceiro de confiança para entrega de gás. Praticidade, rapidez e economia na palma da sua mão.
        </p>
        <Button size="lg" className="gap-2">
          <Package className="h-5 w-5" />
          Baixar Agora
        </Button>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Tudo o que você precisa em um só lugar
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-6 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1"
            >
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Por que escolher Silva Gás?
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary h-6 w-6 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary-foreground text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Entrega Rápida</h3>
                  <p className="text-sm text-muted-foreground">
                    Receba seu pedido de forma ágil e segura
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary h-6 w-6 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary-foreground text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Melhor Preço</h3>
                  <p className="text-sm text-muted-foreground">
                    Preços competitivos e promoções exclusivas
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary h-6 w-6 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary-foreground text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Atendimento Premium</h3>
                  <p className="text-sm text-muted-foreground">
                    Suporte dedicado sempre que você precisar
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary h-6 w-6 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary-foreground text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Pagamento Seguro</h3>
                  <p className="text-sm text-muted-foreground">
                    Múltiplas formas de pagamento com total segurança
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary h-6 w-6 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary-foreground text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Programa de Fidelidade</h3>
                  <p className="text-sm text-muted-foreground">
                    Ganhe pontos e troque por descontos incríveis
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary h-6 w-6 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary-foreground text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Disponível 24/7</h3>
                  <p className="text-sm text-muted-foreground">
                    Faça seu pedido a qualquer hora, qualquer dia
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Comece a economizar agora!
        </h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Baixe o app Silva Gás e aproveite todas as vantagens do nosso sistema de pontos e recompensas.
        </p>
        <Button size="lg" className="gap-2">
          <Package className="h-5 w-5" />
          Baixar App Grátis
        </Button>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Silva Gás. Todos os direitos reservados.</p>
          <p className="mt-2">Sistema de Gestão e Entregas</p>
        </div>
      </footer>
    </div>
  );
};

export default Marketing;