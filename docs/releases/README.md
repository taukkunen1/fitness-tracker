# 📦 Releases

Esta pasta contém informações sobre versões e releases do Pilgrim Fitness Tracker.

## 📋 Conteúdo

- **[VERSION.md](VERSION.md)** - Informações detalhadas sobre a versão atual
- **[RELEASES.md](RELEASES.md)** - Notas de release organizadas
- **[../CHANGELOG.md](../../CHANGELOG.md)** - Changelog completo do projeto (raiz)

## 🔢 Versionamento

O projeto segue [Semantic Versioning](https://semver.org/lang/pt-BR/):

```
MAJOR.MINOR.PATCH

2.0.0
│ │ └─ Correções de bugs
│ └─── Novas funcionalidades (retrocompatíveis)
└───── Mudanças incompatíveis
```

## 📝 Versões

### Versão Atual: 2.0.0

**Data de Release:** 15 de Novembro de 2025

**Principais Mudanças:**
- Sistema de autenticação completo
- Painel administrativo
- Monitoramento de acessos
- Sistema de sugestões
- Melhorias de segurança

**Veja:** [CHANGELOG.md](../../CHANGELOG.md) para detalhes completos

### Versões Anteriores

- **[1.0.0](../../CHANGELOG.md#100---2025-11-01)** - Lançamento inicial (01/11/2025)

## 🚀 Próximas Versões

### v2.1.0 (Planejado: Dezembro 2025)
- Sistema de notificações push
- Export/Import em múltiplos formatos
- Temas personalizáveis (dark/light)
- PWA com suporte offline

### v3.0.0 (Planejado: Março 2026)
- Backend com Node.js + PostgreSQL
- API REST completa
- Sincronização em nuvem
- Apps mobile (React Native)

## 📖 Como Criar uma Nova Release

1. Atualize o [CHANGELOG.md](../../CHANGELOG.md)
2. Atualize [VERSION.md](VERSION.md)
3. Crie uma tag no Git:
   ```bash
   git tag -a v2.0.0 -m "Release 2.0.0"
   git push origin v2.0.0
   ```
4. Crie a release no GitHub
5. Atualize o README principal

---

**Última atualização:** 16 de Novembro de 2025
