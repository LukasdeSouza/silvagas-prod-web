import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Shield, Clock, Database, CheckCircle2, AlertTriangle } from "lucide-react";
import silvaGasLogo from "@/assets/silva-gas-logo.png";
import { Link } from "react-router-dom";

const DataDeletion = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create a support ticket for data deletion request
      const { error } = await supabase
        .from("support_tickets")
        .insert({
          name: "Solicitação de Exclusão",
          email: email,
          subject: "Exclusão de Conta e Dados",
          message: `Solicitação de exclusão de conta e dados pessoais para o email: ${email}`,
          status: "open",
        });

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "Solicitação enviada!",
        description: "Sua solicitação de exclusão foi registrada com sucesso.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar solicitação",
        description: error.message || "Tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white rounded-2xl p-6 mb-4 shadow-elegant">
            <img src={silvaGasLogo} alt="Silva Gás Logo" className="h-16 w-auto" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
            Exclusão de Conta e Dados
          </h1>
          <p className="text-white/80 text-center mt-2 max-w-md">
            Silva Gás - Sistema de Gestão
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-elegant">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-sm">Sua Privacidade</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Respeitamos seu direito à exclusão de dados pessoais
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-elegant">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-3">
                  <Clock className="h-6 w-6 text-amber-500" />
                </div>
                <h3 className="font-semibold text-sm">Prazo de Processamento</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Até 30 dias úteis para conclusão
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-elegant">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                  <Database className="h-6 w-6 text-emerald-500" />
                </div>
                <h3 className="font-semibold text-sm">Exclusão Completa</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Todos os dados pessoais serão removidos
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Steps Card */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-elegant">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Como solicitar a exclusão
                </CardTitle>
                <CardDescription>
                  Siga os passos abaixo para solicitar a exclusão da sua conta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-sm">Informe seu email</p>
                    <p className="text-xs text-muted-foreground">
                      Digite o email cadastrado na sua conta Silva Gás
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-sm">Envie a solicitação</p>
                    <p className="text-xs text-muted-foreground">
                      Clique em "Solicitar Exclusão" para registrar seu pedido
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-sm">Aguarde confirmação</p>
                    <p className="text-xs text-muted-foreground">
                      Você receberá um email confirmando a exclusão em até 30 dias
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Types Card */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-elegant">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Dados que serão excluídos
                </CardTitle>
                <CardDescription>
                  Informações sobre os dados armazenados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                  <p className="font-medium text-sm text-destructive flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Dados excluídos permanentemente:
                  </p>
                  <ul className="text-xs text-muted-foreground mt-2 space-y-1 ml-6">
                    <li>• Email e informações de perfil</li>
                    <li>• Endereços cadastrados</li>
                    <li>• Pontos acumulados</li>
                    <li>• Participações em sorteios</li>
                    <li>• Notificações e preferências</li>
                  </ul>
                </div>

                <div className="p-3 bg-amber-500/5 rounded-lg border border-amber-500/20">
                  <p className="font-medium text-sm text-amber-600 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Dados mantidos por obrigação legal:
                  </p>
                  <ul className="text-xs text-muted-foreground mt-2 space-y-1 ml-6">
                    <li>• Histórico de pedidos (5 anos - fins fiscais)</li>
                    <li>• Notas fiscais emitidas (5 anos - legislação tributária)</li>
                  </ul>
                </div>

                <p className="text-xs text-muted-foreground italic">
                  Após o período de retenção legal, todos os dados remanescentes serão excluídos automaticamente.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Request Form */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-elegant">
            <CardHeader>
              <CardTitle className="text-lg">Solicitar Exclusão de Dados</CardTitle>
              <CardDescription>
                Preencha o formulário abaixo para solicitar a exclusão da sua conta e dados pessoais
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Solicitação Registrada!</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    Sua solicitação de exclusão foi recebida. Você receberá um email de confirmação
                    quando o processo for concluído (em até 30 dias úteis).
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitRequest} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email da conta</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="max-w-md"
                    />
                    <p className="text-xs text-muted-foreground">
                      Digite o mesmo email utilizado para criar sua conta no aplicativo Silva Gás
                    </p>
                  </div>

                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={isLoading}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    {isLoading ? "Enviando..." : "Solicitar Exclusão"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center space-y-4">
            <Link
              to="/auth"
              className="text-white/80 hover:text-white text-sm underline underline-offset-4"
            >
              Voltar para o Login
            </Link>
            <p className="text-white/60 text-xs">
              © {new Date().getFullYear()} Silva Gás. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataDeletion;
