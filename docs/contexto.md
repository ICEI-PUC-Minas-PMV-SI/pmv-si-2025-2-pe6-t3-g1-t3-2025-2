# Introdução

O setor de turismo e hotelaria está em constante expansão, e a experiência do hóspede é um fator decisivo para a fidelização. Muitos hotéis fazenda ainda operam com processos manuais para hospedagem, pedidos de restaurante e controle de consumo, o que gera atrasos, falhas e insatisfação.

O projeto visa oferecer uma solução distribuida com foco no ramo hoteleiro com ênfase num hotel fazenda localizado no município de Capitólio em Minas Gerais.

## Problema
O processo manual de hospedagem e de vendas do restaurante do hotel gera:
- Erros frequentes nos pedidos.
- Falta de controle sobre consumo e estoque.
- Dificuldade no fechamento da conta do hóspede.
- Experiência negativa e insatisfação do cliente.



Nesse momento você deve apresentar o problema que a sua aplicação deve  resolver. No entanto, não é a hora de comentar sobre a aplicação.

Descreva também o contexto em que essa aplicação será usada, se  houver: empresa, tecnologias, etc. Novamente, descreva apenas o que de  fato existir, pois ainda não é a hora de apresentar requisitos  detalhados ou projetos.

Nesse momento, o grupo pode optar por fazer uso  de ferramentas como Design Thinking, que permite um olhar de ponta a ponta para o problema.

> **Links Úteis**:
> - [Objetivos, Problema de pesquisa e Justificativa](https://medium.com/@versioparole/objetivos-problema-de-pesquisa-e-justificativa-c98c8233b9c3)
> - [Matriz Certezas, Suposições e Dúvidas](https://medium.com/educa%C3%A7%C3%A3o-fora-da-caixa/matriz-certezas-suposi%C3%A7%C3%B5es-e-d%C3%BAvidas-fa2263633655)
> - [Brainstorming](https://www.euax.com.br/2018/09/brainstorming/)

## Objetivos

- Desenvolver uma plataforma distribuída que integre hospedagem e restaurante em tempo real.
- Reduzir erros de pedidos e aumentar a agilidade no atendimento.
- Proporcionar ao hóspede uma experiência personalizada e fluida.
- Oferecer ao hotel uma gestão mais eficiente de consumo, estoque e faturamento.

## Objetivos Esécificos
- Implementar um módulo de pedidos digitais integrado ao quarto do hóspede, permitindo que os consumos feitos no restaurante sejam registrados em tempo real e vinculados à hospedagem.
- Desenvolver relatórios gerenciais automatizados que consolidem dados de hospedagem, pedidos e estoque, apoiando a administração na tomada de decisões mais ágil e precisa.
 
> **Links Úteis**:
> - [Objetivo geral e objetivo específico: como fazer e quais verbos utilizar](https://blog.mettzer.com/diferenca-entre-objetivo-geral-e-objetivo-especifico/)

## Justificativa

A automatização do processo traz benefícios diretos para o hóspede (rapidez, conforto e confiança) e para o hotel (controle, redução de custos e aumento de receita). Um sistema distribuído garante escalabilidade e confiabilidade, podendo ser utilizado em diversos pontos (recepção, restaurante, dispositivos móveis de garçons, aplicação do cliente etc.).

> **Links Úteis**:
> - [Como montar a justificativa](https://guiadamonografia.com.br/como-montar-justificativa-do-tcc/)

## Público-Alvo

O sistema será utilizado por diferentes perfis de usuários dentro do contexto do hotel fazenda, cada um com características, conhecimentos prévios e necessidades específicas:

Hóspedes (Público Primário):
- Perfil variado (famílias, casais, grupos de amigos, turistas).
- Nível de conhecimento tecnológico diverso: alguns com alta familiaridade com aplicativos móveis e outros com dificuldade em usar recursos digitais.
- Relação hierárquica: cliente final, foco principal do serviço.
- Necessidade: praticidade no check-in, pedidos rápidos no restaurante, integração de consumo e conta final sem erros.

Equipe Operacional (Público Secundário):
- Recepcionistas: normalmente com conhecimento intermediário em sistemas de gestão, precisam de agilidade para check-in/out.
- Garçons: muitas vezes com pouca familiaridade tecnológica, exigindo interfaces simples e intuitivas para registrar pedidos.
- Gerentes/Administração: com maior experiência em relatórios e sistemas, necessitam de dashboards e indicadores para tomada de decisão.
- Relação hierárquica: subordinados à gerência → administração → diretoria.

Personas
1- Maria, 34 anos – Hóspede:
- Turista que viaja com a família.
- Usa smartphone diariamente, mas não gosta de sistemas complexos.
- Quer evitar retrabalho (pedidos errados ou demora no atendimento).

2- João, 25 anos – Garçom:
- Atua no restaurante do hotel.
- Tem pouco tempo para aprender tecnologias novas.
- Precisa registrar pedidos de forma simples, rápida e sem erros.

3- Carlos, 45 anos – Gerente do Hotel:
- Responsável pelo controle do hotel fazenda.
- Habituado a planilhas e relatórios.
- Busca indicadores confiáveis e em tempo real para melhorar a gestão.


Descreva quem serão as pessoas que usarão a sua aplicação indicando os diferentes perfis. O objetivo aqui não é definir quem serão os clientes ou quais serão os papéis dos usuários na aplicação. A ideia é, dentro do possível, conhecer um pouco mais sobre o perfil dos usuários: conhecimentos prévios, relação com a tecnologia, relações
hierárquicas, etc.

Adicione informações sobre o público-alvo por meio de uma descrição textual, diagramas de personas e mapa de stakeholders.

> **Links Úteis**:
> - [Público-alvo](https://blog.hotmart.com/pt-br/publico-alvo/)
> - [Como definir o público alvo](https://exame.com/pme/5-dicas-essenciais-para-definir-o-publico-alvo-do-seu-negocio/)
> - [Público-alvo: o que é, tipos, como definir seu público e exemplos](https://klickpages.com.br/blog/publico-alvo-o-que-e/)
> - [Qual a diferença entre público-alvo e persona?](https://rockcontent.com/blog/diferenca-publico-alvo-e-persona/)

# Especificações do Projeto

## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto. Para determinar a prioridade de requisitos, aplicar uma técnica de priorização de requisitos e detalhar como a técnica foi aplicada.

### Requisitos Funcionais

|ID    | Descrição do Requisito  | Prioridade |
|------|-----------------------------------------|----|
|RF-001| Permitir que o usuário cadastre tarefas | ALTA | 
|RF-002| Emitir um relatório de tarefas no mês   | MÉDIA |
|RF-003| Permitir que o usuário tenha acesso aos gastos já realizados | MÉDIA |
|RF-004| Permitir que o usuário se acompanhado consiga ver os gastos de acordo com o usuário | MÉDIA |



### Requisitos não Funcionais

|ID     | Descrição do Requisito  |Prioridade |
|-------|-------------------------|----|
|RNF-001| O sistema deve ser responsivo para rodar em um dispositivos móvel | MÉDIA | 
|RNF-002| Deve processar requisições do usuário em no máximo 3s |  BAIXA | 
|RF-003| Deve lançar a comanda por quarto | ALTA |
|RF-004| Gerar relatórios em PDF | MÉDIA |




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
