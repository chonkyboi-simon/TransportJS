#!/bin/bash

echo "=== Starting TLS Server on port 80 ==="

# Check for required certificate files
for file in server.crt.pem server.keypair.pem root.crt.pem; do
  if [[ ! -f "$file" ]]; then
    echo "Missing required file: $file"
    exit 1
  fi
done

# Start OpenSSL server
sudo openssl s_server \
  -tls1_2 \
  -accept 80 \
  -verify 10 \
  -verify_return_error \
  -cert server.crt.pem \
  -key server.keypair.pem \
  -CApath . \
  -CAfile root.crt.pem \
  -msg \
  -debug \
  -tlsextdebug
