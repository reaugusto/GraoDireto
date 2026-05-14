## 1. Concepção do Projeto e Visão Geral

O sistema foi projetado para operar como um CMS (Content Management System) leve e otimizado, focado na publicação e moderação de artigos e comentários.


### Objetivos Principais:
- **Performance Extrema**: Renderização ágil e consumo inteligente de recursos no front-end e no back-end.
- **Transações Seguras**: Integridade referencial completa na persistência de posts, tabelas pivô de tags e moderação de comentários.
- **Experiência do Usuário (UX)**: Fluidez em buscas em tempo real, filtragem por categorias e paginação reativa sem gargalos de processamento.

---

## 2. Decisões Técnicas e Stack Tecnológica

A escolha das ferramentas priorizou o controle absoluto sobre o ciclo de renderização e a eliminação de sobrecargas de pacotes desnecessários (*bloatware*).

### 2.1. Back-end: Node.js & Express
Foi utilizado o Express para implementação do backend pela sua alta resposta implementação toda baseada em Javascript, mantido um estilo limpo e voltado a eventos.


### 2.2. Banco de Dados: MySQL (Abordagem Relacional)
Definido a estrutra de banco de dados relacional conforme a indicação, apresenta uma possiblidade e estrutura baseada em DER e a possibilidade de escalada mais efetiva.

### 2.3. Front-end: Vue 3 (Script Setup / Composition API)
Defini Vue 3 como framework para o front end com utilização de estruturas novas, pois tenho maior dominância em desenvolvimento puro e o Vue JS segue mais próximo desse estilo aliado a um framework robusto.
Utilzando o modelo <script setup> que permite um desenvolvimento mais limpo e performático com o uso de propriedade computadas que permite a fatiar e filtra dados de forma leve com pouco uso de recurso computacional

---

## 3. Arquitetura do Banco de Dados & Estrutura de Queries

A modelagem de dados foi estruturada de forma a mitigar problemas clássicos de performance, como o problema de consulta $N+1$.

### 3.1. Relacionamento Muitos-para-Muitos
Foi utilizado tabelas pivôs para relacionamento e melhoria de organização, mantendo a estrutura de objetos isoladas que podem ser reutilizado de forma simples.

- **Otimização com `GROUP_CONCAT`**: Nas rotas de listagem geral, busca textual e filtragem por ID da tag, é utilizada a função agregadora `GROUP_CONCAT` do MySQL. Isso condensa todas as tags vinculadas a um post em uma única string delimitada, retornando todo o payload do artigo completo em uma única consulta ao banco.

### 3.2. Transações Atômicas no Cadastro de Artigos
Para evitar inconsistências (como um artigo ser salvo sem suas respectivas tags ou gerar falhas parciais), a rota `POST /artigos/criar` implementa transações explícitas (`connection.beginTransaction()`). Se o insert do post, a verificação/inserção das tags com `INSERT IGNORE`, ou a escrita na tabela pivô falharem, o sistema executa um `connection.rollback()`, assegurando a pureza do estado do banco de dados.

---

## 4. Organização do Código e Lógica de Implementação

### 4.1. Estrutura do Back-end
O servidor organiza suas conexões utilizando um Pool de Conexões (`pool.getConnection()`). Isso evita a abertura e fechamento constante de sockets TCP, reaproveitando conexões ativas para responder imediatamente às requisições de login, deleção de comentários e consultas de busca.

### 4.2. Geração de Slugs Dinâmicos
URLs amigáveis são fundamentais para indexação (SEO). O sistema adota uma função puramente em JavaScript baseada em expressões regulares e no método de normalização Unicode (`.normalize('NFD')`). Ela decompõe caracteres acentuados da língua portuguesa (como "Agronegócio") eliminando diacríticos de forma nativa e performática.

### 4.3. Paginação Reativa e Fatiamento de Memória (Front-end)
Em vez de sobrecarregar o banco com requisições repetitivas de `LIMIT` e `OFFSET` em interações simples do usuário, a listagem adota paginação acoplada ao estado reativo.
O `v-for` no template renderiza uma propriedade computada (`artigosPaginados`), que fatia o array principal em tempo de execução usando o método super otimizado `.slice()` do JavaScript.

O componente `<paginate>` (baseado em `vuejs-paginate-next`) atua de forma isolada do loop, alterando unicamente o índice numérico da página atual (`paginaAtual.value`), o que previne re-renderizações desnecessárias e preserva a fluidez visual do sistema.

---

## 5. Justificativas e Boas Práticas Adotadas

1. **Imutabilidade em Operações de Array**: A remoção e manipulação de itens de interface (como tags selecionadas) utilizam prioritariamente o método `.filter()`, gerando novos estados sem mutar diretamente arrays reativos originais, evitando efeitos colaterais na reatividade do Vue.
2. **Prevenção de Event Bubbling**: No front-end, o uso de modificadores de evento do Vue como `@click.stop` nas tags e nos ícones de ação do autor garante que eventos internos não disparem involuntariamente ações de redirecionamento contidas nos elementos pai (como os cards dos artigos).
3. **Gestão Segura de Sessão e Moderação**: O sistema armazena informações essenciais do usuário no `localStorage` após validação estrita na query de Login (`SELECT id, name, password_hash, role...`). A interface utiliza esses estados para renderizar de maneira condicional (`v-if`) os botões de edição e exclusão de comentários apenas se o usuário ativo for de fato o proprietário do conteúdo.


# grao-blog

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup (Back-End)

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

```sh
npm run watch
```


## Project Setup (Front-End)

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
