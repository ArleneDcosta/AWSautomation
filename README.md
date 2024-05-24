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

json
Copy code
{
  "queryStringParameters": {
    "bucket": "$input.params('bucket')",
    "key": "$input.params('key')"
  }
}
Deploy the API:

In the left-hand pane, click on "Actions" and select "Deploy API".
Create a new deployment stage (e.g., dev).
Click on "Deploy".
Testing the API
Invoke the API:

Use a tool like curl, Postman, or your browser to send a request to the API endpoint.
Example request URL:

