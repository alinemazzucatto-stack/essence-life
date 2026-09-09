# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Essence Life como aplicativo (PWA)

A vers�o de produ��o possui manifesto e service worker: ap�s abrir o site uma vez com internet, os arquivos do app podem ser reutilizados offline e os dados locais continuam dispon�veis no navegador.

Para instalar:

- **Edge/Chrome no computador:** abra o menu do navegador e escolha **Instalar Essence Life** ou use o �cone de instala��o na barra de endere�o.
- **Android:** abra no Chrome e escolha **Instalar app**.
- **iPhone/iPad:** abra no Safari, use **Compartilhar** e depois **Adicionar � Tela de In�cio**.

O service worker � registrado somente na vers�o de produ��o para n�o interferir no desenvolvimento local. Notifica��es com a tela bloqueada dependem das permiss�es e das limita��es de cada sistema.
## Aplicativo móvel nativo

O projeto também está preparado com **Capacitor** para Android e iOS, reaproveitando a mesma interface React.

- Projeto Android: `android/`
- Projeto iOS: `ios/`
- Identificador do app: `com.essencelife.app`

### Atualizar os aplicativos após alterações

```bash
npm run mobile:sync
```

### Abrir no Android Studio

```bash
npm run mobile:android
```

A partir do Android Studio, conecte um celular Android ou abra um emulador e use **Run** para testar; para gerar um APK, use o menu **Build**. O projeto iOS precisa ser aberto e compilado em um Mac com Xcode.

Os dados continuam locais nesta fase. Banco de dados e sincronização entre celulares serão a próxima etapa.