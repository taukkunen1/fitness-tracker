# URL Routing Guide - Pilgrim Fitness Tracker

**Versão:** 2.1.0  
**Última atualização:** 2025-11-16  
**Autor:** @taukkunen1

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura de URLs](#estrutura-de-urls)
3. [Como Funciona](#como-funciona)
4. [Proteção de Rotas](#proteção-de-rotas)
5. [Navegação](#navegação)
6. [Exemplos de Uso](#exemplos-de-uso)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

A partir da versão 2.1.0, o Pilgrim Fitness Tracker implementa **hash-based routing** para criar uma estrutura de URLs organizada e "bookmarkable". Esta implementação atende ao requisito de organizar a "árvore genealógica do site" de forma lógica e intuitiva.

### Por que Hash-Based Routing?

Como uma Single Page Application (SPA), o sistema usa hash routing ao invés de rotas tradicionais porque:

1. ✅ **Funciona no GitHub Pages** - Não requer configuração de servidor
2. ✅ **Não recarrega a página** - Mantém performance de SPA
3. ✅ **Bookmarkable** - URLs podem ser salvos e compartilhados
4. ✅ **Navegação Browser** - Botões voltar/avançar funcionam
5. ✅ **Sem configuração adicional** - Funciona out-of-the-box

---

## 🌐 Estrutura de URLs

### URLs Principais

```
Base: https://taukkunen1.github.io/fitness-tracker/
```

#### Seções Públicas (Autenticadas)

| URL | Descrição | Atalho Teclado |
|-----|-----------|----------------|
| `/#dashboard` ou `/` | Dashboard principal com resumo | `D` |
| `/#treino` | Treinos e fotos de progresso | `T` |
| `/#exercicios` | Biblioteca de exercícios | - |
| `/#nutricao` | Módulo de nutrição | - |
| `/#nutricao/alimentacao` | Gestão de alimentação | `N` |
| `/#evolucao` | Métricas e evolução | `E` |
| `/#referencias` | Referências científicas | - |
| `/#developer` | Ferramentas de desenvolvedor | - |
| `/#sugestoes` | Sistema de sugestões (usuário) | - |

#### Seções Administrativas (Requer Admin)

| URL | Descrição | Acesso |
|-----|-----------|--------|
| `/#admin` ou `/#paineladmin` | Redirect para tarefas | 👑 Admin |
| `/#admin/tarefas` | Gestão de tarefas e roadmap | 👑 Admin |
| `/#admin/sugestoes` | Gestão de sugestões dos usuários | 👑 Admin |
| `/#admin/seguranca` | Painel de segurança e monitoramento | 👑 Admin |
| `/#admin/changelog` | Gerenciador de changelog | 👑 Admin |

### Aliases e Redirects

- `/#paineladmin` → `/#admin/tarefas`
- `/#alimentacao` ≈ `/#nutricao/alimentacao`
- `/` ou `/#` → `/#dashboard`

---

## ⚙️ Como Funciona

### Implementação Técnica

O sistema utiliza três componentes principais:

#### 1. `updateHash()` - Atualiza a URL

```javascript
function updateHash() {
  const hashMap = {
    'dashboard': '#dashboard',
    'treino': '#treino',
    'admin_tasks': '#admin/tarefas',
    // ... outros mapeamentos
  };
  
  const hash = hashMap[state.activeTab] || '#dashboard';
  if (window.location.hash !== hash) {
    window.location.hash = hash;
  }
}
```

Chamado quando:
- Usuário clica em um botão de navegação
- Usuário usa atalhos de teclado
- Aplicação muda de aba programaticamente

#### 2. `loadFromHash()` - Lê a URL e carrega a aba

```javascript
function loadFromHash() {
  const hash = window.location.hash.slice(1); // Remove #
  
  const tabMap = {
    '': 'dashboard',
    'dashboard': 'dashboard',
    'treino': 'treino',
    'admin/tarefas': 'admin_tasks',
    'paineladmin': 'admin_tasks', // Alias
    // ... outros mapeamentos
  };
  
  const newTab = tabMap[hash] || 'dashboard';
  
  // Verifica permissões admin
  if (newTab.startsWith('admin_') && !isAdmin()) {
    showNotification('⛔ Acesso negado.', 'error');
    state.activeTab = 'dashboard';
    updateHash();
    return;
  }
  
  state.activeTab = newTab;
}
```

Chamado quando:
- Aplicação inicia (carrega URL atual)
- Usuário usa botão voltar/avançar
- Evento `hashchange` é disparado

#### 3. Event Listener - Detecta mudanças na URL

```javascript
window.addEventListener('hashchange', () => {
  loadFromHash();
  render();
});
```

Garante sincronização entre URL e estado da aplicação.

---

## 🔒 Proteção de Rotas

### Verificação de Permissões

Todas as rotas que começam com `/#admin` são protegidas:

```javascript
// Verifica se o usuário é admin
if (newTab.startsWith('admin_') && !isAdmin()) {
  showNotification('⛔ Acesso negado. Você precisa ser administrador.', 'error');
  state.activeTab = 'dashboard';
  updateHash();
  return;
}
```

### Função `isAdmin()`

```javascript
function isAdmin() {
  return authState.isAuthenticated && 
         authState.currentAccount && 
         authState.currentAccount.role === 'admin';
}
```

### Comportamento de Proteção

1. **Usuário não-admin tenta acessar rota admin**:
   - Redirect automático para `/#dashboard`
   - Notificação: "⛔ Acesso negado. Você precisa ser administrador."
   - Evento de segurança é registrado nos logs

2. **URL direta (ex: abrindo link)**:
   - Mesmo comportamento de redirect
   - Proteção ativa desde o carregamento inicial

3. **Após logout**:
   - Sessão é destruída
   - Qualquer tentativa de acesso a rotas admin resulta em redirect

---

## 🧭 Navegação

### Navegação por Cliques

Os botões de navegação chamam:

```javascript
onclick="state.activeTab='treino'; updateHash(); render();"
```

Sequência:
1. Atualiza o estado da aplicação (`state.activeTab`)
2. Atualiza a URL no browser (`updateHash()`)
3. Re-renderiza a UI (`render()`)

### Navegação por Teclado

Atalhos disponíveis (quando não estiver digitando):

| Tecla | Ação | URL Resultante |
|-------|------|----------------|
| `D` | Dashboard | `/#dashboard` |
| `T` | Treinos | `/#treino` |
| `N` | Alimentação | `/#nutricao/alimentacao` |
| `E` | Evolução | `/#evolucao` |
| `?` | Ajuda (toggle) | - (sem mudança de URL) |

### Navegação por Browser

- **Botão Voltar** ⬅️: Volta para URL anterior, dispara `hashchange` event
- **Botão Avançar** ➡️: Avança para URL seguinte, dispara `hashchange` event
- **Histórico é mantido**: Cada mudança de aba é uma entrada no histórico

### Navegação por URL Direta

Usuários podem:
- Digitar URL diretamente na barra de endereços
- Copiar e colar URLs
- Salvar bookmarks
- Compartilhar links específicos

Exemplo:
```
https://taukkunen1.github.io/fitness-tracker/#admin/seguranca
```

Se o usuário for admin, abre o painel de segurança.  
Se não, redireciona para dashboard com erro.

---

## 💡 Exemplos de Uso

### Caso 1: Usuário clica em "Treinos"

```
1. Usuário clica no botão "🏋️ Treinos"
2. onclick executa: state.activeTab='treino'; updateHash(); render();
3. updateHash() define: window.location.hash = '#treino'
4. Browser URL muda para: /#treino
5. render() atualiza a UI mostrando a aba de treinos
6. Browser adiciona entrada no histórico
```

### Caso 2: Usuário pressiona "Voltar" no browser

```
1. Browser retorna para URL anterior (ex: /#dashboard)
2. 'hashchange' event é disparado
3. loadFromHash() é chamado
4. Lê hash '#dashboard' e define state.activeTab = 'dashboard'
5. render() atualiza a UI mostrando o dashboard
```

### Caso 3: Usuário tenta acessar admin sem permissão

```
URL digitada: /#admin/seguranca

1. Aplicação carrega, initApp() executa
2. loadFromHash() é chamado
3. Hash '#admin/seguranca' mapeia para 'admin_security'
4. Verificação: isAdmin() retorna false
5. Notificação de erro é exibida
6. state.activeTab forçado para 'dashboard'
7. updateHash() atualiza URL para /#dashboard
8. render() mostra dashboard
9. Evento de segurança é registrado
```

### Caso 4: Admin compartilha link de tarefa específica

```
Admin copia: /#admin/tarefas
Envia para outro admin via mensagem
Outro admin clica no link

1. Browser navega para /#admin/tarefas
2. loadFromHash() processa o hash
3. isAdmin() retorna true (é admin)
4. state.activeTab = 'admin_tasks'
5. render() mostra painel de tarefas
6. ✅ Acesso concedido
```

---

## 🔍 Troubleshooting

### Problema: URL não muda quando clico nos botões

**Causa**: Chamada `updateHash()` pode estar faltando

**Solução**: Verifique se o onclick inclui `updateHash()`:
```javascript
onclick="state.activeTab='treino'; updateHash(); render();"
```

### Problema: Botão Voltar não funciona

**Causa**: Event listener `hashchange` pode não estar registrado

**Solução**: Confirme que o listener está ativo:
```javascript
window.addEventListener('hashchange', () => {
  loadFromHash();
  render();
});
```

### Problema: Redirect para dashboard mesmo sendo admin

**Causa**: Função `isAdmin()` pode retornar false incorretamente

**Solução**: Verifique no console:
```javascript
console.log('Is Admin?', isAdmin());
console.log('Auth State:', authState);
console.log('Current Account:', authState.currentAccount);
console.log('Role:', authState.currentAccount?.role);
```

### Problema: URL fica como "/#undefined"

**Causa**: Tab name não está no `hashMap` em `updateHash()`

**Solução**: Adicione o mapeamento faltante:
```javascript
const hashMap = {
  'dashboard': '#dashboard',
  'nova_tab': '#nova-url', // Adicione aqui
  // ...
};
```

### Problema: Hash não é reconhecido ao carregar página

**Causa**: Hash pode não estar no `tabMap` em `loadFromHash()`

**Solução**: Adicione o mapeamento reverso:
```javascript
const tabMap = {
  'nova-url': 'nova_tab', // Adicione aqui
  // ...
};
```

---

## 🎨 Convenções e Melhores Práticas

### Nomenclatura de Hashes

- **Use kebab-case**: `#admin/tarefas` não `#admin/Tarefas`
- **Sem acentos**: `#nutricao` não `#nutrição`
- **Hierárquico**: Use `/` para sub-seções (`#admin/seguranca`)
- **Curto e descritivo**: `#treino` melhor que `#workout-tracking-module`

### Mapeamento Interno vs. Externo

**Interno (state.activeTab)**: `admin_tasks`, `admin_security`
- Usa underscore `_`
- Consistente com variáveis JavaScript

**Externo (URL hash)**: `#admin/tarefas`, `#admin/seguranca`
- Usa barra `/` para hierarquia
- User-friendly e legível

### Adicionando Novas Rotas

1. **Adicione ao `hashMap`** em `updateHash()`:
```javascript
'nova_tab': '#nova-rota'
```

2. **Adicione ao `tabMap`** em `loadFromHash()`:
```javascript
'nova-rota': 'nova_tab'
```

3. **Adicione renderização** em `render()`:
```javascript
${state.activeTab === 'nova_tab' ? renderNovaTab() : ''}
```

4. **Adicione botão** na navegação:
```javascript
<button onclick="state.activeTab='nova_tab'; updateHash(); render();">
  Nova Tab
</button>
```

5. **(Opcional) Adicione atalho** de teclado:
```javascript
case 'x':
  state.activeTab = 'nova_tab';
  updateHash();
  render();
  break;
```

---

## 📚 Referências

- [MDN - Window.location.hash](https://developer.mozilla.org/en-US/docs/Web/API/Location/hash)
- [MDN - hashchange event](https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event)
- [Single Page Apps with Hash Routing](https://developer.mozilla.org/en-US/docs/Web/API/History_API)
- [INFORMATION-ARCHITECTURE.md](./INFORMATION-ARCHITECTURE.md)

---

**Mantido por:** @taukkunen1  
**Versão:** 2.1.0  
**Última atualização:** 2025-11-16
