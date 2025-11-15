# 📊 Guia do Painel de Monitoramento Administrativo

## Visão Geral

O Pilgrim agora inclui um sistema completo de monitoramento de acessos para administradores. Este sistema permite acompanhar em tempo real o uso do site, visualizar estatísticas detalhadas e exportar dados para análise.

## 🔐 Acesso ao Painel

### Requisitos
- **Permissão**: Apenas usuários com role `admin`
- **Login**: Necessário estar autenticado
- **Localização**: Aba "🔐 Segurança" no menu administrativo

### Como Acessar
1. Faça login com uma conta de administrador
2. No menu superior, localize a seção "👑 ADMIN"
3. Clique na aba "🔐 Segurança"

## 📈 Funcionalidades

### 1. Monitoramento de Acessos ao Site

#### 1.1 Estatísticas em Tempo Real
O painel exibe as seguintes métricas:

- **Total de Acessos**: Quantidade total de acessos registrados desde o início
- **Últimas 24h**: Número de acessos nas últimas 24 horas
- **Últimos 7 dias**: Número de acessos na última semana
- **Visitantes Únicos (24h)**: Quantidade de usuários diferentes que acessaram nas últimas 24h
- **Contas Registradas**: Total de contas cadastradas no sistema

#### 1.2 Atualização Automática
- O painel atualiza automaticamente **a cada 5 minutos**
- Horário da última atualização é exibido no cabeçalho
- Não é necessário recarregar a página manualmente

### 2. Logs de Acesso Recentes

#### 2.1 Informações Exibidas
Cada log de acesso contém:
- **Role do usuário**: Admin, User ou Anonymous
- **Username**: Nome do usuário autenticado
- **Timestamp**: Data e hora exata do acesso
- **Resolução de Tela**: Resolução do dispositivo usado
- **Idioma**: Idioma do navegador

#### 2.2 Visualização
- Exibe os **30 acessos mais recentes**
- Ordenados do mais recente para o mais antigo
- Cores diferentes para identificar roles:
  - 🔴 **Vermelho**: Administradores
  - 🔵 **Azul**: Usuários regulares
  - ⚫ **Cinza**: Acessos anônimos (não autenticados)

### 3. Gráfico de Acessos por Hora

#### 3.1 Visualização
- Gráfico de barras mostrando distribuição de acessos nas últimas 24 horas
- Eixo X: Horas do dia (0h-23h)
- Eixo Y: Número de acessos
- Altura da barra proporcional ao número de acessos

#### 3.2 Interpretação
- Identifique horários de pico de uso
- Planeje manutenções em horários de baixo tráfego
- Analise padrões de comportamento dos usuários

### 4. Estatísticas de Segurança

#### 4.1 Métricas
- **Total de Eventos**: Todos os eventos de segurança registrados
- **Logins Sucesso**: Quantidade de logins bem-sucedidos
- **Logins Falhados**: Tentativas de login que falharam
- **Contas Bloqueadas**: Contas temporariamente bloqueadas por tentativas excessivas

#### 4.2 Eventos de Segurança Recentes
Lista dos 50 eventos de segurança mais recentes, incluindo:
- Tipo do evento (LOGIN SUCCESS, LOGIN FAILED, etc.)
- Username envolvido
- Detalhes do evento
- Timestamp

### 5. Gerenciamento de Contas

#### 5.1 Listagem de Contas
Tabela com todas as contas registradas:
- Username
- Email
- Role (Admin/User)
- Data de criação
- Último login

#### 5.2 Ações Administrativas
- **Promover a Admin**: Transforma usuário regular em administrador
- Botão disponível apenas para contas não-admin
- Requer confirmação antes de executar

### 6. Exportação de Dados

#### 6.1 Exportar Logs de Segurança
- Formato: JSON
- Conteúdo: Todos os eventos de segurança registrados
- Nome do arquivo: `security_logs_YYYY-MM-DD.json`

#### 6.2 Exportar Logs de Acesso
- Formato: JSON
- Conteúdo: Todos os logs de acesso registrados
- Nome do arquivo: `access_logs_YYYY-MM-DD.json`

### 7. Limpeza de Dados

#### 7.1 Limpar Logs Antigos de Segurança
- Remove logs com mais de **30 dias**
- Requer confirmação do administrador
- Exibe quantidade de logs removidos

#### 7.2 Limpar Acessos Antigos
- Remove logs de acesso com mais de **90 dias**
- Limpeza automática ocorre periodicamente
- Pode ser executada manualmente quando necessário

## 🔧 Configurações Técnicas

### Armazenamento
```javascript
IndexedDB Database: 'fitness-tracker-db'
Store: 'access_logs'
Retenção: 90 dias
```

### Estrutura de Log de Acesso
```javascript
{
  id: "access_1699200000000_abc123",
  timestamp: "2025-11-05T17:30:00.000Z",
  username: "admin_user",
  role: "admin",
  page: "/index.html",
  userAgent: "Mozilla/5.0...",
  screenResolution: "1920x1080",
  language: "pt-BR"
}
```

### Auto-refresh
- **Intervalo**: 5 minutos (300.000 ms)
- **Condições**: Apenas quando o admin está visualizando a aba de segurança
- **Implementação**: setInterval com cleanup automático

## 📊 Casos de Uso

### Caso 1: Monitorar Atividade Suspeita
1. Acesse o painel de segurança
2. Verifique "Logins Falhados" - número alto pode indicar tentativa de invasão
3. Analise "Eventos de Segurança Recentes" para identificar padrões
4. Exporte logs para análise detalhada se necessário

### Caso 2: Análise de Uso do Sistema
1. Observe "Total de Acessos" e "Visitantes Únicos"
2. Use o gráfico horário para identificar horários de pico
3. Compare acessos nas últimas 24h vs 7 dias para identificar tendências
4. Exporte logs de acesso para análise em ferramenta externa

### Caso 3: Gerenciamento de Usuários
1. Acesse "Gerenciamento de Contas"
2. Revise lista de usuários registrados
3. Verifique último login para identificar contas inativas
4. Promova usuários confiáveis a administradores quando necessário

### Caso 4: Manutenção do Sistema
1. Execute "Limpar Logs Antigos" periodicamente
2. Mantenha apenas dados relevantes
3. Libere espaço no IndexedDB
4. Garanta performance do sistema

## 🛡️ Segurança e Privacidade

### Proteções Implementadas
- ✅ Acesso restrito apenas a administradores
- ✅ Validação de role em cada requisição
- ✅ Logs armazenados localmente (IndexedDB)
- ✅ Sem transmissão de dados para servidores externos
- ✅ Auto-limpeza de dados antigos
- ✅ Sanitização de todos os inputs

### Dados Coletados
Os logs de acesso **NÃO** coletam:
- ❌ Senhas ou credenciais
- ❌ Dados pessoais sensíveis
- ❌ Histórico de navegação externo
- ❌ Cookies de terceiros
- ❌ Informações de pagamento

Os logs de acesso **coletam apenas**:
- ✅ Username (já autenticado)
- ✅ Timestamp do acesso
- ✅ Role do usuário
- ✅ User agent do navegador
- ✅ Resolução de tela
- ✅ Idioma do navegador

### Conformidade LGPD/GDPR
- Dados armazenados localmente no dispositivo do usuário
- Nenhuma transmissão para servidores
- Retenção limitada (90 dias)
- Usuário tem controle total sobre seus dados

## 🔄 Manutenção Recomendada

### Diariamente
- [ ] Verificar "Logins Falhados" para atividade suspeita
- [ ] Revisar acessos recentes

### Semanalmente
- [ ] Analisar tendências de acesso
- [ ] Verificar contas inativas
- [ ] Exportar logs para backup

### Mensalmente
- [ ] Executar limpeza de logs antigos
- [ ] Revisar lista de administradores
- [ ] Atualizar documentação se necessário

## 📞 Suporte

Para questões sobre o painel de monitoramento:
- **Issues**: [GitHub Issues](https://github.com/taukkunen1/fitness-tracker/issues)
- **Documentação**: Consulte SECURITY.md para detalhes técnicos de segurança

## 📚 Referências

- [SECURITY.md](./SECURITY.md) - Guia completo de segurança
- [ADMIN-GUIDE.md](./ADMIN-GUIDE.md) - Guia geral do administrador
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

---

**Versão**: 1.0.0  
**Data**: 2025-11-05  
**Status**: ✅ Produção
