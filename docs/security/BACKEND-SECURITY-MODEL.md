# 🔐 Backend Security Model - OWASP Recommended Architecture

## Visão Geral

Este documento descreve o modelo de segurança recomendado pela OWASP (Open Web Application Security Project) e pela academia científica, implementando o princípio de **Backend + Mínima Lógica no Cliente**.

## 🎯 Princípios Fundamentais

### 1. Backend como Autoridade Central
**Princípio**: Toda lógica crítica de negócio e segurança deve residir no backend.

✅ **O que DEVE estar no Backend:**
- Autenticação e geração de tokens
- Autorização e controle de acesso
- Validação de dados (nunca confie apenas no cliente)
- Lógica de negócio sensível
- Criptografia de dados sensíveis
- Rate limiting e proteção contra ataques
- Auditoria e logging de segurança
- Operações de banco de dados

❌ **O que NÃO DEVE estar APENAS no Cliente:**
- Validação de permissões
- Cálculos críticos de negócio
- Segredos ou chaves API
- Lógica de autenticação completa
- Hash de senhas (deve ser validado no backend)

### 2. Cliente como Interface de Apresentação
**Princípio**: O cliente deve ser apenas uma camada de apresentação que consome APIs seguras.

✅ **Responsabilidades do Cliente:**
- Renderização da interface
- Validação de UX (feedback rápido, não segurança)
- Coleta de input do usuário
- Chamadas a APIs do backend
- Gerenciamento de estado local (não sensível)
- Cache não-sensível

## 🏗️ Arquitetura Recomendada

```
┌─────────────────────────────────────────────┐
│           CLIENTE (Frontend)                │
│  ┌──────────────────────────────────────┐  │
│  │  UI/UX Layer                         │  │
│  │  - Apresentação                      │  │
│  │  - Validação UX                      │  │
│  │  - Cache não-sensível                │  │
│  └──────────────────────────────────────┘  │
│              ↓ HTTPS/TLS ↓                  │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│           API GATEWAY                        │
│  ┌──────────────────────────────────────┐  │
│  │  - Rate Limiting                     │  │
│  │  - CORS/CSP                          │  │
│  │  - DDoS Protection                   │  │
│  │  - API Authentication                │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         BACKEND (Servidor)                  │
│  ┌──────────────────────────────────────┐  │
│  │  Authentication Service              │  │
│  │  - Login/Logout                      │  │
│  │  - Token Generation                  │  │
│  │  - Session Management                │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │  Authorization Service               │  │
│  │  - RBAC (Role-Based Access Control) │  │
│  │  - Permission Checks                 │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │  Business Logic Layer                │  │
│  │  - Validação de Dados                │  │
│  │  - Regras de Negócio                 │  │
│  │  - Processamento                     │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │  Security Layer                      │  │
│  │  - Encryption/Decryption             │  │
│  │  - PBKDF2 Password Hashing           │  │
│  │  - Audit Logging                     │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         DATABASE                            │
│  - Encrypted at Rest                        │
│  - Backup Strategy                          │
│  - Access Control                           │
└─────────────────────────────────────────────┘
```

## 🔒 Implementação de Segurança por Camada

### Camada 1: API Gateway
```javascript
// Responsabilidades:
- Rate Limiting (ex: 100 req/min por IP)
- DDoS Protection
- CORS Policy
- API Key Validation
- Request Size Limits
- Header Validation (X-Forwarded-For, etc.)
```

**Tecnologias Recomendadas:**
- AWS API Gateway
- Kong
- Nginx + ModSecurity
- Cloudflare

### Camada 2: Authentication/Authorization Service
```javascript
// POST /api/auth/login
{
  username: string,
  password: string
}

// Backend valida:
1. Rate limiting específico (ex: 5 tentativas/15min)
2. Username existe?
3. Hash da senha matches?
4. Conta não está bloqueada?
5. Gera JWT token seguro
6. Registra no audit log

// Response:
{
  token: "jwt_token_here",
  expiresIn: 86400,
  user: { id, username, role }
}
```

**Implementação Recomendada:**
```javascript
// Backend (Node.js exemplo)
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.post('/api/auth/login', rateLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 1. Validação de entrada
    if (!username || !password) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    
    // 2. Buscar usuário (com rate limit)
    const user = await db.users.findOne({ username });
    if (!user) {
      // Tempo constante para prevenir enumeração
      await bcrypt.hash(password, 10);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // 3. Verificar senha
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      await auditLog('login_failed', { username });
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // 4. Verificar conta não bloqueada
    if (user.isLocked) {
      return res.status(403).json({ error: 'Account locked' });
    }
    
    // 5. Gerar token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // 6. Audit log
    await auditLog('login_success', { username, ip: req.ip });
    
    res.json({ token, user: { id: user.id, username, role: user.role } });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### Camada 3: Business Logic Service
```javascript
// Exemplo: Registrar refeição
// POST /api/meals

// Backend valida:
1. Token JWT válido? (middleware)
2. Usuário tem permissão?
3. Dados são válidos? (schema validation)
4. Lógica de negócio (ex: limites de calorias)
5. Sanitização de dados
6. Salva no banco
7. Retorna resposta

// Middleware de autenticação:
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}
```

## 📊 Comparação: Cliente vs Backend

| Aspecto | Implementação Atual (Cliente) | Implementação Segura (Backend) |
|---------|-------------------------------|--------------------------------|
| **Autenticação** | ⚠️ Hash no cliente (IndexedDB) | ✅ Hash e validação no backend |
| **Autorização** | ⚠️ Verificação client-side | ✅ Verificação server-side |
| **Validação** | ⚠️ Apenas no cliente | ✅ Cliente (UX) + Backend (segurança) |
| **Rate Limiting** | ⚠️ localStorage (contornável) | ✅ Backend com IP tracking |
| **Audit Log** | ⚠️ Armazenamento local | ✅ Backend persistente e seguro |
| **Dados Sensíveis** | ⚠️ Expostos no cliente | ✅ Protegidos no backend |
| **Segredos** | ⚠️ Não há controle | ✅ Environment variables seguras |
| **Atualização** | ⚠️ Requer reload do cliente | ✅ Imediata no backend |

## 🛡️ OWASP Top 10 e Mitigações Backend

### 1. A01:2021 – Broken Access Control
**Problema Cliente**: Verificação de permissão no frontend pode ser contornada.
**Solução Backend**: Middleware de autorização em TODAS as rotas.

```javascript
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}

app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  // Apenas admins chegam aqui
});
```

### 2. A02:2021 – Cryptographic Failures
**Problema Cliente**: Dados em localStorage/IndexedDB não são criptografados.
**Solução Backend**: 
- Dados em trânsito: HTTPS/TLS 1.3
- Dados em repouso: Database encryption at rest
- Senhas: bcrypt/PBKDF2 no backend

### 3. A03:2021 – Injection
**Problema Cliente**: Validação pode ser ignorada.
**Solução Backend**: 
```javascript
// Sempre usar prepared statements / ORMs
// Exemplo com Sequelize:
const meals = await Meal.findAll({
  where: { userId: req.user.id } // Parametrizado, seguro
});

// NUNCA:
// const query = `SELECT * FROM meals WHERE userId = ${req.user.id}`; // INSEGURO!
```

### 4. A04:2021 – Insecure Design
**Problema Cliente**: Lógica de negócio exposta e modificável.
**Solução Backend**: 
- Lógica crítica apenas no backend
- Validação de regras de negócio server-side
- Design com princípio de menor privilégio

### 5. A05:2021 – Security Misconfiguration
**Solução Backend**:
```javascript
// Helmet.js para headers de segurança
const helmet = require('helmet');
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS configurado
const cors = require('cors');
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true
}));
```

## 🚀 Migração: Cliente-Only → Backend + Cliente

### Fase 1: Preparação (Atual)
1. ✅ Documentar arquitetura backend recomendada
2. ✅ Implementar minificação e obfuscação
3. ✅ Criar módulo WASM para funções críticas
4. ⏳ Preparar código para ser consumidor de API

### Fase 2: Backend Inicial (Futuro)
1. Setup do backend (Node.js/Express ou similar)
2. Implementar autenticação backend
3. Migrar validações críticas
4. APIs RESTful para dados

### Fase 3: Migração Gradual (Futuro)
1. Migrar funcionalidade por funcionalidade
2. Manter compatibilidade com modo offline
3. Sincronização de dados local ↔ backend

### Fase 4: Backend Completo (Futuro)
1. Toda lógica crítica no backend
2. Cliente como UI layer
3. WebSockets para real-time
4. Microserviços (opcional)

## 🔐 Checklist de Segurança Backend

### Autenticação
- [ ] Hash de senha com bcrypt/PBKDF2 (min 100k iterations)
- [ ] JWT tokens com expiração curta (< 1h) ou session tokens
- [ ] Refresh tokens para renovação
- [ ] Multi-factor authentication (MFA)
- [ ] Account lockout após tentativas falhadas
- [ ] Audit logging de todos os eventos de auth

### Autorização
- [ ] RBAC (Role-Based Access Control)
- [ ] Princípio de menor privilégio
- [ ] Verificação de permissões em TODAS as rotas
- [ ] Não confiar em headers do cliente

### Dados
- [ ] Validação de entrada (schema validation)
- [ ] Sanitização de dados
- [ ] Prepared statements / ORMs
- [ ] Encryption at rest
- [ ] Encryption in transit (HTTPS)
- [ ] Backup strategy

### Infraestrutura
- [ ] Rate limiting (API Gateway)
- [ ] DDoS protection
- [ ] WAF (Web Application Firewall)
- [ ] Security headers (Helmet.js)
- [ ] CORS configurado corretamente
- [ ] Environment variables para secrets
- [ ] Logging e monitoring

### Conformidade
- [ ] LGPD/GDPR compliance
- [ ] Privacy policy
- [ ] Terms of service
- [ ] Data retention policies
- [ ] Right to be forgotten

## 📚 Referências

### OWASP
- [OWASP Top 10 2021](https://owasp.org/www-project-top-ten/)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

### NIST
- [NIST Digital Identity Guidelines](https://pages.nist.gov/800-63-3/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

### Academia
- [A01:2021 – Broken Access Control](https://owasp.org/Top10/A01_2021-Broken_Access_Control/)
- [Backend Security Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)

## 🎓 Conclusão

O modelo **Backend + Mínima Lógica no Cliente** é a abordagem mais segura segundo:
- ✅ OWASP (Open Web Application Security Project)
- ✅ NIST (National Institute of Standards and Technology)
- ✅ Academia científica de segurança
- ✅ Indústria (Google, Microsoft, Amazon)

**Benefícios:**
1. 🔒 Segurança centralizada e controlável
2. 🔄 Atualizações imediatas sem reload do cliente
3. 📊 Auditoria completa e confiável
4. 🛡️ Proteção contra manipulação client-side
5. 🚀 Escalabilidade e performance

**Trade-offs:**
- Requer infraestrutura backend
- Maior complexidade de deploy
- Custo de hospedagem
- Modo offline limitado (pode ser mitigado com service workers)

Para o Fitness Tracker, a migração gradual permite manter os benefícios atuais (simplicidade, offline-first) enquanto adiciona segurança enterprise para usuários que precisam.
