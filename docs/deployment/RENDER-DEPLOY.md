# Deploy no Render - Guia Rápido

## ✅ Problema Resolvido

O erro `error: failed to solve: failed to read dockerfile: open Dockerfile: no such file or directory` foi corrigido.

## 📦 Arquivos Adicionados

1. **Dockerfile** - Configuração Docker usando nginx:alpine para servir os arquivos estáticos
2. **render.yaml** - Configuração do Render para deploy automático
3. **.dockerignore** - Otimização do build Docker

## 🚀 Como Fazer Deploy no Render

### Opção 1: Deploy Automático (Recomendado)

1. Acesse [https://render.com](https://render.com) e faça login
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório GitHub `taukkunen1/fitness-tracker`
4. Render detectará automaticamente o `render.yaml`
5. Clique em "Create Web Service"
6. Aguarde o build e deploy (2-5 minutos)

### Opção 2: Deploy Manual

1. Acesse [https://render.com](https://render.com)
2. Clique em "New +" → "Web Service"
3. Conecte o repositório
4. Configure:
   - **Name**: fitness-tracker
   - **Environment**: Docker
   - **Plan**: Free
   - **Branch**: main (ou a branch desejada)
5. Clique em "Create Web Service"

## 🔍 Verificação

Após o deploy, seu site estará disponível em:
```
https://fitness-tracker-XXXX.onrender.com
```

O Render fornecerá a URL exata após o primeiro deploy.

## 🔄 Atualizações Automáticas

Com o `render.yaml` configurado com `autoDeploy: true`, qualquer push para a branch principal fará deploy automático.

## 📝 Notas Técnicas

- **Servidor Web**: nginx (Alpine Linux)
- **Porta**: 80 (exposta automaticamente pelo Render)
- **Health Check**: Configurado em `/` (página inicial)
- **Tipo de Build**: Docker
- **Plano**: Free (pode ser alterado depois)

## 🐛 Troubleshooting

### Build falha no Render
- Verifique se o Dockerfile está na raiz do repositório
- Confirme que o render.yaml está na raiz
- Verifique os logs de build no dashboard do Render

### Site não carrega
- Aguarde alguns minutos para o primeiro deploy
- Verifique se o serviço está "Running" no dashboard
- Tente acessar via HTTPS (não HTTP)

## 💡 Diferenças do GitHub Pages

| Característica | GitHub Pages | Render |
|---|---|---|
| Configuração | Automática | Requer Dockerfile |
| URL | github.io | onrender.com |
| HTTPS | Automático | Automático |
| Custo | Grátis | Grátis (com limites) |
| Build Time | Instantâneo | 2-5 minutos |

---

**Criado em**: 2025-11-15  
**Status**: ✅ Pronto para deploy
