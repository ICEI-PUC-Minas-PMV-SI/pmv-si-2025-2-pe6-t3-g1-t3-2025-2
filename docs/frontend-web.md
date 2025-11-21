# Front-end Web

O projeto Front-end Web do sistema **Hotel Fazenda** tem como objetivo oferecer uma interface moderna, intuitiva e responsiva, que permita aos usuários (hóspedes, garçons, gerentes e administradores) interagir com o sistema de forma prática e segura. A aplicação web é responsável por permitir o acesso ao cardápio digital, gestão de reservas, controle de quartos e autenticação por perfis, garantindo uma experiência fluida e eficiente tanto para o cliente final quanto para a equipe administrativa do hotel.

## Projeto da Interface Web

A interface foi desenvolvida em **React (Vite)**, integrando-se diretamente à API desenvolvida em **.NET 9**, com banco de dados **PostgreSQL**. O layout segue uma estética rústica e acolhedora, inspirada em hotéis fazenda, utilizando tons neutros e elementos visuais que remetem à natureza e ao conforto. O design foi pensado para ser funcional e agradável, com navegação simples, componentes reutilizáveis e foco na acessibilidade.

As principais páginas da aplicação são:
- **Home**: apresenta informações institucionais, imagens do hotel e botões de acesso rápido para reservas e cardápio digital.
- **Login**: tela de autenticação com validação de credenciais via API (JWT), direcionando o usuário para o painel de acordo com o seu perfil.
- **Dashboard (restrito)**: painel administrativo com funcionalidades distintas conforme o tipo de usuário.
  - **Administrador**: gestão completa de usuários e permissões.
  - **Gerente**: gerenciamento de quartos, reservas e cardápio.
  - **Garçom**: controle de pedidos e acompanhamento em tempo real.
- **Cardápio Digital**: visualização dos produtos disponíveis, com imagens, descrição e valores, além da funcionalidade de adicionar itens ao pedido.
- **Reservas e Quartos**: controle de disponibilidade, cadastro e histórico de reservas realizadas.

### Wireframes

Os wireframes do projeto foram elaborados para orientar a construção da interface, representando a disposição dos elementos e a hierarquia visual das páginas. Estão armazenados na pasta `docs/wireframes/`, incluindo os arquivos:
- `home.png`
- `login.png`
- `dashboard.png`
- `cardapio.png`
- `quartos.png`
- `reservas.png`

Esses modelos servem como base para a implementação das páginas, garantindo consistência no design e usabilidade.

### Design Visual

O estilo visual do sistema foi definido a partir de uma paleta de cores que remete ao ambiente de fazenda e natureza, mantendo um contraste adequado e leitura agradável. A tipografia e os ícones seguem um padrão simples e harmônico.

**Paleta de cores:**
- Bege de fundo: `#F5F1E8`
- Verde oliva escuro: `#3D5B3D`
- Verde oliva claro: `#5F7F5F`
- Marrom: `#6E4F3A`
- Branco para cards: `#FFFFFF`
- Cinza de texto: `#2B2B2B`

**Tipografia:**
- Títulos: *Merriweather* (serif)
- Texto: *Inter* (sans-serif)

**Ícones e logotipo:**
- Ícones padronizados com a biblioteca `lucide-react`.
- Ícones específicos armazenados na pasta `/public/icons` (exemplo: `quarto.png`).
- Logotipo oficial do projeto: `logoHF.pnj`.

O layout utiliza botões arredondados, sombras suaves, cards com fundo branco e bordas claras, além de efeitos visuais sutis para foco e interação.

## Fluxo de Dados

O fluxo de dados segue uma arquitetura cliente-servidor. A aplicação web consome os dados da API por meio de requisições HTTP utilizando **Axios**. O usuário realiza login, recebe um token JWT, e acessa as rotas conforme seu perfil. O token é armazenado em `localStorage` e injetado automaticamente nos cabeçalhos das requisições.

1. O usuário acessa a página de login e insere e-mail e senha.
2. A aplicação envia as credenciais para o endpoint `/api/Auth/login`.
3. A API valida o usuário e retorna um token JWT.
4. O front-end armazena o token e libera as rotas protegidas.
5. As demais páginas consomem os endpoints correspondentes (produtos, quartos, reservas, usuários).

## Tecnologias Utilizadas
- **Frontend:** React, Vite, React Router, Axios, Context API/Zustand.
- **Estilo:** CSS Modules, Tailwind ou Styled Components.
- **Ícones:** lucide-react.
- **Backend:** API em .NET 9 (JWT).
- **Banco de Dados:** PostgreSQL.
- **Testes:** Vitest, React Testing Library, Cypress.
- **Hospedagem:** Vercel, Netlify ou servidor Nginx.
- **Versionamento:** Git e GitHub.

## Considerações de Segurança

A aplicação adota práticas recomendadas para segurança de sistemas distribuídos:
- **Autenticação segura:** via JWT, emitido pela API após login.
- **Autorização baseada em papéis:** controle de acesso conforme perfil (Administrador, Gerente, Garçom).
- **Proteção contra XSS e CSRF:** sanitização de dados e uso de HTTPS.
- **Gerenciamento de sessão:** expiração automática do token e logout seguro.
- **Variáveis de ambiente:** armazenamento em arquivos `.env` sem informações sensíveis no repositório.
- **Criptografia:** tráfego protegido via HTTPS.

## Implantação

[Instruções para implantar a aplicação distribuída em um ambiente de produção.]

1. Defina os requisitos de hardware e software necessários para implantar a aplicação em um ambiente de produção.
2. Escolha uma plataforma de hospedagem adequada, como um provedor de nuvem ou um servidor dedicado.
3. Configure o ambiente de implantação, incluindo a instalação de dependências e configuração de variáveis de ambiente.
4. Faça o deploy da aplicação no ambiente escolhido, seguindo as instruções específicas da plataforma de hospedagem.
5. Realize testes para garantir que a aplicação esteja funcionando corretamente no ambiente de produção.

## Testes

[Descreva a estratégia de teste, incluindo os tipos de teste a serem realizados (unitários, integração, carga, etc.) e as ferramentas a serem utilizadas.]

1. Crie casos de teste para cobrir todos os requisitos funcionais e não funcionais da aplicação.
2. Implemente testes unitários para testar unidades individuais de código, como funções e classes.
3. Realize testes de integração para verificar a interação correta entre os componentes da aplicação.
4. Execute testes de carga para avaliar o desempenho da aplicação sob carga significativa.
5. Utilize ferramentas de teste adequadas, como frameworks de teste e ferramentas de automação de teste, para agilizar o processo de teste.

# Referências

O grupo utilizou como referência principal os conteúdos disponibilizados no microfundamento de desenvolvimento Web.

# Planejamento

##  Quadro de tarefas

> Apresente a divisão de tarefas entre os membros do grupo e o acompanhamento da execução, conforme o exemplo abaixo.

### Semana 1

Atualizado em: 06/10/2025

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| Carlos       | Desenvolvimento módulo Login | 06/10/2025     | 17/10/2025 | ✔️    | 05/02/2024      |
| Raphael        | Testes    | 06/10/2025     | 17/10/2025 | ✔️    |                 |
| Déborah        | Desenvolvimento módulo Hospeddagem  | 06/10/2025     | 17/10/2025 | ✔️     |                 |
| Junio firmino        | Testes  |    06/10/2025        | 17/10/2025 | ✔️    |       |
| André        | Desenvolvimento módulo pedido  |    06/10/2025        | 17/10/2025 | ✔️    |       |


#### Semana 2

Atualizado em: 20/10/2025

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| Carlos        | Desenvolvimento módulo Login   | 20/10/2025     | 30/10/2025 | ✔️    | 05/02/2024      |
| Raphael        | Testes    | 20/10/2025     | 30/10/2025 | ✔️    |                 |
| Déborah        | Desenvolvimento módulo Hospeddagem  | 20/10/2025     | 30/10/2025| ✔️    |                 |
| Junio Firmino        | Testes   |  22/10/2025    | 30/10/2025 | ✔️    |       |
| André        | Desenvolvimento módulo pedido  |  20/10/2025    | 30/10/2025 | ✔️    |       |

Legenda:
- ✔️: terminado
- 📝: em execução
- ⌛: atrasado
- ❌: não iniciado

