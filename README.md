# How to Run the Backend and Frontend Locally

Clone this repository by using the command

`git clone https://github.com/extiyan/todolistapp.git`

## Backend

### Create AWS Services
- Lambda
  #### Steps to Upload ZIP File
      1. Navigate to backend project directory
         `cd backend`
      2. Install dependencies
         `npm install`
      3. Create a deployment package (ZIP)
      4. Upload ZIP to AWS Lambda:
         - Go to AWS Lambda Console
         - Click Create Function (or select an existing one)
         - Choose "Author from Scratch"
         - Set:
           - Runtime: Node.js
           - Handler: index.handler (or your file)
         - Under Code Source, upload the lambda_function.zip
         - Click Deploy
      5. Test the function by clicking "Test" and providing an event.

- DynamoDB Table
  
        - Go to AWS DynamoDB Console → DynamoDB Console
        - Click "Create table"
        - Enter Table Name (e.g., ToDoTable)
        - Set Primary Key (Partition Key):
          - Name: id
          - Type: String
        - Set Capacity Mode:
          - Choose On-Demand (Recommended)
          - OR Provisioned (set Read & Write capacity manually)
        - Click "Create table"
        - Once created, go to Items → Click "Create item" to add test data.

- API Gateway
  #### Step 1: Create a New API
        -   Go to AWS API Gateway Console → API Gateway
        -   Click Create API
        -   Select "REST API" → Click Build
        -   Choose "Regional" for deployment
        -   Set API Name (e.g., ToDoAPI)
        -   Click Create API
  
  #### Step 2: Create a New API
        -  In the left panel, select Resources
        -  Click Actions → Create Resource
        -  Set Resource Name: todos
        -  Set Resource Path: /todos
        -  Click Create Resource

  #### Step 3: Create an HTTP Method (GET, POST, PUT, DELETE)
        -  Select the /todos resource
        -  Click Actions → Create Method
        -  Choose GET → Click the checkmark ✅
        -  Integration Type: Choose Lambda Function
        -  Lambda Function Name: YourLambdaFunctionName
        -  Click Save → Click OK when prompted
        -  Repeat for POST, PUT, DELETE methods

   #### Step 4: Enable CORS
        -  Select /todos resource
        -  Click Actions → Enable CORS
        -  Click Enable CORS and Replace Existing CORS Headers

   #### Step 5: Deploy the API
        -  Click Actions → Deploy API
        -  Deployment stage: prod (or create a new stage)
        -  Click Deploy
        -  Copy the Invoke URL (e.g., https://xyz123.execute-api.region.amazonaws.com/prod)

## Frontend

    1. Navigate to backend project directory
       `cd frontend`
    2. Install dependencies
       `npm install`
    3. Open App.js and change API_BASE_URL value to the Invoke URL that you have copied
    4. Run the application by executing the command
       `npm start`

# Deploy Application in AWS S3

#### Step 1: Build React App
    1. Navigate to React project directory
       `cd frontend`
    2. Install dependencies (if not yet installed)
       `npm install`
    3. Build the app for production
       `npm run build`

#### Step 2: Create an S3 Bucket
    1. Go to AWS S3 Console
    2. Click "Create Bucket"
    3. Set Bucket Name: (must be unique, e.g., my-todo-app)
    4. Uncheck "Block all public access" (to allow public access"
    5. Click Create Bucket

#### Step 3: Upload the Static Files
    1. Go to AWS S3 Console
    2. Click on Your Bucket Name
    3. Click Upload
    4. Click "Add files" and select all files inside the build/ folder
    5. Click Upload

#### Step 4: Enable Static Website Hosting
    1. Go to S3 -> Your Bucket -> Properties
    2. Scroll down to Static website hosting
    3. Click Edit -> Enable Static Website Hosting
    4. Set Index document = index.html
    5. Click Save Changes
    6. Copy the Bucket Website Endpoint (this is the website URL)

#### Step 5: Set Permissions for Public Access
    1. Go to Permissions -> Bucket Policy
    2. Add the following policy (replace your-bucket-name)
      `{
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::your-bucket-name/*"
          }
        ]
      }`
    3. Click Save Changes
