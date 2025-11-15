# Scripts - Pilgrim Fitness Tracker

Utilitários e scripts de automação para o projeto Pilgrim.

## 📋 Scripts Disponíveis

### `verify-ssl.sh` - Verificação de SSL/HTTPS

Script completo para validação de configuração HTTPS e certificados SSL.

**Uso**:
```bash
./scripts/verify-ssl.sh <domain>
```

**Exemplos**:
```bash
# Verificar GitHub Pages
./scripts/verify-ssl.sh taukkunen1.github.io/fitness-tracker

# Verificar Render.com
./scripts/verify-ssl.sh fitness-tracker.onrender.com

# Verificar domínio customizado
./scripts/verify-ssl.sh seu-dominio.com
```

**O que é testado**:
1. ✅ **HTTPS Accessibility** - Verifica se o site está acessível via HTTPS (porta 443)
2. ✅ **HTTP to HTTPS Redirect** - Confirma que HTTP redireciona para HTTPS
3. ✅ **SSL Certificate** - Valida certificado e verifica data de expiração
4. ✅ **Security Headers** - Verifica headers críticos:
   - Strict-Transport-Security (HSTS)
   - X-Content-Type-Options
   - X-Frame-Options
   - Referrer-Policy
   - Content-Security-Policy
5. ✅ **TLS Version** - Confirma uso de TLS 1.2 ou 1.3
6. ✅ **Mixed Content** - Detecta conteúdo HTTP em página HTTPS
7. ✅ **Response Time** - Mede tempo de resposta do servidor
8. ✅ **SSL Labs Recommendation** - Link para teste completo

**Saída Esperada**:
```
=================================================
SSL/HTTPS Verification for: seu-dominio.com
=================================================

[1/8] Testing HTTPS accessibility...
✓ HTTPS is accessible

[2/8] Testing HTTP to HTTPS redirect...
✓ HTTP redirects to HTTPS

[3/8] Checking SSL certificate...
✓ SSL certificate is valid
  notBefore=Nov 15 00:00:00 2025 GMT
  notAfter=Feb 13 23:59:59 2026 GMT

[4/8] Checking security headers...
✓ Strict-Transport-Security: max-age=31536000; includeSubDomains
✓ X-Content-Type-Options: nosniff
✓ X-Frame-Options: DENY
✓ Referrer-Policy: no-referrer
✓ Content-Security-Policy: default-src 'self'...

✓ Security headers: 5/5 present

[5/8] Checking TLS version...
✓ Protocol  : TLSv1.3
✓ Using secure TLS version

[6/8] Checking for mixed content...
✓ No mixed content detected

[7/8] Checking response time...
✓ Response time: 0.234s

[8/8] SSL Labs Test Recommendation
For comprehensive SSL/TLS analysis, test at:
https://www.ssllabs.com/ssltest/analyze.html?d=seu-dominio.com

=================================================
Summary
=================================================

Score: 7/8 (87%)
✓ Excellent! HTTPS configuration is secure.
```

**Requisitos**:
- `curl` - Para requisições HTTP/HTTPS
- `openssl` - Para análise de certificados (opcional)
- `bc` - Para cálculos (opcional)

**Códigos de Saída**:
- `0` - Sucesso (score >= 70%)
- `1` - Falha (score < 70% ou site inacessível)

---

## 🔧 Instalação de Dependências

### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install -y curl openssl bc
```

### macOS
```bash
# curl e openssl já vêm instalados
brew install bc  # se necessário
```

### Windows (WSL)
```bash
sudo apt-get update
sudo apt-get install -y curl openssl bc
```

---

## 📝 Uso em CI/CD

### GitHub Actions

O script está integrado no workflow `.github/workflows/https-validation.yml`:

```yaml
- name: Validate HTTPS
  run: |
    chmod +x scripts/verify-ssl.sh
    ./scripts/verify-ssl.sh seu-dominio.com
```

### GitLab CI

```yaml
validate-https:
  script:
    - chmod +x scripts/verify-ssl.sh
    - ./scripts/verify-ssl.sh seu-dominio.com
```

### Jenkins

```groovy
stage('Validate HTTPS') {
  steps {
    sh 'chmod +x scripts/verify-ssl.sh'
    sh './scripts/verify-ssl.sh seu-dominio.com'
  }
}
```

---

## 🐛 Troubleshooting

### Erro: "HTTPS is not accessible"

**Causas possíveis**:
- Site ainda não está no ar
- Porta 443 bloqueada por firewall
- DNS não propagado
- Certificado SSL não configurado

**Solução**:
```bash
# Testar conectividade básica
curl -I https://seu-dominio.com

# Verificar DNS
nslookup seu-dominio.com

# Testar porta 443
telnet seu-dominio.com 443
```

### Erro: "Could not retrieve certificate info"

**Causas**:
- OpenSSL não instalado
- Certificado auto-assinado
- TLS handshake falhou

**Solução**:
```bash
# Instalar OpenSSL
sudo apt-get install openssl

# Testar manualmente
openssl s_client -connect seu-dominio.com:443 -servername seu-dominio.com
```

### Aviso: "Mixed content detected"

**Causa**: Página HTTPS carregando recursos via HTTP

**Solução**:
1. Abrir DevTools do navegador (F12)
2. Verificar aba Console para avisos
3. Atualizar URLs para HTTPS ou usar protocolo relativo (`//`)

### Baixa pontuação de segurança

**Melhorias**:
1. Adicionar header HSTS: `Strict-Transport-Security`
2. Configurar CSP: `Content-Security-Policy`
3. Atualizar TLS para 1.2+
4. Desabilitar ciphers fracos
5. Habilitar OCSP Stapling

---

## 📚 Recursos Adicionais

### Documentação
- [DEPLOYMENT-CHECKLIST.md](../DEPLOYMENT-CHECKLIST.md) - Checklist completo de deploy
- [HTTPS-DEPLOYMENT-GUIDE.md](../docs/deployment/HTTPS-DEPLOYMENT-GUIDE.md) - Guia detalhado

### Ferramentas Online
- [SSL Labs](https://www.ssllabs.com/ssltest/) - Teste completo de SSL/TLS
- [Security Headers](https://securityheaders.com/) - Análise de headers
- [Mozilla Observatory](https://observatory.mozilla.org/) - Scan de segurança

### Referências
- [OWASP Security Headers](https://owasp.org/www-project-secure-headers/)
- [Mozilla SSL Configuration](https://ssl-config.mozilla.org/)
- [Let's Encrypt](https://letsencrypt.org/docs/)

---

## 🤝 Contribuindo

Para adicionar novos scripts ou melhorar os existentes:

1. Criar script em `scripts/`
2. Tornar executável: `chmod +x scripts/seu-script.sh`
3. Adicionar documentação neste README
4. Adicionar testes se aplicável
5. Criar PR com as mudanças

**Boas práticas**:
- Usar `set -e` para parar em erros
- Adicionar help/usage function
- Validar parâmetros de entrada
- Retornar códigos de saída apropriados
- Incluir cores para melhor UX

---

**Criado em**: 2025-11-15  
**Mantido por**: [taukkunen1](https://github.com/taukkunen1)  
**Licença**: MIT
