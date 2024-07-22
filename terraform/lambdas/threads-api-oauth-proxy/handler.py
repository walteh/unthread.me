import json
import os
import urllib3
import boto3
import urllib


http = urllib3.PoolManager()
secrets_client = boto3.client('secretsmanager')

class Secret:
    def __init__(self, client_id: str, client_secret: str, redirect_uri: str):
        self.client_id = client_id
        self.client_secret = client_secret
        self.redirect_uri = redirect_uri

cached_secret: Secret | None = None

def get_secret() -> Secret:
    global cached_secret
    if cached_secret:
        return cached_secret
    response = secrets_client.get_secret_value(SecretId=os.environ['THREADS_API_SECRET_NAME'])
    secret = json.loads(response['SecretString'])
    cached_secret = Secret(
        client_id=secret['client_id'],
        client_secret=secret['client_secret'],
        redirect_uri=secret['redirect_uri']
    )
    return  cached_secret


def lambda_handler(event: dict, context: dict) -> dict:
    if event['queryStringParameters']:
        code = event['queryStringParameters'].get('code')
        short_lived_token = event['queryStringParameters'].get('short_lived_token')
    else:
        code = None
        short_lived_token = None

    if code and short_lived_token:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Authorization code and short lived token are mutually exclusive"})
        }
    elif code:
        return generate_short_lived_token(code)
    elif short_lived_token:
        return handle_short_lived_token(short_lived_token)
    else:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Authorization code or short lived token is missing"})
        }



def generate_short_lived_token(code: str) -> dict:

    if not code:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Authorization code is missing"})
        }

    secret = get_secret()

    # Constructing the payload for the Threads API request
    params = urllib.parse.urlencode({
        'client_id': secret.client_id,
        'client_secret': secret.client_secret,
        'code': code,
        'grant_type': "authorization_code",
        'redirect_uri': secret.redirect_uri
    })

    url = f'https://graph.threads.net/oauth/access_token?{params}'
    
    print(f"Requesting access token from {url}".replace(secret.client_secret, '*****').replace(code, '*****'))
    # Making the request to the Threads API
    response = http.request(
        'POST', 
        url,        
        headers={'Content-Type': 'application/x-www-form-urlencoded'}
    )

    if response.status != 200:
        print(response.status)
        print(response.data.decode('utf-8'))

    # Checking for successful response
    return {
        "statusCode": response.status,
        "body": response.data.decode('utf-8')
    }


def handle_short_lived_token(short_lived_token: str) -> dict:

    if not short_lived_token:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Short lived token is missing"})
        }

    secret = get_secret()

    # Constructing the payload for the Threads API request
    params = urllib.parse.urlencode({
        'client_secret': secret.client_secret,
        'grant_type': "th_exchange_token",
        'access_token': short_lived_token
    })

    url = f'https://graph.threads.net/access_token?{params}'

    print(f"Requesting long lived access token from {url}".replace(secret.client_secret, '*****').replace(short_lived_token, '*****'))

    # Making the request to the Threads API

    response = http.request(
        'GET', 
        url,        
        headers={'Content-Type': 'application/x-www-form-urlencoded'}
    )

    # Checking for successful response

    if response.status != 200:
        print(response.status)
        print(response.data.decode('utf-8'))
    
    
    return {
            "statusCode": response.status,
            "body": response.data.decode('utf-8')
        }
