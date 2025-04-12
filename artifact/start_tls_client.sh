#!/bin/bash

echo "=== Starting TLS Client to connect to 127.0.0.1:9000 ==="

# Check for required certificate files
for file in client.crt.pem client.keypair.pem root.crt.pem; do
  if [[ ! -f "$file" ]]; then
    echo "Missing required file: $file"
    exit 1
  fi
done

# Start OpenSSL client
sudo openssl s_client \
  -tls1_2 \
  -verify 10 \
  -verify_return_error \
  -connect 127.0.0.1:9000 \
  -cert client.crt.pem \
  -key client.keypair.pem \
  -CApath . \
  -CAfile root.crt.pem \
  -msg \
  -debug \
  -tlsextdebug
