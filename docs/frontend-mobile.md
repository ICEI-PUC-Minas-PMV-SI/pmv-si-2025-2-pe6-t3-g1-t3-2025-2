# Front-end Móvel

Com o objetivo de ampliar a acessibilidade e a mobilidade do sistema do Hotel Fazenda Capitólio, foi desenvolvida uma versão mobile utilizando **React Native com Expo**. A aplicação móvel segue as diretrizes visuais da versão web, porém foi planejada para proporcionar uma experiência fluida, prática e otimizada para dispositivos móveis, garantindo agilidade operacional e maior flexibilidade tanto para clientes quanto para colaboradores.

A estrutura visual e arquitetural do projeto pode ser observada na organização das pastas conforme apresentado no print, contendo diretórios como `.expo`, `assets`, `constants`, `src`, além dos arquivos principais como `App.tsx`, `app.json` e `tsconfig.json`, que compõem a base do aplicativo.

## Projeto da Interface

A interface foi construída priorizando usabilidade, simplicidade e consistência visual com o front-end web. O desenvolvimento seguiu princípios modernos de UI/UX e utilizou componentes reutilizáveis, garantindo um fluxo de navegação claro e intuitivo para o usuário.

Entre os aspectos principais da interface:

- Navegação estruturada e acessível.
- Layout responsivo para diferentes tamanhos de tela.
- Feedback visual imediato ao usuário.
- Componentes reaproveitáveis, garantindo padronização.
- Estilo visual alinhado à identidade visual estabelecida.

### Wireframes
[Inclua os wireframes das páginas principais da interface, mostrando a disposição dos elementos na página.]

### Design Visual

O design visual da aplicação segue os princípios aplicados na versão web, garantindo:

- **Paleta de cores institucional** do hotel.
- **Tipografia legível** e adaptada a telas móveis.
- **Ícones representativos** com uso de `react-native-vector-icons`.
- **Componentes reutilizáveis** como botões, inputs, cabeçalhos e cards.
- Hierarquia visual clara entre títulos, textos e elementos interativos.

## Fluxo de Dados

A comunicação entre o aplicativo e o back-end ocorre por meio de requisições HTTP enviadas à API .NET criada na etapa anterior. O fluxo segue os seguintes passos:

1. O usuário interage com o aplicativo.
2. O aplicativo envia requisições HTTP via serviços localizados em `src/services`.
3. A API processa as requisições e acessa o banco PostgreSQL.
4. O aplicativo recebe a resposta, atualiza estados internos e exibe informações ao usuário.
   
## Tecnologias Utilizadas

As tecnologias que compõem a solução móvel incluem:

- **React Native** — Desenvolvimento de interfaces nativas
- **Expo** — Execução, testes e empacotamento da aplicação
- **TypeScript** — Tipagem estática e manutenção mais segura
- **React Navigation** — Sistema de rotas e navegação
- **Axios / Fetch API** — Comunicação com o back-end
- **Jest** — Base para testes unitários
- **Vector Icons** — Biblioteca de ícones personalizáveis

## Considerações de Segurança

A aplicação segue boas práticas de segurança, incluindo:

- Autenticação via API com controle adequado de sessão.
- Validação de dados enviados e recebidos.
- Comunicação segura utilizando HTTPS.
- Armazenamento seguro dos dados essenciais no dispositivo.
- Tratamento de erros e exceções.
- Aplicação das recomendações de segurança do Expo e React Native.

## Implantação

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

O desenvolvimento do front-end móvel foi apoiado pelas aulas do microfundamento **“Desenvolvimento de Aplicações Móveis”**, que embasaram tecnicamente o uso do framework **React Native** e suas ferramentas para criação de soluções multiplataforma.

Documentações complementares:

- React Native: https://reactnative.dev  
- Expo: https://docs.expo.dev

# Planejamento

##  Quadro de tarefas

> Apresente a divisão de tarefas entre os membros do grupo e o acompanhamento da execução, conforme o exemplo abaixo.

### Semana 1

Atualizado em: 21/04/2024

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| AlunaX        | Introdução | 01/02/2024     | 07/02/2024 | ✔️    | 05/02/2024      |
| AlunaZ        | Objetivos    | 03/02/2024     | 10/02/2024 | 📝    |                 |
| AlunoY        | Histórias de usuário  | 01/01/2024     | 07/01/2005 | ⌛     |                 |
| AlunoK        | Personas 1  |    01/01/2024        | 12/02/2005 | ❌    |       |

#### Semana 2

Atualizado em: 21/04/2024

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| AlunaX        | Página inicial   | 01/02/2024     | 07/03/2024 | ✔️    | 05/02/2024      |
| AlunaZ        | CSS unificado    | 03/02/2024     | 10/03/2024 | 📝    |                 |
| AlunoY        | Página de login  | 01/02/2024     | 07/03/2024 | ⌛     |                 |
| AlunoK        | Script de login  |  01/01/2024    | 12/03/2024 | ❌    |       |

Legenda:
- ✔️: terminado
- 📝: em execução
- ⌛: atrasado
- ❌: não iniciado

