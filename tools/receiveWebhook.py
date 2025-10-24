#!/usr/bin/python3

# Simple CGI script to receive and verify GitHub webhooks using HMAC SHA256.

import os
import hashlib
import hmac
import sys

def print_headers():
    print("Content-Type: text/plain")
    print("Access-Control-Allow-Origin: *")
    print()


def verify_signature(payload_body, secret_token, signature_header):
    """Verify that the payload was sent from GitHub by validating SHA256.

    Raise and return 403 if not authorized.

    Args:
        payload_body: original request body to verify (request.body())
        secret_token: GitHub app webhook token (WEBHOOK_SECRET)
        signature_header: header received from GitHub (x-hub-signature-256)
    """
    if not signature_header:
        raise Exception("x-hub-signature-256 header is missing!")
    hash_object = hmac.new(secret_token.encode('utf-8'), msg=payload_body, digestmod=hashlib.sha256)
    expected_signature = "sha256=" + hash_object.hexdigest()
    if not hmac.compare_digest(expected_signature, signature_header):
        raise Exception("Request signatures didn't match!")


print_headers()

if os.environ.get("REQUEST_METHOD") != "POST":
    print("This endpoint only accepts POST requests.")
    exit(1)



secret_token = 'TOKEN' # Replace 'TOKEN' with your actual webhook secret token
signature_header = os.environ.get("HTTP_X_HUB_SIGNATURE_256", "")
content_length = int(os.environ.get("CONTENT_LENGTH", 0))
payload_body = sys.stdin.read(content_length).encode('utf-8')

try:
    verify_signature(payload_body, secret_token, signature_header)
    print("Webhook received and verified successfully.")
except Exception as e:
    print(str(e))
    exit(1)




