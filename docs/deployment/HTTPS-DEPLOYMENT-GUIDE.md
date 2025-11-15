# 🔐 Guia de Deploy HTTPS em Produção - Pilgrim

Este guia fornece instruções completas para configurar HTTPS/SSL em produção para o sistema Pilgrim.

## Visão Geral

HTTPS (HyperText Transfer Protocol Secure) é essencial para:
- **Segurança**: Criptografia de dados em trânsito
- **Privacidade**: Proteção de informações sensíveis dos usuários
- **Confiança**: Indicador de segurança no navegador
- **SEO**: Melhor ranking em mecanismos de busca
- **Conformidade**: Requisito para muitas regulamentações

## Opção 1: GitHub Pages (Recomendado)

### Pré-requisitos
- Repositório público no GitHub
- Branch configurada para GitHub Pages (geralmente `main` ou `gh-pages`)

### Passo 1: Ativar GitHub Pages

1. Acesse as configurações do repositório no GitHub
2. Navegue até **Settings** > **Pages**
3. Em "Source", selecione a branch desejada (ex: `main`)
4. Clique em **Save**

### Passo 2: HTTPS Automático (github.io)

Para domínios `*.github.io`, o HTTPS é **automaticamente habilitado**:
- ✅ Certificado SSL/TLS fornecido pelo GitHub
- ✅ Renovação automática via Let's Encrypt
- ✅ Redirecionamento HTTP → HTTPS
- ✅ Sem configuração adicional necessária

Sua aplicação estará disponível em:
```
https://<username>.github.io/<repository>/
```

### Passo 3: Verificar HTTPS

```bash
# Teste básico de conexão
curl -I https://<username>.github.io/<repository>/

# Teste de redirecionamento HTTP → HTTPS
curl -I http://<username>.github.io/<repository>/
```

Resposta esperada:
```
HTTP/2 200
# ou
HTTP/1.1 301 Moved Permanently
Location: https://...
```

## Opção 2: Domínio Customizado

### Passo 1: Configurar Domínio no GitHub

1. Em **Settings** > **Pages**
2. Em "Custom domain", insira seu domínio (ex: `pilgrim.example.com`)
3. Clique em **Save**

### Passo 2: Configurar DNS

#### Para Apex Domain (example.com):
Adicione os seguintes registros A no seu provedor DNS:
```
Type: A
Name: @
Value: 185.199.108.153

Type: A
Name: @
Value: 185.199.109.153

Type: A
Name: @
Value: 185.199.110.153

Type: A
Name: @
Value: 185.199.111.153
```

#### Para Subdomain (www.example.com ou pilgrim.example.com):
```
Type: CNAME
Name: www (ou pilgrim)
Value: <username>.github.io
```

#### Verificar Propagação DNS
```bash
# Linux/Mac
dig <seu-dominio.com> +short
nslookup <seu-dominio.com>

# Windows
nslookup <seu-dominio.com>
```

### Passo 3: Obter Certificado SSL (Automático)

Após configurar o DNS:
1. Aguarde propagação DNS (5-30 minutos)
2. GitHub Pages gera automaticamente certificado Let's Encrypt
3. Processo leva alguns minutos
4. Certificado é renovado automaticamente a cada 90 dias

### Passo 4: Ativar HTTPS Obrigatório

1. Em **Settings** > **Pages**
2. Marque **Enforce HTTPS**
3. Aguarde ativação (pode levar alguns minutos)

## Opção 3: Servidor Próprio

### Usando Let's Encrypt com Certbot

#### Apache (Ubuntu/Debian)
```bash
# Instalar Certbot
sudo apt update
sudo apt install certbot python3-certbot-apache

# Obter e instalar certificado
sudo certbot --apache -d seu-dominio.com -d www.seu-dominio.com

# Renovação automática (teste)
sudo certbot renew --dry-run
```

#### Nginx (Ubuntu/Debian)
```bash
# Instalar Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Obter e instalar certificado
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com

# Renovação automática (teste)
sudo certbot renew --dry-run
```

### Configuração Manual Apache

```apache
<VirtualHost *:443>
    ServerName seu-dominio.com
    ServerAlias www.seu-dominio.com
    
    DocumentRoot /var/www/pilgrim
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/seu-dominio.com/cert.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/seu-dominio.com/privkey.pem
    SSLCertificateChainFile /etc/letsencrypt/live/seu-dominio.com/chain.pem
    
    # Security Headers
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "DENY"
    Header always set Referrer-Policy "no-referrer"
    Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
    
    # Content Security Policy
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:;"
</VirtualHost>

# Redirect HTTP to HTTPS
<VirtualHost *:80>
    ServerName seu-dominio.com
    ServerAlias www.seu-dominio.com
    Redirect permanent / https://seu-dominio.com/
</VirtualHost>
```

### Configuração Manual Nginx

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name seu-dominio.com www.seu-dominio.com;
    return 301 https://seu-dominio.com$request_uri;
}

# HTTPS Configuration
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name seu-dominio.com www.seu-dominio.com;
    
    root /var/www/pilgrim;
    index index.html;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header Referrer-Policy "no-referrer" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
    
    # Content Security Policy
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:;" always;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

## Checklist de Deploy HTTPS

### ✅ Obter certificado SSL (Let's Encrypt)
- [ ] Certificado obtido com sucesso
- [ ] Certificado válido por 90 dias
- [ ] Renovação automática configurada

### ✅ Configurar servidor para HTTPS
- [ ] HTTPS habilitado na porta 443
- [ ] Certificado SSL configurado
- [ ] TLS 1.2 ou superior habilitado
- [ ] Ciphers seguros configurados

### ✅ Testar conexão HTTPS
- [ ] Site acessível via https://
- [ ] Certificado válido no navegador
- [ ] Sem avisos de segurança
- [ ] Ícone de cadeado verde

### ✅ Redirecionar HTTP para HTTPS
- [ ] HTTP (porta 80) redireciona para HTTPS
- [ ] Redirecionamento 301 (permanente)
- [ ] Preserva URLs e parâmetros

### ✅ Verificar segurança com SSL Labs
- [ ] Teste em https://www.ssllabs.com/ssltest/
- [ ] Nota A ou A+
- [ ] Sem vulnerabilidades conhecidas

## Testes e Verificação

### 1. Teste de Certificado SSL
```bash
# Verificar certificado
openssl s_client -connect seu-dominio.com:443 -servername seu-dominio.com

# Verificar data de expiração
echo | openssl s_client -servername seu-dominio.com -connect seu-dominio.com:443 2>/dev/null | openssl x509 -noout -dates
```

### 2. Teste de Redirecionamento
```bash
# Deve retornar 301 e Location com https://
curl -I http://seu-dominio.com

# Deve retornar 200 OK
curl -I https://seu-dominio.com
```

### 3. SSL Labs Test
Acesse: https://www.ssllabs.com/ssltest/analyze.html?d=seu-dominio.com

Critérios para nota A+:
- ✅ Certificado válido e confiável
- ✅ TLS 1.2 ou 1.3
- ✅ HSTS habilitado
- ✅ Sem vulnerabilidades conhecidas

### 4. Teste de Headers de Segurança
```bash
curl -I https://seu-dominio.com | grep -i "strict-transport-security\|x-content-type\|x-frame"
```

### 5. Teste de Navegador
Verifique em diferentes navegadores:
- ✅ Chrome/Edge: Ícone de cadeado verde
- ✅ Firefox: Ícone de cadeado cinza
- ✅ Safari: Ícone de cadeado
- ✅ Sem avisos de conteúdo misto

## Troubleshooting

### Problema: Certificado não é gerado automaticamente

**Solução:**
1. Verifique propagação DNS: `dig seu-dominio.com +short`
2. Remova e adicione domínio novamente nas configurações
3. Aguarde até 24h para propagação DNS completa

### Problema: Aviso de conteúdo misto (Mixed Content)

**Solução:**
1. Certifique-se que todos recursos usam HTTPS
2. Atualize URLs de CDNs para HTTPS
3. Use URLs relativas quando possível

### Problema: Certificado expirado

**Solução:**
1. Para Let's Encrypt, configure renovação automática:
   ```bash
   sudo certbot renew
   ```
2. Configure cron job para renovação:
   ```bash
   sudo crontab -e
   # Adicionar: 0 0 * * * certbot renew --quiet
   ```

### Problema: Erro de SSL_PROTOCOL_ERROR

**Solução:**
1. Limpe cache do navegador
2. Verifique configuração de portas (443 para HTTPS)
3. Verifique firewall não está bloqueando porta 443

## Manutenção

### Renovação de Certificados
- Let's Encrypt: Renovação automática a cada 90 dias
- Certbot cria cron job automaticamente
- Teste renovação: `sudo certbot renew --dry-run`

### Monitoramento
- Configure alertas para expiração de certificado (30 dias antes)
- Monitore logs de acesso para detectar problemas
- Execute SSL Labs test mensalmente

### Backup
- Backup de certificados: `/etc/letsencrypt/`
- Backup de configurações do servidor
- Documente todas as alterações

## Recursos Adicionais

- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Certbot Documentation](https://certbot.eff.org/docs/)
- [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/)
- [SSL Labs](https://www.ssllabs.com/ssltest/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)

## Segurança Adicional

### Headers de Segurança Recomendados
Já implementados no `index.html`:
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: no-referrer`

Para adicionar no servidor:
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `X-Frame-Options: DENY`
- `Content-Security-Policy: default-src 'self'`

### HSTS (HTTP Strict Transport Security)
Force navegadores a usar HTTPS:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

Para incluir no HSTS Preload List: https://hstspreload.org/

## Conclusão

Com HTTPS configurado corretamente:
- ✅ Dados dos usuários protegidos
- ✅ Confiança e credibilidade aumentadas
- ✅ Melhor SEO e desempenho
- ✅ Conformidade com padrões modernos
- ✅ Proteção contra ataques man-in-the-middle

**Progresso: 5/5** ✅
- [x] Obter certificado SSL (Let's Encrypt)
- [x] Configurar servidor para HTTPS
- [x] Testar conexão HTTPS
- [x] Redirecionar HTTP para HTTPS
- [x] Verificar segurança com SSL Labs
