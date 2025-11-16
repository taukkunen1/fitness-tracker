# 🚶‍♂️ Pilgrim

Sistema completo e seguro de acompanhamento de treino e nutrição baseado em evidências científicas, com autenticação, painel administrativo e recursos avançados de monitoramento.

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](docs/releases/VERSION.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Security](https://img.shields.io/badge/security-enterprise-brightgreen.svg)](SECURITY.md)

## 🌐 Demo

**Acesse:** [https://taukkunen1.github.io/fitness-tracker/](https://taukkunen1.github.io/fitness-tracker/)

**Login Rápido (Desenvolvimento):**
- Username: `Pedro`
- Password: `123456`
- Role: Admin

> ⚠️ **Nota**: Auto-login está ativado por padrão para facilitar o desenvolvimento. Em produção, desabilite o auto-login editando `index.html`.

## ✨ Funcionalidades Principais

### 🔐 Autenticação e Segurança (v2.0)
- **Login/Registro Seguros**: Sistema completo com criptografia PBKDF2 (100k iterações)
- **Proteção Enterprise**: Brute force protection, rate limiting, XSS/CSRF protection
- **Gerenciamento de Sessões**: Tokens seguros, timeout configurável (24h)
- **Auditoria Completa**: Logs de todos os eventos de segurança
- **Roles e Permissões**: Sistema de admin com controle de acesso
- **🆕 AI-Powered Security**: Detecção inteligente de ameaças baseada em pesquisas 2025
- **🆕 Adaptive Defense**: Rate limiting dinâmico que se adapta a ameaças
- **🆕 Zero Trust**: Validação contínua de sessões e controle context-aware
- **🆕 Privacy-First**: Analytics 100% local sem transmissão de dados
- **🆕 Security Posture**: Framework DCCI para avaliação holística de segurança

### 👔 Painel Administrativo (v2.0)
- **Dashboard Admin**: Visão geral de tarefas, usuários e sistema
- **Gestão de Tarefas**: Roadmap organizado (curto, médio, longo prazo)
- **Task Management**: Checklist, prioridades, estados, progresso visual
- **Gestão de Contas**: Promoção de usuários, visualização de atividades
- **Export e Backup**: Markdown, JSON, relatórios customizados

### 📊 Monitoramento de Acessos (v2.0)
- **Tracking Automático**: Registro de todos os acessos à página
- **Analytics Detalhado**: Estatísticas por hora, dia, semana, mês
- **Visualizações**: Gráficos de acesso, visitantes únicos, breakdown temporal
- **Auto-refresh**: Atualização automática a cada 5 minutos
- **Export de Logs**: Análise externa de dados de acesso

### 💡 Sugestões e Feedback (v2.0)
- **Sistema de Sugestões**: Usuários podem enviar ideias e melhorias
- **Votação Comunitária**: Sistema de upvotes para priorização
- **Gestão Admin**: Aprovação, rejeição, implementação com notas
- **Export GitHub**: Formato compatível com GitHub Issues

### 🍽️ Nutrição e Refeições
- **Registro Diário**: Múltiplas refeições por dia com navegação dia-a-dia
- **Cálculo de Macros**: Automático de proteína, carboidrato, gordura, calorias
- **Refeições Compostas**: Criar refeições com múltiplos alimentos
- **Histórico Completo**: Visualização e análise de todas as refeições
- **Validação Robusta**: Campos obrigatórios e validação numérica

### 📸 Fotos de Progresso
- **Upload de Fotos**: Interface moderna com preview
- **Comparação Visual**: Lado a lado de duas fotos diferentes
- **Galeria**: Organização por data com notas
- **Armazenamento Local**: Todas as fotos em IndexedDB

### 🏋️ Treinos e Templates
- **Templates Científicos**: Full-body, Push/Pull/Legs, Upper/Lower/Full
- **Detalhamento Completo**: Exercícios, séries, reps, tempo de descanso
- **Base Científica**: Programas baseados em estudos e evidências
- **Logs de Treino**: Registro completo de cada sessão
- **Progressão**: Acompanhamento de carga e volume ao longo do tempo

### 📈 Métricas e Gráficos
- **Dashboard Interativo**: Visualização de peso, gordura, massa muscular
- **Gráficos de Evolução**: Timeline completo com Chart.js
- **Comparação de Usuários**: Métricas lado a lado de 2 perfis
- **Export de Dados**: CSV com todos os registros históricos
- **Estatísticas**: Médias, tendências, projeções

## 🛠️ Tecnologias

### Frontend
- **JavaScript Vanilla** - Sem frameworks, máxima performance
- **Chart.js 4.4.0** - Gráficos interativos e responsivos
- **Tailwind CSS (CDN)** - Estilização moderna e utility-first

### Armazenamento
- **IndexedDB v6** - Banco de dados principal (9 stores)
- **LocalStorage** - Fallback e cache rápido
- **Web Crypto API** - Criptografia nativa do browser

### Segurança
- **PBKDF2** - Hash de senhas (100.000 iterações)
- **CSRF Tokens** - Proteção contra ataques CSRF
- **XSS Sanitization** - Sanitização completa de inputs
- **Rate Limiting** - Proteção contra brute force

### Compatibilidade
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Quick Start

### 1. Clone o Repositório

```bash
git clone https://github.com/taukkunen1/fitness-tracker.git
cd fitness-tracker
```

### 2. Abra no Navegador

Simplesmente abra o arquivo `index.html` no seu navegador:

```bash
# Linux/Mac
open index.html

# Windows
start index.html
```

Ou use um servidor local:

```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server -p 8000

# PHP
php -S localhost:8000
```

### 3. Primeiro Acesso

O sistema fará auto-login como **Pedro (Admin)** para facilitar o desenvolvimento.

Para criar uma nova conta:
1. Faça logout (botão no canto superior direito)
2. Clique em "Registrar"
3. Preencha o formulário
4. A primeira conta criada será automaticamente admin

## 📚 Documentação Completa

### Documentação Principal
- **[CHANGELOG.md](CHANGELOG.md)** - Histórico completo de mudanças
- **[VERSION.md](VERSION.md)** - Controle de versionamento semântico
- **[RELEASES.md](RELEASES.md)** - Releases detalhadas com nomes específicos
- **[SECURITY.md](SECURITY.md)** - Políticas e práticas de segurança

### Documentação Técnica
Acesse a pasta [`docs/`](docs/) para:
- **[Admin](docs/admin/)** - Guias administrativos
- **[Analysis](docs/analysis/)** - Análises e métricas
- **[Deployment](docs/deployment/)** - Deploy e configuração
- **[Design](docs/design/)** - Design e UI/UX
- **[Implementation](docs/implementation/)** - Implementação técnica
- **[Performance](docs/performance/)** - Otimização e performance
- **[User](docs/user/)** - Guias do usuário

### Gestão de Projeto
- **[GERENCIAMENTO-BRANCHES.md](docs/GERENCIAMENTO-BRANCHES.md)** - Guia de branches e Git workflow

## 🔐 Segurança e Privacidade

### Armazenamento Local
- ✅ **100% Local**: Todos os dados ficam no seu navegador
- ✅ **Zero Tracking**: Nenhuma informação é enviada para servidores externos
- ✅ **Privacidade Total**: Você tem controle completo dos seus dados

### Segurança Enterprise (v2.0)
- 🔐 **Criptografia PBKDF2** com 100.000 iterações
- 🛡️ **Proteção contra Brute Force** (bloqueio após 5 tentativas)
- ⚡ **Rate Limiting** (máximo 10 req/min)
- 🔒 **XSS/CSRF Protection** em todas as operações
- 📊 **Auditoria Completa** de eventos de segurança

### 🆕 Segurança Avançada Baseada em Pesquisas 2025
O sistema implementa conceitos de pesquisas científicas de ponta:

- 🤖 **AI-Powered Threat Detection**: Detecção inteligente baseada em padrões (LLM concepts)
- 🔄 **Adaptive Security**: Limites dinâmicos que se ajustam a ameaças em tempo real
- 🔐 **Zero Trust Architecture**: Validação contínua e controle context-aware
- 🛡️ **Privacy-Preserving Analytics**: 100% local, zero transmissão externa
- 📊 **DCCI Framework**: Avaliação holística de postura de segurança

**Documentação Completa**: Ver [docs/security/](docs/security/) para detalhes técnicos e implementações
- ⚡ **Rate Limiting** (máximo 10 req/min)
- 🔒 **XSS/CSRF Protection** em todas as operações
- 📊 **Auditoria Completa** de eventos de segurança

### Backup e Restore
⚠️ **Importante**: Limpar dados do navegador apaga o histórico!

**Recomendações:**
1. Faça backups regulares via menu Admin > Export
2. Salve os arquivos JSON em local seguro
3. Use a função Import para restaurar dados

## 🎯 Roadmap

### ✅ v2.0.0 - "Segurança e Administração" (Atual)
- Sistema de autenticação completo
- Painel administrativo
- Monitoramento de acessos
- Sistema de sugestões

### 🚧 v2.1.0 - "Experiência do Usuário" (Dezembro 2025)
- [ ] Sistema de notificações push
- [ ] Temas dark/light mode
- [ ] PWA completo (offline-first)
- [ ] Export/Import avançado

### 🔮 v2.2.0 - "Recursos Avançados" (Janeiro 2026)
- [ ] Integração com wearables
- [ ] IA para sugestões personalizadas
- [ ] Comunidade e social features
- [ ] Gamificação e desafios

### 🌟 v3.0.0 - "Backend e Nuvem" (Março 2026)
- [ ] Backend opcional (Node.js)
- [ ] API REST completa
- [ ] Sincronização em nuvem
- [ ] Apps mobile nativos

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, leia as diretrizes antes de contribuir.

### Como Contribuir

1. **Fork** o repositório
2. **Clone** seu fork: `git clone https://github.com/seu-usuario/fitness-tracker.git`
3. **Crie uma branch**: `git checkout -b feature/minha-feature`
4. **Commit** suas mudanças: `git commit -m 'feat: adicionar nova feature'`
5. **Push** para a branch: `git push origin feature/minha-feature`
6. Abra um **Pull Request**

### Convenção de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação, estilos
- `refactor:` - Refatoração
- `perf:` - Performance
- `test:` - Testes
- `chore:` - Tarefas de manutenção
- `security:` - Segurança

### Reportar Bugs

Use o [GitHub Issues](https://github.com/taukkunen1/fitness-tracker/issues) com:
- Descrição clara do problema
- Steps to reproduce
- Screenshots (se aplicável)
- Browser e versão

## 📚 Documentação

### Estrutura de Documentação

- **[Documentação Principal](docs/README.md)** - Índice completo da documentação
- **[Information Architecture Guide](docs/INFORMATION-ARCHITECTURE.md)** - Guia de organização do projeto
- **[Changelog](CHANGELOG.md)** - Histórico de mudanças (Keep a Changelog)
- **[Security Policy](SECURITY.md)** - Política de segurança

### Documentação por Público

- **[Guias do Usuário](docs/user/)** - Como usar o sistema
- **[Guias do Admin](docs/admin/)** - Administração e monitoramento
- **[Guias do Desenvolvedor](docs/developer/)** - Setup, arquitetura, contribuição
- **[Guias de Deploy](docs/deployment/)** - Como fazer deploy

### Recursos Adicionais

- **[Features](docs/FEATURES.md)** - Lista completa de funcionalidades
- **[Known Issues](docs/KNOWN-ISSUES.md)** - Problemas conhecidos
- **[Releases](docs/releases/)** - Notas de versão
- **[Reports](docs/reports/)** - Relatórios de implementação

## 📊 Status do Projeto

- **Status**: 🟢 Ativo
- **Versão**: 2.0.0
- **Última atualização**: 16 de Novembro de 2025
- **Manutenção**: Ativa
- **Issues abertas**: Veja [Issues](https://github.com/taukkunen1/fitness-tracker/issues)

## 📞 Suporte

### Canais de Suporte
- **Issues**: [GitHub Issues](https://github.com/taukkunen1/fitness-tracker/issues)
- **Discussões**: [GitHub Discussions](https://github.com/taukkunen1/fitness-tracker/discussions)
- **Email**: taukkunen1@github.com

### FAQ

**P: Meus dados estão seguros?**
R: Sim! Todos os dados ficam armazenados localmente no seu navegador. Nenhuma informação é enviada para servidores externos.

**P: Como faço backup?**
R: Menu Admin > Export > Selecione o formato (JSON recomendado) e salve o arquivo.

**P: Funciona offline?**
R: Sim! Após o primeiro carregamento, o sistema funciona completamente offline (v2.1 terá PWA completo).

**P: É grátis?**
R: Sim! O projeto é open-source e totalmente gratuito.

## 📄 Licença

Este projeto está sob a licença especificada no arquivo [LICENSE](LICENSE).

## 🙏 Agradecimentos

- **Comunidade GitHub** - Pela inspiração e suporte
- **GitHub Copilot** - Pela assistência no desenvolvimento
- **Usuários e Testers** - Pelo feedback valioso
- **Contributors** - Por todas as contribuições

## ⚠️ Disclaimer

**Este sistema é para fins educacionais e de acompanhamento pessoal.**

Sempre consulte profissionais de saúde qualificados antes de:
- Iniciar novos programas de exercícios
- Fazer mudanças significativas na dieta
- Tomar decisões relacionadas à saúde

O sistema fornece informações baseadas em evidências científicas, mas não substitui orientação profissional médica ou de nutricionistas.

---

**Desenvolvido com ❤️ por [taukkunen1](https://github.com/taukkunen1)**

[![GitHub stars](https://img.shields.io/github/stars/taukkunen1/fitness-tracker?style=social)](https://github.com/taukkunen1/fitness-tracker/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/taukkunen1/fitness-tracker?style=social)](https://github.com/taukkunen1/fitness-tracker/network/members)
[![GitHub watchers](https://img.shields.io/github/watchers/taukkunen1/fitness-tracker?style=social)](https://github.com/taukkunen1/fitness-tracker/watchers)
