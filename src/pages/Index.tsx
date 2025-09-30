import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Flame, ShieldCheck, Database, TrendingUp } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80">
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col items-center text-center text-white">
            <Flame className="h-20 w-20 mb-6 animate-pulse" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              GasManager
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl">
              Sistema Completo de Gestão de Produtos para Empresas de Gás
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/auth")}
              className="text-lg px-8 py-6"
            >
              Acessar Sistema
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Funcionalidades</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <ShieldCheck className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Autenticação Segura</h3>
            <p className="text-muted-foreground">
              Sistema completo de login com recuperação de senha e proteção de dados.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <Database className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Gestão de Produtos</h3>
            <p className="text-muted-foreground">
              Cadastre, edite e exclua produtos com facilidade. Controle estoque e preços.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <TrendingUp className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Filtros Avançados</h3>
            <p className="text-muted-foreground">
              Encontre rapidamente os produtos que precisa com busca inteligente.
            </p>
          </div>
        </div>
      </div>

      <footer className="border-t py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 GasManager. Sistema de Gestão de Gás.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
