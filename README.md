# 🚶‍♂️ Pilgrim

Sistema de acompanhamento de treino e nutrição baseado em evidências científicas.

## 🌐 Demo

**Acesse:** [https://taukkunen1.github.io/fitness-tracker/](https://taukkunen1.github.io/fitness-tracker/)

## ✨ Funcionalidades

- **Dashboard**: Visualização de métricas (peso, gordura, massa muscular) e progresso
- **Treinos Personalizados**: Programas diferenciados baseados em estudos científicos
- **Planos Nutricionais**: Cálculo calórico e distribuição de macronutrientes
- **Gráficos de Evolução**: Acompanhamento temporal da composição corporal
- **Sistema de Comparação**: Suporte para 2 usuários com métricas lado a lado

## 🛠️ Tecnologias

- JavaScript Vanilla
- Chart.js
- Tailwind CSS
- IndexedDB (armazenamento local)

## 🔐 Privacidade

Todos os dados são armazenados localmente no navegador. Nenhuma informação é enviada para servidores externos.

⚠️ **Atenção**: Limpar dados do navegador apaga o histórico. Faça backups regulares!

## 📚 Documentação

Para documentação detalhada, incluindo guias de administração, performance, deploy e análises, acesse a pasta [`docs/`](docs/).

## 🔒 Segurança

Para informações sobre segurança, consulte o arquivo [`SECURITY.md`](SECURITY.md).

## 📄 Licença

Veja o arquivo `LICENSE` para detalhes.

---

**Disclaimer:** Este sistema é para fins educacionais. Sempre consulte profissionais de saúde antes de iniciar novos programas de exercícios ou dietas.

---

## 🔐 Configuração HTTPS em Produção

### GitHub Pages (github.io)
O GitHub Pages fornece HTTPS automaticamente para domínios `*.github.io`. Nenhuma configuração adicional é necessária.

### Domínio Customizado
Para usar um domínio customizado com HTTPS:

1. **Configurar domínio no GitHub:**
   - Vá em Settings > Pages
   - Em "Custom domain", adicione seu domínio
   - Marque "Enforce HTTPS"

2. **Obter certificado SSL (Let's Encrypt):**
   - O GitHub Pages gera automaticamente certificados Let's Encrypt para domínios customizados
   - O processo leva alguns minutos após configurar o domínio

3. **Configurar DNS:**
   - Adicione registro A ou CNAME apontando para GitHub Pages
   - Para apex domain: registros A para `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Para subdomain: registro CNAME para `<username>.github.io`

4. **Testar conexão HTTPS:**
   ```bash
   curl -I https://seu-dominio.com
   ```

5. **Verificar segurança:**
   - Teste em [SSL Labs](https://www.ssllabs.com/ssltest/)
   - Certificado deve ser válido e com nota A ou A+

### Redirecionamento HTTP → HTTPS
O GitHub Pages redireciona automaticamente HTTP para HTTPS quando "Enforce HTTPS" está habilitado.

Para servidores próprios, adicione no `.htaccess` ou configuração do servidor:
```apache
# Apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

```nginx
# Nginx
server {
    listen 80;
    server_name seu-dominio.com;
    return 301 https://$server_name$request_uri;
}
```
