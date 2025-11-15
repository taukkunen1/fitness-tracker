# Use nginx alpine for a lightweight static file server
FROM nginx:alpine

# Copy the HTML file and any other static assets to nginx html directory
COPY index.html /usr/share/nginx/html/
COPY LICENSE /usr/share/nginx/html/
COPY README.md /usr/share/nginx/html/

# Copy documentation if needed (optional)
COPY docs /usr/share/nginx/html/docs/

# Remove default nginx config and copy custom nginx configuration with security headers
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx-docker.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
