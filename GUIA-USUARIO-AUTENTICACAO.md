# 📖 Guia do Usuário - Sistema de Autenticação

## Bem-vindo ao Fitness Tracker Pro!

Este guia explica como usar o novo sistema de autenticação seguro implementado em 2025.

## 🎯 Primeiros Passos

### 1. Criar sua Conta

1. Acesse a página inicial do Fitness Tracker Pro
2. Clique na aba **"Registrar"**
3. Preencha os campos:
   - **Nome de usuário**: 3-20 caracteres (letras, números, underscore)
   - **Email**: Seu endereço de email válido
   - **Senha**: Crie uma senha forte (veja requisitos abaixo)
   - **Confirmar senha**: Digite a mesma senha novamente
4. Clique em **"✨ Criar Conta"**
5. Aguarde a mensagem de sucesso
6. Você será automaticamente redirecionado para o login

### 2. Requisitos de Senha Forte

Para sua segurança, sua senha deve ter:

- ✅ **Mínimo 8 caracteres**
- ✅ **Pelo menos 1 letra MAIÚSCULA** (A-Z)
- ✅ **Pelo menos 1 letra minúscula** (a-z)
- ✅ **Pelo menos 1 número** (0-9)
- ✅ **Pelo menos 1 caractere especial** (!@#$%^&*(),.?":{}|<>)

**Exemplos de senhas válidas:**
- `Fitness@2025`
- `Treino#123Strong`
- `Saude$Mais1`

**Exemplos de senhas inválidas:**
- `treino123` (falta maiúscula e caractere especial)
- `TREINO123` (falta minúscula e caractere especial)
- `Treino!` (menos de 8 caracteres)

💡 **Dica**: O sistema mostra em tempo real quais requisitos você já atendeu!

### 3. Fazer Login

1. Na página inicial, vá para a aba **"Entrar"**
2. Digite seu **nome de usuário**
3. Digite sua **senha**
4. Clique em **"🔐 Entrar"**
5. Você será direcionado para o dashboard

### 4. Seus Perfis

Após o login, você verá:
- **Perfis existentes** (Pedro e Valentina) já linkados à sua conta
- Todas as funcionalidades do sistema disponíveis
- Seu nome de usuário e email no cabeçalho

## 🔐 Segurança da sua Conta

### Proteção de Senha

Sua senha é protegida por:
- **Criptografia PBKDF2** com 100.000 iterações
- **Salt único** para cada usuário
- **Nunca armazenada em texto plano**

### Proteção contra Ataques

O sistema protege você contra:
- **Tentativas de força bruta**: Após 5 tentativas falhas, sua conta é bloqueada por 15 minutos
- **Rate limiting**: Máximo de 10 tentativas por minuto
- **XSS**: Todos os inputs são sanitizados
- **Session hijacking**: Tokens seguros com expiração

### Bloqueio de Conta

Se você errar a senha 5 vezes:
- ⏱️ Sua conta será bloqueada por **15 minutos**
- 📧 Uma mensagem informará o tempo restante
- 🔓 Após o período, você pode tentar novamente

**Dica**: Se esqueceu sua senha, aguarde o bloqueio expirar e tente novamente com cuidado.

## 📱 Uso Diário

### Navegação Autenticada

Após o login, você tem acesso a todas as funcionalidades:

1. **📊 Dashboard**: Visão geral de suas métricas
2. **🏋️ Treinos**: Registre e acompanhe seus treinos
3. **💪 Exercícios**: Histórico detalhado por exercício
4. **📸 Fotos**: Suas fotos de progresso
5. **🍎 Nutrição**: Planos nutricionais personalizados
6. **🍲 Alimentação**: Registro de refeições
7. **📈 Evolução**: Gráficos de progresso
8. **⚖️ Comparação**: Compare suas métricas
9. **🔬 Ciência**: Referências científicas

### Gerenciar Perfis

- **Trocar perfil**: Clique nos botões Pedro/Valentina
- **Adicionar perfil**: Clique em "➕ Novo Perfil"
- **Remover perfil**: Clique no botão "🗄️" (move para arquivo)

### Fazer Logout

1. Clique no botão **"🚪 Sair"** no canto superior direito
2. Confirme que deseja sair
3. Você será desconectado e redirecionado para a tela de login

**Importante**: Sempre faça logout ao usar computadores compartilhados!

## 🔄 Sessões

### Duração da Sessão

- ⏱️ Sua sessão dura **24 horas**
- 🔄 Após 24 horas, você precisará fazer login novamente
- 💾 Seus dados permanecem salvos localmente

### Múltiplas Abas

- ✅ Você pode usar o sistema em várias abas do mesmo navegador
- ✅ O login em uma aba vale para todas
- ✅ O logout em uma aba desconecta todas

### Múltiplos Dispositivos

- ⚠️ Cada navegador/dispositivo precisa de login separado
- 💾 Os dados são salvos localmente em cada dispositivo
- 🔄 Use a função de backup para sincronizar (futura)

## 💾 Seus Dados

### Armazenamento Local

- 🏠 **100% local**: Dados armazenados apenas no seu navegador
- 🔒 **Privacidade**: Nenhuma informação enviada para servidores
- 💻 **IndexedDB**: Banco de dados local do navegador

### O que é Salvo

- ✅ Suas credenciais de login (criptografadas)
- ✅ Seus perfis de fitness (Pedro, Valentina, etc.)
- ✅ Histórico de treinos e refeições
- ✅ Fotos de progresso
- ✅ Métricas corporais

### Backup de Dados

**Importante**: Limpar o cache do navegador apaga seus dados!

**Como fazer backup**:
1. Vá para a aba "📈 Evolução"
2. Clique em "💾 Backup DB"
3. Salve o arquivo JSON em local seguro

**Como restaurar**:
1. Importe o arquivo JSON de backup
2. Seus dados serão restaurados

## ❓ Problemas Comuns

### Esqueci minha senha

**Solução atual**:
1. Aguarde 15 minutos após tentativas falhas
2. Tente novamente com cuidado
3. Dica: Use um gerenciador de senhas

**Em desenvolvimento**: Sistema de recuperação de senha

### Conta bloqueada

**Por que acontece**: 5 tentativas de login incorretas

**Solução**:
1. Aguarde **15 minutos**
2. A mensagem mostra o tempo restante
3. Após o bloqueio, tente novamente

### Não consigo registrar

**Possíveis causas**:
- ❌ Username já existe → Escolha outro
- ❌ Email já cadastrado → Use outro email
- ❌ Senha fraca → Siga os requisitos
- ❌ Muitas tentativas → Aguarde 1 minuto

### Desconectado automaticamente

**Por que acontece**: Sessão de 24h expirou

**Solução**:
1. Faça login novamente
2. Seus dados estão seguros e salvos

### Erro ao criar conta

**Verifique**:
- ✅ Username tem 3-20 caracteres (letras, números, _)
- ✅ Email é válido
- ✅ Senha atende todos os requisitos
- ✅ Confirmação de senha está correta
- ✅ Não está fazendo muitas tentativas seguidas

## 🛡️ Dicas de Segurança

### Criando uma Senha Forte

✅ **BOM**:
- Use uma frase memorável: `MeuTreino#2025@Forte`
- Combine palavras não relacionadas: `Abacaxi$Guitarra7`
- Use um gerenciador de senhas

❌ **EVITE**:
- Senhas óbvias: `Senha123!`, `Admin@123`
- Informações pessoais: `Maria1990!`, `JoaoPaulo#`
- Sequências: `Abcd1234!`, `Qwerty@1`

### Protegendo sua Conta

1. **Nunca compartilhe** sua senha com ninguém
2. **Use senha única** para cada site/serviço
3. **Faça logout** em computadores compartilhados
4. **Mantenha backup** dos seus dados
5. **Verifique** a URL antes de fazer login

### Usando o Sistema com Segurança

- 🏠 Prefira usar em dispositivos pessoais
- 🔒 Evite redes Wi-Fi públicas para login
- 👀 Não deixe o sistema aberto sem supervisão
- 💾 Faça backups regulares
- 🔄 Atualize o navegador regularmente

## 📞 Suporte

### Precisa de Ajuda?

- 📖 Leia a [documentação completa](./SECURITY.md)
- 🐛 Reporte bugs via [GitHub Issues](https://github.com/taukkunen1/fitness-tracker/issues)
- 💬 Entre em contato com o desenvolvedor

### Reportar Problema de Segurança

Se encontrou uma vulnerabilidade:
1. **NÃO** publique publicamente
2. Reporte via GitHub Issues (marcado como "security")
3. Aguarde resposta em até 48 horas
4. Divulgação responsável (90 dias)

## 🎯 Recursos Futuros

Em desenvolvimento:
- [ ] Recuperação de senha via perguntas de segurança
- [ ] Autenticação de dois fatores (2FA)
- [ ] Sincronização entre dispositivos
- [ ] Exportação/importação de contas
- [ ] Gestão de múltiplas sessões
- [ ] Log de atividades do usuário

## 📊 FAQ - Perguntas Frequentes

**Q: Meus dados estão seguros?**  
A: Sim! Tudo é armazenado localmente no seu navegador. Nenhum dado é enviado para servidores externos.

**Q: Posso usar em vários dispositivos?**  
A: Sim, mas cada dispositivo terá seus próprios dados. Use a função de backup para sincronizar manualmente.

**Q: E se eu esquecer minha senha?**  
A: Atualmente, não há recuperação automática. Certifique-se de lembrar sua senha ou use um gerenciador de senhas.

**Q: Por que 5 tentativas apenas?**  
A: Para proteger sua conta contra tentativas de invasão por força bruta.

**Q: Os dados ficam salvos após logout?**  
A: Sim! Seus dados ficam salvos localmente. O logout apenas encerra a sessão.

**Q: Posso mudar minha senha?**  
A: Funcionalidade em desenvolvimento. Por enquanto, crie uma nova conta se necessário.

**Q: O sistema é offline?**  
A: Sim! Após carregar a página, tudo funciona offline. Apenas CDNs externos (Tailwind, Chart.js) precisam de internet inicial.

**Q: Posso usar sem criar conta?**  
A: Não. A autenticação é obrigatória para acessar o sistema por questões de segurança e privacidade.

## ✨ Começar Agora!

Pronto para começar sua jornada fitness com segurança?

1. 📝 [Crie sua conta](#1-criar-sua-conta)
2. 🔐 [Faça login](#3-fazer-login)
3. 💪 Comece a treinar!

---

**Dúvidas?** Consulte o [Guia de Segurança](./SECURITY.md) completo!

**Última atualização**: 2025-11-05  
**Versão**: 1.0.0
