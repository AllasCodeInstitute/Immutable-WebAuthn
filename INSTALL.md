# Como instalar clonando o repositório

Este guia mostra como preparar o projeto localmente a partir de um clone do repositório.

## Pré-requisitos

- **Git** instalado.
- **Bun 1.2+** instalado. Consulte a documentação oficial em <https://bun.sh/docs/installation> caso ainda não tenha o Bun.

Para conferir as versões instaladas:

```sh
git --version
bun --version
```

## 1. Clone o repositório

```sh
git clone <URL_DO_REPOSITORIO>
cd Immutable-WebAuthn
```

Substitua `<URL_DO_REPOSITORIO>` pela URL HTTPS ou SSH do repositório, por exemplo:

```sh
git clone https://github.com/<org-ou-usuario>/Immutable-WebAuthn.git
```

## 2. Instale as dependências

Na raiz do repositório, execute:

```sh
bun install
```

Esse comando instala as dependências dos workspaces definidos no monorepo e usa o `bun.lock` para manter versões reproduzíveis.

## 3. Rode os testes

Para executar a suíte de testes configurada para o monorepo:

```sh
bun test
```

Também é possível testar pacotes específicos:

```sh
bun run test:browser
bun run test:server
```

## 4. Gere os tipos compartilhados

Quando houver alterações no pacote de tipos, regenere as cópias consumidas pelos pacotes `browser` e `server`:

```sh
bun run codegen:types
```

## 5. Gere os builds dos pacotes

Para construir os pacotes individualmente:

```sh
bun run build:browser
bun run build:server
```

Os artefatos de publicação são gerados dentro das pastas `packages/browser/npm` e `packages/server/npm`.

## Comandos úteis

| Comando | Descrição |
| --- | --- |
| `bun install` | Instala dependências do monorepo. |
| `bun test` | Executa os testes do browser e do server. |
| `bun run test:browser` | Executa apenas os testes do pacote browser. |
| `bun run test:server` | Executa apenas os testes do pacote server. |
| `bun run codegen:types` | Copia os tipos compartilhados para os pacotes. |
| `bun run build:browser` | Gera o build do pacote browser. |
| `bun run build:server` | Gera o build do pacote server. |
| `bun run version` | Mostra quais pacotes mudaram desde a última tag de versão. |

## Solução de problemas

- Se `bun` não for encontrado, instale o Bun e abra um novo terminal para atualizar o `PATH`.
- Se a instalação falhar por cache corrompido, tente `bun pm cache rm` e rode `bun install` novamente.
- Se você alternar entre branches com mudanças no lockfile, rode `bun install` novamente na raiz do repositório.
