# Explicação do Projeto 1: Dashboard Financeiro

## Ideia do projeto

O projeto simula um painel financeiro parecido com uma área simples de home broker. Ele mostra valor total da carteira, lucro/prejuízo, variação diária, ativos em carteira, gráfico de preço, alocação por ativo, watchlist e envio simulado de ordem.

O objetivo não é prever mercado. O objetivo técnico é mostrar que você entende frontend aplicado a um domínio real.

Os preços não vêm da bolsa de verdade. Eles são simulados localmente para demonstrar como a UI reage quando o mercado muda: cards recalculam, tabela muda, lista de observação atualiza e o gráfico acompanha o preço do dia.

## Como pensar no fluxo

Pense no caminho dos dados assim:

```text
API ou mock -> DTO -> mapper -> domínio -> Redux -> selector -> componente
```

Cada etapa tem uma responsabilidade:

- DTO: representa exatamente o que vem da API, inclusive `snake_case`.
- Mapper: converte e calcula campos úteis para a tela.
- Domínio: é o formato limpo que a aplicação usa internamente.
- Redux: guarda dados compartilhados entre várias partes da tela.
- Selector: pega o estado bruto e entrega o pedaço que o componente precisa.
- Componente: renderiza UI e dispara ações.

## Por que usar DTO e mapper?

Se a API manda `previous_close`, a tela não deveria ficar repetindo conversão para `previousClose` em todo lugar. O mapper centraliza isso.

Exemplo:

```ts
change = price - previous_close
changePercent = change / previous_close * 100
```

Esse cálculo fica no mapper porque ele transforma dado cru em dado pronto para uso.

## Por que Redux aqui?

Redux faz sentido porque os mesmos dados aparecem em vários lugares:

- cards de resumo usam totais da carteira;
- tabela usa posições;
- gráfico usa o ativo selecionado;
- ticket de ordem usa a mesma carteira;
- ordens recentes mudam depois de criar uma ordem.

Sem Redux, você passaria muitos props entre componentes. Com Redux, a tela fica mais organizada.

## O que os thunks fazem?

Thunk é uma action assíncrona. Ela permite escrever:

```ts
dispatch(fetchPortfolio('portfolio-main'))
```

Por dentro, ela chama o service, espera a resposta e atualiza `loading`, `success` ou `error` no slice.

## Por que existe mock API?

Porque o frontend precisa rodar mesmo sem backend. A mock API imita o formato real da API. Isso permite:

- desenvolver a tela antes da API existir;
- testar mappers e Redux;
- demonstrar o projeto em entrevista;
- simular atualização acelerada de preços;
- depois trocar para API real usando `VITE_USE_MOCKS=false`.

## Onde entra HTTP/Axios?

O arquivo `http.client.ts` cria uma instância do Axios com:

- `baseURL`;
- timeout;
- header JSON;
- interceptor de token;
- tratamento padronizado de erro.

Mesmo usando mock por padrão, a camada HTTP real está preparada.

## O que você deve saber explicar

Você pode dizer:

"Eu separei o formato externo da API do formato interno da aplicação. A API pode usar `snake_case`, mas meus componentes trabalham com tipos de domínio em `camelCase`. Os mappers fazem essa conversão e também calculam campos financeiros como PnL, percentual de variação e peso da posição. O Redux guarda os dados compartilhados e os selectors deixam os componentes mais simples."

## Perguntas prováveis em entrevista

**Por que não usar Context API?**

Context resolveria tema ou usuário logado, mas para dados de carteira com loading, erro, thunks e vários consumidores, Redux Toolkit deixa o fluxo mais previsível.

**Por que usar selectors?**

Selectors escondem o formato interno do store. Se o store mudar, eu altero o selector e não todos os componentes.

**Por que não consumir DTO direto no componente?**

Porque acopla a UI ao backend. Se a API mudar `avg_cost` para outro nome, a tela inteira quebra. Com mapper, a mudança fica concentrada.

**Qual seria o próximo passo real?**

Adicionar autenticação, conectar uma API real, cobrir slices/selectors com testes e trocar polling por WebSocket para preços em tempo real.
