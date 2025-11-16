# 👨‍💻 Developer Documentation

Documentação técnica para desenvolvedores que desejam contribuir ou entender o Pilgrim Fitness Tracker.

## 📋 Conteúdo

Esta pasta conterá guias para desenvolvedores:

- **Setup e Configuração** - Como configurar o ambiente de desenvolvimento
- **Arquitetura** - Estrutura e padrões do código
- **Guia de Contribuição** - Como contribuir com o projeto
- **API Reference** - Documentação de funções e componentes
- **Debugging** - Dicas e ferramentas de debug

## 🚀 Quick Start

### Requisitos

- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Editor de código (VS Code recomendado)
- Git

### Setup Local

```bash
# Clone o repositório
git clone https://github.com/taukkunen1/fitness-tracker.git

# Entre na pasta
cd fitness-tracker

# Abra com seu editor
code .

# Inicie um servidor local (qualquer um serve)
python3 -m http.server 8080
# ou
npx serve
# ou
php -S localhost:8080
```

Acesse: `http://localhost:8080`

## 🏗️ Arquitetura

### Estrutura do Projeto

```
fitness-tracker/
├── index.html          # SPA - Single Page Application
├── docs/              # Documentação
├── scripts/           # Scripts de automação
└── .github/           # Configurações do GitHub
```

### Stack Tecnológica

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: Tailwind CSS (CDN)
- **Charts**: Chart.js
- **Storage**: IndexedDB + localStorage fallback
- **Security**: Web Crypto API (PBKDF2)

### Padrões de Código

- **State Management**: Estado global via objeto `state`
- **Rendering**: Função `render()` centralizada
- **Components**: Funções `render*()` para cada componente
- **Data Layer**: IndexedDB com fallback para localStorage

## 🔐 Segurança

### Práticas Implementadas

- PBKDF2 com 100.000 iterações
- CSRF tokens
- Rate limiting
- XSS protection (sanitização de inputs)
- Brute force protection

### Como Testar Segurança

```javascript
// No console do navegador

// 1. Testar rate limiting
for(let i = 0; i < 20; i++) {
  attemptLogin('test', 'wrong');
}

// 2. Verificar session timeout
console.log(authState.sessionExpiry);

// 3. Checar security posture
console.log(calculateSecurityPosture());
```

## 📊 Banco de Dados

### IndexedDB Stores

- `users` - Dados dos usuários (treinos, métricas, etc)
- `accounts` - Contas de autenticação
- `tasks` - Tarefas administrativas
- `suggestions` - Sugestões da comunidade
- `access_logs` - Logs de acesso
- `settings` - Configurações do sistema

### Como Inspecionar

1. DevTools > Application > IndexedDB
2. Ou use: `await inspectDatabase()`

## 🧪 Testing

### Manual Testing

- Teste em múltiplos navegadores
- Teste responsividade (mobile, tablet, desktop)
- Teste offline (após primeiro carregamento)
- Teste com dados vazios e com dados populados

### Checklist de Testes

- [ ] Login/Logout funciona
- [ ] Registro de novos usuários
- [ ] Proteção contra brute force
- [ ] Salvamento de dados
- [ ] Export/Import de dados
- [ ] Todas as tabs carregam
- [ ] Gráficos renderizam
- [ ] Responsividade mobile

## 🛠️ Debugging

### Console Logs

O sistema usa logs categorizados:

```javascript
console.log('[AUTH]', 'Login attempt', username);
console.log('[DB]', 'Saving data', data);
console.log('[SECURITY]', 'Rate limit triggered');
```

### Ferramentas Úteis

```javascript
// Ver estado completo
console.log(state);

// Ver autenticação
console.log(authState);

// Limpar dados
clearAllData();

// Resetar aplicação
location.reload();
```

## 📝 Guia de Estilo

### JavaScript

```javascript
// ✅ Bom
function getUserData(userId) {
  const user = state.users[userId];
  if (!user) return null;
  return user;
}

// ❌ Evite
function getData(id) {
  return state.users[id] || null;
}
```

### HTML Templates

```javascript
// ✅ Use template literals
return `
  <div class="container">
    <h1>${title}</h1>
  </div>
`;

// ❌ Evite concatenação
return '<div class="container">' + 
       '<h1>' + title + '</h1>' +
       '</div>';
```

## 🤝 Como Contribuir

Veja o guia completo em: [CONTRIBUTING.md](../../README.md#-como-contribuir)

### Fluxo de Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/minha-feature`)
3. Commit suas mudanças (`git commit -m 'feat: minha feature'`)
4. Push para a branch (`git push origin feature/minha-feature`)
5. Abra um Pull Request

## 📚 Recursos Adicionais

- [Information Architecture Guide](../INFORMATION-ARCHITECTURE.md)
- [Changelog](../../CHANGELOG.md)
- [Security Policy](../../SECURITY.md)
- [Admin Guide](../admin/ADMIN-GUIDE.md)

## 💬 Suporte

- **Issues**: [GitHub Issues](https://github.com/taukkunen1/fitness-tracker/issues)
- **Discussions**: [GitHub Discussions](https://github.com/taukkunen1/fitness-tracker/discussions)

---

**Última atualização:** 16 de Novembro de 2025
