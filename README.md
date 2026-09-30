# Essence Life

Aplicativo de organização pessoal e bem-estar com agenda, rotina, lembretes, hidratação, sono, nutrição, treinos, finanças e outros módulos integrados.

## Base estável

- Versão do produto: `1.0.0`
- Web: React + TypeScript + Vite
- Aplicativos: Capacitor para Android e iOS
- Publicação web: Sites
- Dados e autenticação: Supabase e armazenamento local, conforme o recurso

## Comandos de validação

```bash
npm run build
npm run test:smoke
npm run lint
```

## Aplicativo móvel

```bash
npm run mobile:sync
npm run mobile:android
```

O aplicativo nativo abre diretamente a experiência autenticada do Essence Life. O quiz e a página comercial pertencem exclusivamente ao site público.

## Regras de manutenção

- Alterar uma funcionalidade por ciclo.
- Validar web, celular e tablet antes de publicar.
- Não guardar APKs, pacotes de publicação ou cópias integrais do projeto junto ao código ativo.
- Registrar mudanças de banco por migrações.
- Preservar o último APK estável fora da pasta do código.

Consulte `docs/FASE-1-BASE-ESTAVEL.md` para o diagnóstico e o plano de consolidação.