# Sistema de Gerenciamento Silva Gás
## Manual de Funcionalidades

---

## 1. Acesso ao Sistema

### Cadastro de Usuários
- Permite que novos usuários se registrem no sistema
- Informações necessárias: email e senha (mínimo 6 caracteres)
- Após o cadastro, o usuário já pode acessar o sistema

### Login
- Usuários cadastrados fazem login com email e senha
- Sistema identifica automaticamente se o usuário tem permissões de administrador

### Recuperação de Senha
- Caso o usuário esqueça a senha, pode solicitar recuperação por email
- Recebe um link para redefinir a senha

### Sair do Sistema
- Botão disponível no menu para encerrar a sessão

---

## 2. Gerenciamento de Produtos

### Cadastrar Produtos
- Adicionar novos produtos ao catálogo
- Informações do produto:
  - Nome do produto (obrigatório)
  - Descrição (opcional)
  - Categoria: GLP, GN, GNV, Acessórios ou Outros
  - Preço em reais (obrigatório)
  - Quantidade em estoque (obrigatório)
  - Foto do produto (opcional, tamanho máximo 10MB)

### Visualizar Produtos
- Lista completa de todos os produtos cadastrados
- Exibe:
  - Foto miniatura
  - Nome
  - Categoria
  - Preço
  - Quantidade em estoque
  - Data de cadastro
  - Descrição
- Pesquisar produtos por nome, categoria ou descrição
- Ordenar produtos na tabela

### Editar Produtos
- Alterar qualquer informação de produtos já cadastrados
- Trocar a foto do produto
- Atualizar preços e estoque

### Excluir Produtos
- Remover produtos do sistema
- Sistema pede confirmação antes de excluir

### Recursos Adicionais
- Contador de produtos cadastrados
- Visualização prévia das fotos
- Controle de estoque em tempo real

---

## 3. Gerenciamento de Acessórios

### Cadastrar Acessórios
- Adicionar novos acessórios
- Informações necessárias:
  - Nome do acessório (obrigatório)
  - Preço em reais (obrigatório)
  - Quantidade em estoque (obrigatório)
  - Foto (opcional, tamanho máximo 10MB)

### Visualizar Acessórios
- Lista de todos os acessórios
- Mostra: foto, nome, preço, estoque e data de cadastro

### Editar Acessórios
- Alterar dados dos acessórios
- Trocar fotos
- Atualizar preços e estoque

### Excluir Acessórios
- Remover acessórios do sistema
- Confirmação antes de excluir

---

## 4. Sistema de Sorteios

### Criar Sorteios
- Cadastrar novos sorteios/rifas
- Informações do sorteio:
  - Nome do sorteio (obrigatório)
  - Descrição (opcional)
  - Produto relacionado (opcional)
  - Data de início (obrigatório)
  - Data de término (obrigatório)
  - Imagem do sorteio (opcional)
- Todos os usuários cadastrados participam automaticamente

### Visualizar Sorteios
- Cartões com informações de cada sorteio:
  - Imagem
  - Nome e descrição
  - Datas de início e fim
  - Produto relacionado
  - Aviso quando é o último dia
- Painel com estatísticas:
  - Total de sorteios
  - Total de usuários cadastrados
  - Sorteios ativos

### Realizar Sorteios
- Roleta interativa para sortear vencedor
- Animação com nomes dos participantes girando
- Seleção aleatória do ganhador
- Anúncio do vencedor com email
- Salvamento das informações do ganhador

### Ver Participantes
- Lista de todos os participantes de cada sorteio
- Mostra o email de cada participante

### Excluir Sorteios
- Remover sorteios do sistema
- Confirmação antes de excluir

---

## 5. Gerenciamento de Notificações

### Criar Notificações
- Criar avisos para os usuários
- Informações da notificação:
  - Título (obrigatório)
  - Mensagem (obrigatório)
  - Produto relacionado (opcional)
  - Data de validade (obrigatório)

### Visualizar Notificações
- Tabela com todas as notificações
- Mostra:
  - Título
  - Mensagem
  - Produto relacionado (se houver)
  - Data de validade
  - Status (ativa ou expirada)
- Cores diferentes para notificações ativas e expiradas
- Pesquisar notificações por título ou mensagem
- Filtrar por status de validade

### Editar Notificações
- Alterar dados das notificações
- Mudar produto relacionado
- Estender ou alterar data de validade

### Excluir Notificações
- Remover notificações
- Confirmação antes de excluir

### Controle de Validade
- Sistema marca automaticamente notificações vencidas
- Indicadores visuais em tempo real

---

## 6. Painel Administrativo (Apenas Administradores)

### Métricas Financeiras
- Visualizar receita total de todos os pedidos
- Ver quantidade de pedidos realizados

### Gerenciamento de Pedidos
- Tabela completa com todos os pedidos:
  - Data e hora do pedido
  - Nome do cliente
  - Email do cliente
  - Status (A Caminho, Concluído, Cancelado)
  - Valor total

### Filtros de Pedidos
- Pesquisar por nome ou email do cliente
- Filtrar por status do pedido
- Filtrar por período (data inicial e final)
- Aplicar múltiplos filtros ao mesmo tempo

### Estatísticas de Usuários
- Total de usuários cadastrados
- Novos usuários nos últimos 30 dias
- Acompanhamento do crescimento

### Painéis de Resumo
- Cartões com informações importantes:
  - Receita total
  - Pedidos concluídos
  - Pedidos pendentes
  - Total de usuários
  - Novos usuários (últimos 30 dias)

---

## 7. Navegação do Sistema

### Páginas Disponíveis

| Página | Acesso | Descrição |
|--------|--------|-----------|
| Início | Todos | Página de boas-vindas |
| Login | Todos | Entrar no sistema |
| Produtos | Usuários logados | Gerenciar produtos |
| Acessórios | Usuários logados | Gerenciar acessórios |
| Sorteios | Usuários logados | Gerenciar e realizar sorteios |
| Notificações | Usuários logados | Gerenciar avisos |
| Admin | Apenas administradores | Pedidos e estatísticas |

### Menu de Navegação
- Logo Silva Gás (volta para início)
- Link para Produtos
- Link para Acessórios
- Link para Sorteios
- Link para Admin (só aparece para administradores)
- Link para Notificações
- Botão de Sair

---

## 8. Recursos Especiais

### Gerenciamento de Imagens
- Fazer upload de fotos para produtos, acessórios e sorteios
- Visualizar prévia antes de enviar
- Limite de 10MB por imagem
- Apenas arquivos de imagem são aceitos
- Imagens antigas são substituídas automaticamente

### Busca e Filtros
- Pesquisa em tempo real
- Filtrar por múltiplos critérios
- Filtrar por período
- Filtrar por status
- Filtrar por categoria

### Datas e Horários
- Calendário para escolher datas dos sorteios
- Controle de validade de notificações
- Registro de quando tudo foi criado ou alterado
- Datas no formato brasileiro

### Interface do Usuário
- Indicadores de carregamento
- Confirmações antes de ações importantes
- Mensagens de sucesso e erro
- Funciona em celular, tablet e computador
- Modo claro e escuro
- Animações e transições suaves
- Design com cartões e gradientes

---

## 9. Segurança e Controle

### Proteção de Acesso
- Todas as funcionalidades principais exigem login
- Painel administrativo só para administradores
- Sistema detecta automaticamente a sessão do usuário

### Confirmações
- Ações importantes pedem confirmação
- Evita exclusões acidentais

### Organização
- Cada usuário vê suas próprias informações
- Dados separados por usuário

---

## 10. Fluxo de Uso

### Usuário Comum
1. Fazer cadastro ou login
2. Navegar pelo menu
3. Gerenciar produtos e acessórios
4. Participar de sorteios
5. Ver e criar notificações
6. Sair do sistema quando terminar

### Administrador
Todas as funcionalidades do usuário comum, mais:
1. Acessar painel administrativo
2. Ver estatísticas de pedidos
3. Acompanhar métricas de usuários
4. Controlar receita
5. Filtrar e pesquisar pedidos de várias formas

---

## Resumo Geral

O sistema Silva Gás é uma plataforma completa para gerenciar:
- **Produtos e Acessórios**: cadastro, edição, exclusão e controle de estoque
- **Sorteios**: criação, visualização e realização de sorteios com roleta
- **Notificações**: avisos com controle de validade
- **Pedidos** (admin): acompanhamento financeiro e de vendas
- **Usuários** (admin): estatísticas e crescimento

Tudo com uma interface moderna, fácil de usar e que funciona em qualquer dispositivo!