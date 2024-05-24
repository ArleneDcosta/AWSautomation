import json
import boto3
from botocore.exceptions import ClientError
from nanoid import generate

s3_client = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    # Extract bucket name and key from the API Gateway event
    try:
        bucket_name = event['queryStringParameters']['bucket']
        key = event['queryStringParameters']['key']
    except KeyError:
        return {
            'statusCode': 400,
            'body': json.dumps('Error: Missing required query parameters')
        }
    
    # Generate a unique fileId using nanoid
    id = generate()

    # Read file from S3
    try:
        s3_object = s3_client.get_object(Bucket=bucket_name, Key=key)
        file_content = s3_object['Body'].read().decode('utf-8')
    except ClientError as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error reading file from S3: {e}')
        }
    
    # Store S3 path in DynamoDB
    table = dynamodb.Table('FileTable')
    try:
        table.put_item(
            Item={
                'id': id,
                'input_text': f's3://{bucket_name}/{key}',
                'input_file_path': file_content  # Optional: storing file content
            }
        )
    except ClientError as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error storing item in DynamoDB: {e}')
        }
    
    return {
        'statusCode': 200,
        'body': json.dumps(f'Successfully stored S3 path in DynamoDB for fileId {id}')
    }
