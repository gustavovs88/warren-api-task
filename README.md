# Warren Backend Task

## Comentários do Desenvolvedor

- Gerando a imagem

  - Na minha máquina o comando `docker-compose up` estava gerando um erro nos pacotes npm. Para corrigir foi necessário alterar a o volume referente aos node_modules no arquivo docker-compose.yml:

  ```
  volumes:
    - ./:/node-app
    - /node-app/node_modules
  ```

  - Para a criação dos testes foram incluidos os pacotes `jest` e `mongodb-memory-server` como dependências de desenvolvimento. O pacote `mongodb-memory-server` possibilita a criação de um banco de dados de teste na memória o que torna os testes mais rápidos.
  - A imagem original node:14-alpine não suporta o pacote `mongodb-memory-server`, neste caso o arquivo Dockerfile e docker-compose.yml foram alterados para possibilitar a utilização do pacote e rodar os testes ao subir o container.

  _Obs.: Ao rodar o primeiro teste será realizado o download dos binários do mongodb, esse processo pode demorar mais do que o tempo permitido para execução do teste. Neste caso utilize ` jest.setTimeout(<tempo de downloand em ms>);` no arquivo do primeiro teste. Após o primeiro teste estes dados são armazenados em cache_

### Premissas

- id do cliente é sempre enviado por meio de um header `customer-id`;
- Os dados não enviados pelas querys definidas no escopo do projeto são enviados pelo _body_ do _request_ no formato _JSON_

### Testes

A configuração básica para a escrita dos testes foi concluída , porém não houve tempo hábil realizar todos os testes necessários.

Considerando a arquitetura do projeto entendo que a camada de services deveria ser priorizada para a realização dos testes.

### Estrutura de projeto adotada

Este projeto foi arquitetado pensando na separação de responsabilidades baseando-se no princípio da responsabilidade única do SOLID.

Foram utilizandas camadas de rotas (routes), requisições (controllers), serviços (services) e chamadas ao banco de dados (repositories).

Além destas camadas o projeto possui 2 middlewares que "simulam" a autenticação do usuário (getCustomer) e o processamento das transações financeiras (processTransaction).

A sequência de comunicação entre as camadas segue o seguinte fluxo:

#### client <--> controllers <--> services <--> repositories

Já os middlewares podem se comunicar diretamente com o cliente e os repositories.

### Estrutura de pastas e arquivos

```

warren-api-task
├── docker-compose.yml
├── Dockerfile
├── migrate-mongo-config.js
├── migrations
├── node_modules
├── package.json
├── package-lock.json
├── README.md
├── src
│ ├── index.js
│ ├── app.js
│ ├── controllers
│ │ ├── adminController.js
│ │ ├── portfolioController.js
│ │ └── transactionController.js
│ ├── middlewares
│ │ ├── getCustomer.js
│ │ └── processTransaction.js
│ ├── models
│ │ ├── Customer.js
│ │ ├── Portfolio.js
│ │ └── Transaction.js
│ ├── repositories
│ │ ├── customerRepository.js
│ │ ├── portfolioRepository.js
│ │ ├── transactionRepository.js
│ │ └── transactionRepository.test.js
│ ├── routes
│ │ └── appRoutes.js
│ └── services
│ ├── portfolioService.js
│ ├── portfolioService.test.js
│ ├── transactionService.js
│ ├── updateCustomerBalance.js
│ └── updatePortfolioBalance.js
└── _tests
  ├── customerMocks.js
  ├── db.js
  └── transactionMocks.js

```

## Desafio Warren

Bem vindo!

Esse exercicio de backend envolve construir uma REST API simples em Node.js/Express.js.

## Modelos de dados

### Customer

Estrutura de usuario padrão da plataforma. Alguns pontos de atenção:

- `balance`: saldo da conta do usuario. Por este atributo que ocorrem as transações financeiras. Saldo da conta nunca pode ser negativo.
- `portfolios`: lista de subdocumentos de `Portfolio`

### Portfolio

Portfólio de investimentos é o conjunto de aplicações do investidor, também chamado de carteira de investimentos. Neste exercicio foi simplificada para uma estrutura mais basica:

- `amount`: quantidade atualmente alocada no portfolio
- `amountGoal`: quantidade total do objetivo alvo do portfolio

### Transaction

`Transaction` é o mapeamento de uma transação financeira da plataforma:

- `type`: tipo da transação:
  - `deposit`: deposito externo para saldo da conta do `customer`
  - `withdraw`: resgate do saldo do usuario para fora da plataforma
  - `account_transfer`: transferencia entre dois `customer` a partir de seus saldos de conta
  - `portfolio_deposit`: movimentação financeira do saldo de um `customer` para o `amount` de um portfolio pertencente
  - `portfolio_transfer`: transferencia entre dois portfolios de um mesmo `customer`
  - `portfolio_withdraw`: retirada de uma certa quantia de um portfolio para o saldo do customer dono do portfolio
- `status`: status atual da transação:
  - `pending`: transação em processamento
  - `accepted`: transação processada e aceita
  - `rejected`: transação processada e recusada
  - `deleted`: transação deletada
- `fromPortfolio`: referencia `Portfolio` para transações com direção saindo de um portfolio. Se não tem relação a portfolio campo não existe no documento.
- `toPortfolio`: referencia `Portfolio` para transações com direção entrando em um portfolio. Se não tem relação a portfolio campo não existe no documento.
- `toCustomer`: referencia `Customer` para transações com direção entrando para um outro customer. Se transação não é `account_transfer` campo não existe no documento.

**Toda transação financeira realizada deve ser registrado um novo documento no banco com as informações devidas**

## Rodando o projeto

A imagem da API do projeto é construida apartir de um Dockerfile. Utilizamos [docker-compose](https://docs.docker.com/compose/gettingstarted/) para inicializar os containers da API e database.

Para rodar a aplicação, inicializar e popular o banco de dados basta rodar `docker-compose up`.

## APIs a implementar

Para especificar qual customer da request é repassado o seu id via header: `customer-id = <string>`

1. **_GET_** `/portfolios/:id` - Essa rota esta quebrada! Dado um id de um portfolio essa rota deve retornar os dados do portfolio.

1. **_GET_** `/portfolios/goalReached` - Retorna uma lista de todos portfolios de um determinado customer em que a quantidade alocada no portfolio é igual ou maior que o objetivo alvo do portfolio.

1. **_GET_** `/transactions/deposits?status=<string>&start=<date>&end=<date>` - Retorna uma lista de transações `deposit` do customer abertas de um determinado `status` entre um determinado período de tempo delimitado por `start` e `end`

1. **_POST_** `/transactions/deposit` - Depositar um valor `amount` na conta do usuario que fez a requisição.

1. **_POST_** `/transactions/account-transfer/:customerId` - Transferência entre customer que fez a chamada em direção a conta de outro customer `<customerId>`

1. **_POST_** `/transactions/portfolio-transfer?fromPortfolio=<string>toPortfolio=<string>` - Transferência entre dois portfolios de um customer.

1. **_GET_** `/admin/topAllocationAmount?page=<integer>&pageSize=<integer>` - Retorna lista de clientes com maior valor alocado juntando todos seus portfolios. Contém paginação[^1].

1. **_GET_** `/admin/topCashChurn?page=<integer>&pageSize=<integer>&start=<date>&end=<date>` - Retorna os clientes que mais retiraram dinheiro da plataforma entre um determinado periodo de tempo delimitado por `start` e `end`. Contém paginação[^1].

[^1]: `pageSize` (_limit_) é o número de itens a serem retornados, `page` (_offset_) é o número da página a ser mostrada a partir do `pageSize` descrito. Exemplo: `pageSize=10` e `page=0` retorna somente os 10 primeiros itens listados, `pageSize=10` e `page=1` retorna dos 11 aos 20 itens listados.

## Pontos de atenção

- Toda novo pacote adicionado deve ter uma breve explicação do motivo a ser usado.
- Você tem total liberdade para mudar a estrutura base dos modelos de dados fornecidos nesse desafio.
- Seria interessante que todas alterações e novas features fossem levadas para a branch principal do projeto utilizando as melhores praticas de seu conhecimento.

## Indo além dos requisitos

Aqui na Warren prezamos pelo nosso lema _Get Shit Done_, ou seja, concluir o esperado e da melhor maneira possível.
Se você ficou com tempo sobrando seria interessante demonstrar seus conhecimentos como um diferencial. Por exemplo, testes unitários ou uma diferente estrutura de projeto.

```

```
