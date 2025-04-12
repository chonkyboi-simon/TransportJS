#!/bin/bash

echo "=== TLS Certificate Generator ==="

# Prompt for subject fields
read -p "Country (C) [default: au]: " C
C=${C:-au}
read -p "State (ST) [default: vic]: " ST
ST=${ST:-vic}
read -p "Locality (L) [default: mel]: " L
L=${L:-mel}
read -p "Organization (O) [default: org]: " O
O=${O:-org}
read -p "Organizational Unit (OU) [default: unit]: " OU
OU=${OU:-unit}

# Generate Root Key Pair
echo "Generating root RSA key..."
openssl genrsa -out root.keypair.pem 2048

# Optionally display root key
read -p "Do you want to display the root private key details? (y/n): " showkey
if [[ "$showkey" == "y" || "$showkey" == "Y" ]]; then
  openssl rsa -in root.keypair.pem -text -noout
fi

# Extract Public Key
echo "Extracting root public key..."
openssl rsa -in root.keypair.pem -outform PEM -pubout -out root.public.pem

# Create Self-signed Root Certificate
echo "Generating root certificate..."
openssl req -x509 -new -nodes -key root.keypair.pem -sha256 -days 365 -out root.crt.pem \
  -subj "/C=$C/ST=$ST/L=$L/O=$O/OU=$OU/CN=root"

# Server Key and Certificate
echo "Generating server key..."
openssl genrsa -out server.keypair.pem 2048

echo "Generating server CSR..."
openssl req -new -key server.keypair.pem -out server.csr \
  -subj "/C=$C/ST=$ST/L=$L/O=$O/OU=$OU/CN=server"

echo "Signing server certificate with root CA..."
openssl x509 -req -in server.csr -CA root.crt.pem -CAkey root.keypair.pem \
  -CAcreateserial -out server.crt.pem -days 365 -sha256

# Client Key and Certificate
echo "Generating client key..."
openssl genrsa -out client.keypair.pem 2048

echo "Generating client CSR..."
openssl req -new -key client.keypair.pem -out client.csr \
  -subj "/C=$C/ST=$ST/L=$L/O=$O/OU=$OU/CN=client"

echo "Signing client certificate with root CA..."
openssl x509 -req -in client.csr -CA root.crt.pem -CAkey root.keypair.pem \
  -CAcreateserial -out client.crt.pem -days 365 -sha256

echo "=== Done! Certificates and keys are generated in the current directory. ==="
