### Detailed Guide to Automate Script Run from local to EC2 instance

Precreate roles and provide appropriate permissions to the role.
Also create Object key in 

Step 1: Create a local Lambda layer for Nanoid or any python library locally
Zip and create a deplopment package 
Upload the package to AWS Lambda


Step 2: Create a Lambda function

Step 3: Create API Gateway (Steps mentioned below)

Step 4: Create a Table in DynamoDB 

### Detailed Guide to create IAM Role:

Step 1: Create or Identify the IAM Role
`Create a New IAM Role (if you don't have one already):
    `
    Go to the IAM console: IAM Console.
    Click on "Roles" in the left-hand menu.
    Click on the "Create role" button.
    Choose the "AWS service" as the trusted entity and select "Lambda".
    Click "Next: Permissions".
    Attach the Necessary Policies:`

You can attach managed policies directly or create a custom policy if more specific permissions are needed.
Step 1.1: Attach Managed Policies
    AmazonS3ReadOnlyAccess: This provides read-only access to S3.
    AmazonDynamoDBFullAccess: This provides full access to DynamoDB.
    To attach these policies:

    In the search box, type AmazonS3ReadOnlyAccess and check the box next to it.
    In the search box, type AmazonDynamoDBFullAccess and check the box next to it.
    Click "Next: Tags" (you can skip adding tags).
    Click "Next: Review".

Step 1.2: Create and Attach a Custom Policy (for more granular control)
    If you need more granular control over the permissions, you can create a custom policy:

    Create a Custom Policy:

        Go to the IAM console and click on "Policies" in the left-hand menu.

        Click on "Create policy".

        Choose the "JSON" tab and paste the following policy:


        {
        "Version": "2012-10-17",
        "Statement": [
            {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::YOUR_BUCKET_NAME",
                "arn:aws:s3:::YOUR_BUCKET_NAME/*"
            ]
            },
            {
            "Effect": "Allow",
            "Action": [
                "dynamodb:PutItem",
                "dynamodb:GetItem",
                "dynamodb:UpdateItem",
                "dynamodb:Scan",
                "dynamodb:Query"
            ],
            "Resource": "arn:aws:dynamodb:YOUR_REGION:YOUR_ACCOUNT_ID:table/FileTable"
            }
        ]
        }
    Replace YOUR_BUCKET_NAME, YOUR_REGION, YOUR_ACCOUNT_ID, and FileTable with your actual bucket name, region, AWS account ID, and DynamoDB table name, respectively.

    Click "Review policy".

    Provide a name for the policy (e.g., LambdaS3DynamoDBPolicy) and click "Create policy".

    Attach the Custom Policy to Your Lambda Role:

    Go back to the IAM console and click on "Roles".
    Find and click on the role you created (e.g., LambdaS3DynamoDBRole).
    Click on the "Attach policies" button.
    Search for the custom policy you just created (LambdaS3DynamoDBPolicy).
    Check the box next to the policy and click "Attach policy".

Step 2: Attach the IAM Role to Your Lambda Function
    Go to the Lambda Console: Lambda Console.
    Find Your Lambda Function: Click on your Lambda function to open its configuration page.
    Configure the Function’s Execution Role:
    In the "Configuration" tab, click on "Permissions".
    Under "Execution role", click "Edit".
    Select the role you created (LambdaS3DynamoDBRole).
    Click "Save".
    Example IAM Policies
    Here's a summary of the managed and custom policies you may need:

AmazonS3ReadOnlyAccess:

Copy code
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::YOUR_BUCKET_NAME",
        "arn:aws:s3:::YOUR_BUCKET_NAME/*"
      ]
    }
  ]
}
Custom DynamoDB Policy:

json
Copy code
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:UpdateItem",
        "dynamodb:Scan",
        "dynamodb:Query"
      ],
      "Resource": "arn:aws:dynamodb:YOUR_REGION:YOUR_ACCOUNT_ID:table/FileTable"
    }
  ]
}
Replace placeholders with your actual values. After following these steps, your Lambda function should have the necessary permissions to interact with both S3 and DynamoDB.

### Detailed Guide to Configure API Gateway with Query Parameters


Step 1: Create a New API in API Gateway
    Open the API Gateway Console: Go to the API Gateway console.
Create a New REST API:
    Click on "Create API".
Choose "REST API" and click "Build".
    Enter a name for your API (e.g., S3ToDynamoDBAPI) and a description.
Click on "Create API".
Step 2: Create a Resource and Method

Create a New Resource:

    In the left-hand pane, select "Resources".
    Click on "Actions" and choose "Create Resource".
    Enter a resource name (e.g., files) and a resource path (e.g., /files).
    Click "Create Resource".
    Create a New Method:

    Select the resource you just created (e.g., /files).
    Click on "Actions" and choose "Create Method".
    Select POST from the dropdown and click on the checkmark.
Step 3: Configure the Method
    Set Integration Type:

    In the "Setup" section for the POST method, choose "Lambda Function".
    Select your region.
    Enter the name of your Lambda function.
    Click on "Save". Confirm the necessary permissions when prompted.
    Set Up Method Request:

    Click on "Method Request".
    Under "URL Query String Parameters", click on "Add query string".
    Add the required query parameters:
    bucket: Required
    key: Required
Set Up Integration Request:

    Go back to the POST method and click on "Integration Request".
    Under "Mapping Templates", expand "Request Body Passthrough" and click on "Add mapping template".
    Enter application/json as the Content-Type.
    Confirm when prompted to "Create a new mapping template".
    Edit the Mapping Template:

    In the template editor, map the query parameters to the Lambda event. Example template:

    Copy code
    {
    "queryStringParameters": {
        "bucket": "$input.params('bucket')",
        "key": "$input.params('key')"
    }
    }
Step 4: Deploy the API:

    In the left-hand pane, click on "Actions" and select "Deploy API".
    Create a new deployment stage (e.g., dev).
    Click on "Deploy".
    Testing the API
    Invoke the API:

    Use a tool like curl, Postman, or your browser to send a request to the API endpoint.
    Example request URL: https://your-api-id.execute-api.your-region.amazonaws.com/dev/files?bucket=your-bucket-name&key=your-file-key

