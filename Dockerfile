# Use nginx alpine for a lightweight static file server
FROM nginx:alpine

# Copy the HTML file and any other static assets to nginx html directory
COPY index.html /usr/share/nginx/html/
COPY LICENSE /usr/share/nginx/html/
COPY README.md /usr/share/nginx/html/

# Copy documentation if needed (optional)
COPY docs /usr/share/nginx/html/docs/

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
