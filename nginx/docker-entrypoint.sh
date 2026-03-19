#!/bin/sh
set -e

# Wire HSTS toggle from SECURITY_HSTS_ENABLED environment variable
if [ "$SECURITY_HSTS_ENABLED" = "true" ]; then
  echo 'add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;' \
    > /etc/nginx/conf.d/hsts.conf
  echo "HSTS: enabled (max-age=31536000; includeSubDomains; preload)"
else
  echo "# HSTS disabled via SECURITY_HSTS_ENABLED env var" > /etc/nginx/conf.d/hsts.conf
  echo "HSTS: disabled"
fi

# Substitute environment variables in nginx config template
envsubst '${NGINX_HOST}' < /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf

# Execute the original CMD
exec "$@"
