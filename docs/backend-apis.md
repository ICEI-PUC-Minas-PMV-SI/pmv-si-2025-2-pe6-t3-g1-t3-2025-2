# APIs e Web Services

Para este projeto, foi desenvolvida uma API RESTful robusta que atua como o componente central do sistema de gestão do hotel-fazenda. A API centraliza todas as regras de negócio e o acesso aos dados, fornecendo uma interface segura e bem definida para que as aplicações cliente (como o frontend web e o aplicativo móvel) possam consumir e manipular as informações do sistema.

---

## Objetivos da API

O objetivo principal da API é fornecer um conjunto de **endpoints seguros e performáticos** para gerenciar as entidades centrais do sistema.  

Os objetivos da API abrangem desde a gestão completa de usuários e autenticação, que servirá como pilar de segurança para o sistema, até as funcionalidades essenciais do hotel, como o controle de hospedagens, o gerenciamento de produtos e o registro de pedidos do restaurante.

---

### Modelagem da Aplicação

A arquitetura da API foi estruturada seguindo o padrão **Controller-Service-Repository**, visando uma clara separação de responsabilidades e facilitando a manutenção e a testabilidade do código.

- **Controllers**: Camada mais externa, responsável por receber as requisições HTTP, validar os dados de entrada e orquestrar as respostas.  
- **Services**: Onde residem as regras de negócio. Exemplo: criptografia da senha antes de salvar no banco.  
- **Repositories**: Camada de acesso a dados, responsável pela comunicação com o banco via **Entity Framework Core**.

A principal entidade definida até o momento é a de **User**, que contém informações como:

- `Id`
- `Name`
- `Email`
- `PasswordHash`
- `Role` (enum: `Admin`, `Gerente`, `Hospede`)

Para a comunicação com o cliente, foram criados **DTOs** como `CreateUserDto` e `UserViewDto`, garantindo que apenas os dados necessários e seguros sejam expostos pela API.

Para a entidade **Produtos** temos as seguintes informções:

- `Id`
- `Name`
- `Preco`
- `Estoque`

---

### Tecnologias Utilizadas

- **.NET 9 / ASP.NET Core** → Criação dos endpoints RESTful  
- **Entity Framework Core** → Persistência de dados (SQL Server)  
- **EF Core Migrations** → Versionamento do esquema do banco  
- **JWT** → Autenticação  
- **BCrypt.Net-Next** → Hash de senhas  
- **Swagger (OpenAPI)** → Documentação e testes interativos  

---

### API Endpoints

Os endpoints são organizados por recursos. Atualmente:

### Documentação Cardápio Digital
Documentação realizada via Postman de acordo com a URL abaixo:
- https://documenter.getpostman.com/view/49021780/2sB3QGvCMA

#### Autenticação
- **POST** `/api/auth/login` → Recebe e-mail e senha e retorna um **JWT** válido.

#### Usuários
- **GET** `/api/users` → Retorna todos os usuários (**Admin/Gerente**)  
- **GET** `/api/users/{id}` → Retorna usuário específico (**Admin/Gerente**)  
- **POST** `/api/users` → Cria novo usuário (**Público**)  
- **PUT** `/api/users/{id}` → Atualiza usuário (**Admin**)  
- **DELETE** `/api/users/{id}` → Remove usuário (**Admin**)

#### Produtos

- **GET** `/api/produto` → Retorna todos os produtos (**Admin**)  
- **GET** `/api/produto/{id}` → Retorna produto específico (**Admin**)  
- **POST** `/api/produto` → Cria novo produto (**Admin**)  
- **PUT** `/api/produto/{id}` → Atualiza produto (**Admin**)  
- **DELETE** `/api/produto/{id}` → Remove produto (**Admin**)

---

### Considerações de Segurança

- **Autenticação** via login que gera **JWT** assinado.  
- **Autorização** baseada em **Role-Based Access Control (RBAC)**.  
- Uso do atributo `[Authorize]` nos endpoints para restrição de acesso.  
- **Senhas nunca em texto plano**: sempre hash com **BCrypt**.  

---

### Implantação

A implantação da API será realizada em um ambiente de produção configurado para garantir disponibilidade, segurança e performance.

A plataforma de hospedagem escolhida é um Servidor Virtual Privado (VPS), que oferece um bom equilíbrio entre custo e controle sobre o ambiente. A utilização de um VPS permite a configuração personalizada do servidor para atender aos requisitos específicos da aplicação.

Requisitos Mínimos do Ambiente de Produção:

Hardware (VPS):

CPU: 2 vCores

RAM: 4 GB

Armazenamento: 50 GB SSD

Software:

Sistema Operacional: Linux (Ubuntu 22.04 LTS ou superior).

Servidor Web: Nginx, configurado como proxy reverso para a aplicação Kestrel.

Runtime: .NET 9.

Banco de Dados: Instância do SQL Server para Linux ou um serviço de banco de dados gerenciado.


---

### Testes

- **Swagger UI** → Testes interativos rápidos, com a [documentação e evidências dos testes disponível aqui](https://sgapucminasbr-my.sharepoint.com/personal/1473720_sga_pucminas_br/_layouts/15/guestaccess.aspx?share=ETOvDMKM81tBv46wyxfZB_AB6CZnFM1sv2n0wfzCfWRZvg&rtime=E8VQDycE3kg).
---

# Referências

* **[Documentação Oficial do ASP.NET Core - Microsoft](https://learn.microsoft.com/pt-br/aspnet/core/)**
  * Principal fonte de consulta para a estrutura da API, configuração de serviços, middleware e melhores práticas da plataforma.

* **[Documentação Oficial do Entity Framework Core - Microsoft](https://learn.microsoft.com/pt-br/ef/core/)**
  * Referência para toda a camada de acesso a dados, incluindo configuração do DbContext, mapeamento de entidades, migrations e consultas.

* **[JSON Web Tokens (JWT)](https://jwt.io/)**
  * Site oficial com a especificação e ferramentas para depuração de tokens JWT, utilizado como base para a implementação da autenticação.

* **[Swashbuckle.AspNetCore - Repositório no GitHub](https://github.com/domaindrivendev/Swashbuckle.AspNetCore)**
  * Biblioteca utilizada para a geração da documentação interativa da API (Swagger UI). O repositório contém informações de configuração e uso.

* **[BCrypt.Net - Repositório no GitHub](https://github.com/BcryptNet/bcrypt.net)**
  * Referência da biblioteca utilizada para o hashing seguro das senhas de usuário, fundamental para a camada de segurança.

* **[Diretrizes de design de API REST - Microsoft Azure](https://learn.microsoft.com/pt-br/azure/architecture/best-practices/api-design)**
  * Um guia de melhores práticas para a construção de APIs RESTful, abordando convenções de nomenclatura, uso de verbos HTTP e códigos de status.

# Planejamento

##  Quadro de tarefas

> Apresente a divisão de tarefas entre os membros do grupo e o acompanhamento da execução, conforme o exemplo abaixo.

### Semana 1

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| Carlos        | Criar estrutura Api | 04/09/2025     | 07/09/2025 | ✔️    | 05/09/2025      |
| Raphael        | Criar requisitos funcionais  | 08/09/2025    | 02/09/2025 | ✔️    |        02/09/2025         |
| AlunoY        | Histórias de usuário  | 01/01/2024     | 07/01/2005 | ⌛     |                 |
| AlunoK        | Personas 1  |    01/01/2024        | 12/02/2005 | ❌    |       |

#### Semana 2

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| Carlos        | Crud de usuários | 08/09/2025     | 10/09/2025 | ✔️    | 09/09/2025      |
| Raphael        | Retificação de documentação | 12/09/2025     | 08/09/2025 | ✔️    |        08/09/2025         |
| AlunoY        | Página de login  | 01/02/2024     | 07/03/2024 | ⌛     |                 |
| AlunoK        | Script de login  |  01/01/2024    | 12/03/2024 | ❌    |       |

#### Semana 3

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| Carlos        | Login com Autenticação| 17/09/2025     | 20/09/2025 | ✔️    | 17/09/2025      |
| Raphael        | Crud de produtos    | 19/09/2025     | 18/09/2025 | ✔️    |        18/09/2025         |
| AlunoY        | Página de login  | 01/02/2024     | 07/03/2024 | ⌛     |                 |
| AlunoK        | Script de login  |  01/01/2024    | 12/03/2024 | ❌    |       |

#### Semana 4

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| Carlos        | Documentação e testes| 28/09/2025     | 05/10/2025 | ✔️    | 30/09/2025      |
| Junio Firmino | Criação cardápio Digital API | 28/09/2025 | 05/10/2025 |  ✔️   |                 |
| Raphael        | Documentação de testes | 27/09/2025     | 05/10/2025 | ✔️     |        05/10/2025         |
| AlunoK        | Script de login  |  01/01/2024    | 12/03/2024 | ❌    |       |

Legenda:
- ✔️: terminado
- 📝: em execução
- ⌛: atrasado
- ❌: não iniciado
