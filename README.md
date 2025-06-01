# Tech Cars

Um sistema web para gerenciamento de veículos, permitindo login de usuários, listagem, criação, edição e exclusão de carros."

---

## Como Rodar o Projeto Localmente?

Siga estas instruções para configurar e executar o projeto em sua máquina local.

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

* **Node.js**
* **npm** ou **Yarn**
* **Git**

### Instalação e Execução

1.  **Clone o repositório:**
    Abra seu terminal ou prompt de comando e execute:
    ```bash
    git clone [https://github.com/Gu-Fernandes/Cars-Tech.git](https://github.com/Gu-Fernandes/Cars-Tech.git)
    cd Cars-Tech # Ou cd para a pasta raiz do seu projeto se já clonou
    ```

2.  **Instale as dependências:**
    Navegue até o diretório do projeto clonado e instale as dependências:
    ```bash
    npm install
    # OU
    yarn install
    ```

3.  **API:**
   Você pode acessar a API disponibilizada pela equipe do back-end na seguinte URL:https://cars-api-y4ym.onrender.com/api/docs#/Cars/apps_cars_api_create_car
    Considere para logar:
    Usuário: gu03fernandes.s@gmail.com
    Senha: 123


5.  **Inicie o servidor de desenvolvimento:**
    Após a instalação das dependências, você pode iniciar a aplicação:
    ```bash
    npm run dev
    # OU
    yarn dev
    ```

    O aplicativo estará disponível em `http://localhost:3000`.

---


### Principais Tecnologias

* **Next.js**: Framework React para construção de aplicações web.
    * **Decisão**: Escolhido por sua capacidade de otimização de performance, roteamento baseado em arquivos e API Routes. 
* **React**: Biblioteca JavaScript para construção de interfaces de usuário.
    * **Decisão**: Utilizado para criar uma interface de usuário facilitando a organização do código, a reutilização de componentes e a manutenção.
* **Tailwind CSS**: Framework CSS utility-first.
    * **Decisão**: Permite estilizar componentes diretamente no JSX com classes utilitárias, evitando a necessidade de escrever CSS do zero.
* **TypeScript**: 
    * **Decisão**: A tipagem ajuda a identificar erros em tempo de desenvolvimento, melhora a refatoração e oferece um autocompletar mais eficiente em editores de código.
* **Hooks do React (useState, useEffect, useRouter)**:
    * **`useState`**: Para gerenciar o **estado local** dos componentes (e-mail, senha, lista de carros, estados de carregamento e erro, filtros, etc.).
    * **`useEffect`**: Utilizado para realizar **efeitos colaterais** (como buscar dados da API após o carregamento do componente ou quando um estado específico muda).
    * **`useRouter`**: Hook do Next.js para **navegação programática** entre as rotas da aplicação (ex: redirecionar para o dashboard após o login).

### Arquitetura da Aplicação

* **Client Components (`"use client"`)**: Utilizado para páginas e componentes que requerem **interatividade no navegador**, como a página de login e o dashboard com manipulação de formulários e estados dinâmicos.
* **Gerenciamento de Estado**: O estado da aplicação é gerenciado principalmente através de **`useState` hooks** diretamente nos componentes que precisam deles, mantendo a simplicidade para estados locais. 
    * **Decisão**: Após o login, o `access_token` é armazenado no `localStorage`. Este token é enviado em requisições subsequentes para endpoints protegidos da API, garantindo que apenas usuários autenticados possam acessar dados e funcionalidades restritas. O `email` do usuário também é armazenado.

---
