import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Mail, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Instagram, 
  Facebook,
  ArrowLeft,
  Send
} from "lucide-react";
import silvaGasLogo from "@/assets/silva-gas-logo-home.png";

export default function Support() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("support_tickets")
        .insert([
          {
            name: ticketForm.name,
            email: ticketForm.email,
            subject: ticketForm.subject,
            message: ticketForm.message,
            status: "open"
          }
        ]);

      if (error) throw error;

      toast({
        title: "Ticket criado com sucesso!",
        description: "Entraremos em contato em breve.",
      });

      setTicketForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast({
        title: "Erro ao criar ticket",
        description: "Tente novamente ou entre em contato diretamente conosco.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <img src={silvaGasLogo} alt="Silva Gás" className="h-10" />
          </div>
          <Button onClick={() => navigate("/auth")}>
            Acessar Sistema
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Suporte e Melhorias
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Estamos aqui para ajudar você a aproveitar ao máximo o sistema Silva Gás
          </p>
        </div>

        {/* Contact Information */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Informações de Contato</CardTitle>
            <CardDescription>Entre em contato conosco através dos canais abaixo</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">Email</p>
                  <a href="mailto:projetos@codetechsoftware.com.br" className="text-muted-foreground hover:text-primary transition-colors">
                    projetos@codetechsoftware.com.br
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">Endereço</p>
                  <p className="text-muted-foreground">
                    Av. Orlando Rodrigues da Cunha, 2080<br />
                    Leblon - Uberaba - MG<br />
                    CEP: 38030-370
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">Telefone</p>
                  <a href="tel:+553433151920" className="text-muted-foreground hover:text-primary transition-colors">
                    (34) 3315-1920
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MessageCircle className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">WhatsApp</p>
                  <a href="https://wa.me/5534332151000" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    (34) 3321-5100
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Instagram className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">Instagram</p>
                  <a href="https://instagram.com/silvagasuberaba" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    @silvagasuberaba
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Facebook className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">Facebook</p>
                  <a href="https://facebook.com/silvagasuberaba" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    Silva Gás
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Center */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Central de Ajuda</CardTitle>
            <CardDescription>Perguntas frequentes sobre o sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Como criar uma conta?</AccordionTrigger>
                <AccordionContent>
                  Para criar uma conta, clique em "Acessar Sistema" no topo da página e depois em "Criar Conta". 
                  Preencha seus dados (email e senha) e clique em "Cadastrar". Você receberá um email de confirmação.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Como fazer login no sistema?</AccordionTrigger>
                <AccordionContent>
                  Após criar sua conta, clique em "Acessar Sistema" e insira seu email e senha. 
                  Clique em "Entrar" para acessar o painel principal.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Esqueci minha senha, o que fazer?</AccordionTrigger>
                <AccordionContent>
                  Na tela de login, clique em "Recuperar Senha". Digite seu email cadastrado e você receberá 
                  instruções para redefinir sua senha.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Como participar de um sorteio?</AccordionTrigger>
                <AccordionContent>
                  Após fazer login, acesse a seção "Sorteios" no menu lateral. Você verá todos os sorteios disponíveis. 
                  Clique em "Participar" no sorteio desejado para se inscrever. Você pode acompanhar os sorteios 
                  que está participando no mesmo local.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Como fazer um pedido de produtos?</AccordionTrigger>
                <AccordionContent>
                  No painel principal (Dashboard), você pode visualizar todos os produtos disponíveis. 
                  Selecione a quantidade desejada e clique em "Adicionar ao Pedido". Finalize seu pedido 
                  preenchendo o endereço de entrega e confirme a compra.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>Como acompanhar meus pedidos?</AccordionTrigger>
                <AccordionContent>
                  Você pode acompanhar o status de todos os seus pedidos na seção "Meus Pedidos" no Dashboard. 
                  Lá você verá informações sobre data, valor, status e produtos de cada pedido.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger>Como visualizar notificações?</AccordionTrigger>
                <AccordionContent>
                  Acesse a seção "Notificações" no menu lateral para ver todas as suas notificações, 
                  incluindo promoções, avisos de sorteios e atualizações importantes.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Ticket Form */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Abrir Ticket de Suporte</CardTitle>
            <CardDescription>
              Não encontrou o que procurava? Envie sua dúvida ou sugestão
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={ticketForm.name}
                    onChange={(e) => setTicketForm({ ...ticketForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={ticketForm.email}
                    onChange={(e) => setTicketForm({ ...ticketForm, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Assunto</Label>
                <Input
                  id="subject"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea
                  id="message"
                  rows={6}
                  value={ticketForm.message}
                  onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  "Enviando..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Ticket
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
          <p>© 2024 Silva Gás. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
