# Fase 1 — Base Estável 1.0

Data do marco: 26 de agosto de 2026.

## Estado validado

- A aplicação compila para produção.
- As rotas principais passam no teste de fumaça.
- A análise estática não encontrou erros bloqueadores.
- O aplicativo Android e a publicação web compartilham a mesma interface React.
- O aplicativo nativo é separado do quiz e da página de vendas pela rota nativa.

## Diagnóstico do projeto

O histórico de publicações não representa camadas acumuladas no código ativo. O principal acúmulo encontrado está na pasta de trabalho:

- dezenas de arquivos compactados usados em publicações anteriores;
- três APKs na raiz;
- uma cópia quase integral em `refactor-finance-work`;
- snapshots antigos de `App.tsx`;
- pastas temporárias de publicações anteriores.

Esses itens não são necessários para executar a versão atual. Eles foram adicionados ao `.gitignore`, mas não foram excluídos nesta etapa para evitar perda acidental.

## Riscos técnicos identificados

1. `src/App.css` concentra grande parte do estilo do produto e deve ser separado gradualmente por módulo, sem reescrita total.
2. Alguns módulos ainda possuem componentes extensos e compactados, dificultando revisão e testes.
3. A análise estática encontra avisos em Perfil, Configurações e Workers. Eles não bloqueiam a compilação, mas devem ser resolvidos antes das novas funções inteligentes.
4. A pasta de cópia `refactor-finance-work` também é analisada pelas ferramentas e produz avisos que não pertencem ao código ativo.
5. O projeto ainda precisa ampliar os testes além da verificação básica de rotas.

## Estratégia de refatoração segura

1. Preservar o comportamento atual e criar testes de caracterização para fluxos críticos.
2. Consolidar tokens visuais compartilhados: cores, botões, cards, campos e tipografia.
3. Separar estilos por módulo em pequenos lotes.
4. Remover duplicações somente depois de confirmar equivalência visual e funcional.
5. Isolar serviços transversais: notificações, armazenamento, autenticação, planos e IA.
6. Validar cada lote em navegador, celular e tablet antes de integrá-lo.

## Fluxos críticos que não podem regredir

- entrada nativa sem quiz de vendas;
- login e restauração de sessão;
- liberação correta dos planos;
- conclusão e desmarcação de tarefas e hábitos;
- registro acumulativo de água;
- notificações locais com o aplicativo fechado;
- campos de digitação em celular e tablet;
- criação, edição e exibição de agenda e rotina;
- geração de APK com conteúdo atualizado.

## Próximo lote da Fase 1

- retirar do alcance das ferramentas as cópias e snapshots antigos;
- corrigir avisos reais do código ativo;
- criar testes dos fluxos críticos acima;
- iniciar a biblioteca visual compartilhada sem modificar a aparência aprovada.