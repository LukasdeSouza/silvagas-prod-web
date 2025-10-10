import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Database, TrendingUp } from "lucide-react";
import silvaGasLogo from "@/assets/silva-gas-logo-home.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 shadow-[0_20px_60px_-20px_rgba(59,130,246,0.5)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(59,130,246,0))]"></div>
        <div className="container mx-auto px-4 py-24 relative">
          <div className="flex flex-col items-center text-center text-white">
            <div className="relative mb-8">
              <div className="absolute inset-0 blur-2xl opacity-50 bg-white/20 animate-pulse"></div>
              <div className="relative bg-white rounded-2xl p-6 shadow-elegant">
                <img src={silvaGasLogo} alt="Silva Gás Logo" className="h-24 w-auto" />
              </div>
            </div>
            <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-3xl leading-relaxed font-medium">
              Sistema Completo de Gestão de Produtos e Promoções para a Empresa Silva Gás
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/auth")}
              className="text-lg px-10 py-7 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Acessar Sistema
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
          Funcionalidades
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="group bg-card p-8 rounded-xl border shadow-lg hover:shadow-[var(--shadow-elegant)] transition-all duration-300 hover:-translate-y-2">
            <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Autenticação Segura</h3>
            <p className="text-muted-foreground leading-relaxed">
              Sistema completo de login com recuperação de senha e proteção de dados.
            </p>
          </div>

          <div className="group bg-card p-8 rounded-xl border shadow-lg hover:shadow-[var(--shadow-elegant)] transition-all duration-300 hover:-translate-y-2">
            <div className="bg-secondary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors duration-300">
              <Database className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Gestão de Produtos</h3>
            <p className="text-muted-foreground leading-relaxed">
              Cadastre, edite e exclua produtos com facilidade. Controle estoque e preços.
            </p>
          </div>

          <div className="group bg-card p-8 rounded-xl border shadow-lg hover:shadow-[var(--shadow-elegant)] transition-all duration-300 hover:-translate-y-2">
            <div className="bg-accent/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors duration-300">
              <TrendingUp className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Filtros Avançados</h3>
            <p className="text-muted-foreground leading-relaxed">
              Encontre rapidamente os produtos que precisa com busca inteligente.
            </p>
          </div>
        </div>
      </div>

      <footer className="border-t py-10 mt-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="font-medium">© 2025 Silva Gás. Sistema de Gestão de Gás.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
