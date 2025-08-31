# Introdução

O setor de turismo, no qual se inclui o segmento de hotelaria, ocupa hoje papel relevante na economia mundial, sendo
uma das atividades com maior representatividade econômica, ao lado da indústria do petróleo. Segundo informações do Instituto Brasileiro de Turismo (Embratur), o turismo se configura como uma atividade que gera anualmente US$ 4 trilhões e aproximadamente 280 milhões de empregos em todo o mundo.

A indústria da hospitalidade, termo amplo, inclui uma variedade de organizações e negócios interdependentes, como hotéis,
restaurantes, atrativos turísticos, meios de transporte, agências de viagem, entretenimento e serviços voltados para o atendimento ao turista.

O Censo de Serviços do IBGE de 2002 aponta a existência de 23.366 empresas de “serviços de alojamento” no Brasil, o que
incluiria não apenas hotéis, mas também pousadas, hotéis-fazenda, pensões, motéis etc., com 244 mil pessoas ocupadas nesses estabelecimentos.

O Guia Quatro Rodas de 2005 (informações atualizadas até agosto de 2004) faz uma lista 5.557 hotéis, pousadas e hotéis fazenda, esclarecendo que ela não abrange a totalidade dos empreendimentos existentes, mas apenas aqueles considerados acima de determinado ponto de corte, estabelecido pelos editores. Por sua vez, a publicação eletrônica Onde Hospedar (www.ondehospedar.com.br), o mais completo diretório da hotelaria brasileira, aponta 14.914 meios de hospedagem no Brasil: 9.943 hotéis, 4.094 pousadas, 532 hotéis-fazenda e 345 apart-hotéis, com seus respectivos endereços. Outra fonte de dados do setor, a Hotel Investment Advisors (HIA), estima que cerca de 70% das UHs (Unidades Habitacionais) existentes no país são operados por hotéis independentes das redes.

Com este contexto, o projeto aborda uma solução tecnológica para um hotel fazenda no município de Capitólio que se tornou um importante destino turístico de Minas Gerais, muito procurado nos últimos anos por conta de suas belas cachoeiras e rios de águas transparentes. O Cânion de Furnas é uma das diversas belezas naturais na região, soma-se a isso a proximidade  com a Serra da Canastra, formação rochosa no formato de mesa, onde se encontra a nascente do rio São Francisco e da cachoeira Casca d'Anta, dentro da área do Parque Nacional da Serra da Canastra, habitat do lobo guará, veado-campeiro, onça parda, tatu-canastra, ema, pato-mergulhão, perdiz, perdiz do cerrado, inhambu e uma infinidade de aves. De frente à Serra da Canastra, sua vizinha e gêmea Serra da Babilônia é explorada, inclusive, pelo balonismo.

## Problema
Durante a observação de um hotel-fazenda localizado em Capitólio/MG, foi identificado que os processos de hospedagem e de consumo no restaurante são realizados de forma manual. Essa prática, comum em empreendimentos de pequeno e médio porte, mostra-se ineficiente, morosa e pouco segura, prejudicando a experiência dos hóspedes e a organização do estabelecimento.

Entre os principais problemas encontrados estão:
- erros frequentes no registro de pedidos;
- ausência de controle efetivo sobre consumo e estoque;
- dificuldade no fechamento das contas no momento do check-out;
- experiência negativa e insatisfação dos clientes.

Esse cenário demonstra a necessidade de modernização na forma como o hotel conduz suas atividades, de modo a oferecer maior eficiência operacional e uma experiência mais satisfatória ao hóspede.

## Objetivos

O objetivo geral deste projeto é desenvolver uma plataforma distribuída capaz de integrar, em tempo real, os processos de hospedagem e restaurante de um hotel-fazenda em Capitólio/MG, com vistas a reduzir erros operacionais, agilizar o atendimento, proporcionar ao hóspede uma experiência personalizada e oferecer ao hotel mecanismos mais eficientes de gestão de consumo, estoque e faturamento.

## Objetivos Específicos
- Implementar um módulo de pedidos digitais integrado ao quarto do hóspede, permitindo que os consumos feitos no restaurante sejam registrados em tempo real e vinculados à hospedagem.
- Desenvolver relatórios gerenciais automatizados que consolidem dados de hospedagem, pedidos e estoque, apoiando a administração na tomada de decisões mais ágil e precisa.
 
## Justificativa

A automatização dos processos de hospedagem e de consumo representa uma estratégia essencial para elevar a qualidade do serviço prestado e a satisfação dos clientes. Do ponto de vista do hóspede, a inovação oferece maior comodidade, rapidez no atendimento e segurança no registro de consumos. Para o hotel, o ganho está no controle mais rigoroso de estoque, na redução de falhas humanas e no aumento da confiabilidade das informações financeiras.

A escolha por uma solução distribuída é relevante porque possibilita escalabilidade, confiabilidade e acesso simultâneo em diferentes pontos do hotel, como recepção, restaurante, dispositivos móveis dos garçons e até mesmo aplicações voltadas ao cliente. Dessa forma, a proposta não apenas resolve problemas operacionais imediatos, mas também posiciona o empreendimento em alinhamento com as práticas mais modernas de gestão hoteleira.


## Público-Alvo

O sistema será utilizado por diferentes perfis de usuários no ambiente do hotel-fazenda, cada qual com características, níveis de familiaridade tecnológica e necessidades distintas.

Hóspedes (público primário):
Os hóspedes representam um público heterogêneo, composto por famílias, casais e grupos de amigos que buscam lazer em Capitólio. A familiaridade com tecnologia é variada, indo de pessoas altamente habituadas ao uso de aplicativos móveis até aquelas que encontram dificuldades em lidar com recursos digitais. Suas principais necessidades envolvem praticidade no check-in, agilidade no atendimento, pedidos corretos no restaurante e integração transparente dos consumos ao fechamento da conta.

Equipe operacional (público secundário):
- Recepcionistas: possuem conhecimento intermediário em sistemas de gestão, necessitando de ferramentas ágeis para check-in e check-out.
- Garçons: em geral, apresentam pouca familiaridade com tecnologias mais avançadas, o que exige interfaces simples, objetivas e rápidas para registro de pedidos.
- Gerentes e administradores: possuem maior experiência em relatórios e indicadores e precisam de dashboards claros e confiáveis para apoiar a gestão estratégica do hotel.
Hierarquicamente, esses grupos se organizam de forma subordinada: funcionários → gerência → administração/diretoria.

Personas
1- Maria, 34 anos – Hóspede: turista que viaja com a família, utiliza smartphone diariamente, prefere sistemas simples e deseja rapidez no atendimento.

2- João, 25 anos – Garçom: funcionário do restaurante, tem pouco tempo para treinar em novas tecnologias e precisa registrar pedidos com agilidade e sem falhas.

3- Carlos, 45 anos – Gerente: responsável pelo controle operacional, habituado a planilhas, busca relatórios confiáveis e em tempo real para tomada de decisão.

Esse conjunto de perfis e suas necessidades evidencia a importância de um sistema que seja, ao mesmo tempo, acessível, intuitivo e robusto, atendendo tanto às expectativas dos hóspedes quanto às demandas internas da gestão hoteleira.

# Especificações do Projeto

## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto. Para determinar a prioridade de requisitos, aplicar uma técnica de priorização de requisitos e detalhar como a técnica foi aplicada.

### Requisitos Funcionais

|ID    | Descrição do Requisito  | Prioridade |
|------|-----------------------------------------|----|
|RF-001| Permitir que o usuário peça tarefas | ALTA | 
|RF-002| Emitir um relatório de produtos vendidos no mês em formato PDF  | MÉDIA |
|RF-003| Permitir que o usuário tenha acesso aos gastos já realizados | MÉDIA |
|RF-004| Permitir que o usuário se acompanhado consiga ver os gastos de acordo com as contas vinculadas | MÉDIA |
|RF-005| Permitir gestão de usuário | ALTA |
|RF-006| Permitir gestão de produtos | ALTA |
|RF-007| Permitir ao usuário a gestão de contas vinculadas | ALTA |
|RF-008| Permitir ao gerente ober as tarefas pendentes | MÉDIA |


### Requisitos não Funcionais

|ID     | Descrição do Requisito  |Prioridade |
|-------|-------------------------|----|
|RNF-001| O sistema deve ser responsivo para rodar em um dispositivos móvel | MÉDIA | 
|RNF-002| Deve processar requisições do usuário em no máximo 3s |  BAIXA | 





Com base nas Histórias de Usuário, enumere os requisitos da sua solução. Classifique esses requisitos em dois grupos:

- [Requisitos Funcionais
 (RF)](https://pt.wikipedia.org/wiki/Requisito_funcional):
 correspondem a uma funcionalidade que deve estar presente na
  plataforma (ex: cadastro de usuário).
- [Requisitos Não Funcionais
  (RNF)](https://pt.wikipedia.org/wiki/Requisito_n%C3%A3o_funcional):
  correspondem a uma característica técnica, seja de usabilidade,
  desempenho, confiabilidade, segurança ou outro (ex: suporte a
  dispositivos iOS e Android).
Lembre-se que cada requisito deve corresponder à uma e somente uma
característica alvo da sua solução. Além disso, certifique-se de que
todos os aspectos capturados nas Histórias de Usuário foram cobertos.

## Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

|ID| Restrição                                             |
|--|-------------------------------------------------------|
|01| O projeto deverá ser entregue até o final do semestre |
|02| Não pode ser desenvolvido um módulo de backend        |

Enumere as restrições à sua solução. Lembre-se de que as restrições geralmente limitam a solução candidata.

> **Links Úteis**:
> - [O que são Requisitos Funcionais e Requisitos Não Funcionais?](https://codificar.com.br/requisitos-funcionais-nao-funcionais/)
> - [O que são requisitos funcionais e requisitos não funcionais?](https://analisederequisitos.com.br/requisitos-funcionais-e-requisitos-nao-funcionais-o-que-sao/)

# Catálogo de Serviços

Descreva aqui todos os serviços que serão disponibilizados pelo seu projeto, detalhando suas características e funcionalidades.

# Arquitetura da Solução

Definição de como o software é estruturado em termos dos componentes que fazem parte da solução e do ambiente de hospedagem da aplicação.

![arq](https://github.com/user-attachments/assets/b9402e05-8445-47c3-9d47-f11696e38a3d)


## Tecnologias Utilizadas

Descreva aqui qual(is) tecnologias você vai usar para resolver o seu problema, ou seja, implementar a sua solução. Liste todas as tecnologias envolvidas, linguagens a serem utilizadas, serviços web, frameworks, bibliotecas, IDEs de desenvolvimento, e ferramentas.

Apresente também uma figura explicando como as tecnologias estão relacionadas ou como uma interação do usuário com o sistema vai ser conduzida, por onde ela passa até retornar uma resposta ao usuário.

## Hospedagem

Explique como a hospedagem e o lançamento da plataforma foi feita.

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
