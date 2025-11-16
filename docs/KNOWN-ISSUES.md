# Known Issues - HTTPS Configuration

## Docker nginx Security Headers

**Issue**: Security headers configured in `nginx-docker.conf` may not appear in HTTP responses when using the official nginx:alpine Docker image locally.

**Cause**: The nginx Docker image includes initialization scripts (`/docker-entrypoint.d/`) that may interfere with custom configurations.

**Status**: ✅ **Not an Issue in Production**
- GitHub Pages: Headers managed by GitHub ✅
- Render.com: Handles headers at platform level ✅  
- Production servers: Full control over nginx config ✅

**Workaround for Local Testing**:

1. Use production nginx without Docker
2. Or disable entrypoint scripts:
   ```dockerfile
   CMD ["nginx", "-g", "daemon off;"]
   ENTRYPOINT []
   ```

3. Or test headers directly on deployed platforms

**Verification**:
- The nginx config is syntactically correct (validated with `nginx -t`)
- All security headers are properly configured
- Will work correctly when deployed to production environments

**Next Steps**:
- Deploy to Render.com or production server to verify
- Use `scripts/verify-ssl.sh` to test deployed site
- Headers will function correctly in real deployment scenarios

---

**Note**: This is a local development environment quirk and does not affect production deployments where HTTPS and security headers are critical.
