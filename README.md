# How to Run the Backend and Frontend Locally

Clone this repository by using the command

`git clone https://github.com/extiyan/todolistapp.git`

## Backend

### Create AWS Services

- DynamoDB Table

  - `Go to AWS DynamoDB Console → DynamoDB Console`
  - `Click "Create table"`
  - `Enter Table Name (e.g., ToDoTable)`
  - `Set Primary Key (Partition Key):`
  - `Name: id`
  - `Type: String`
  - `Set Capacity Mode:`
  - `Choose On-Demand (Recommended)`
  - `OR Provisioned (set Read & Write capacity manually)`
  - `Click "Create table"`
  - `Once created, go to Items → Click "Create item" to add test data.`

- API Gateway

  #### Step 1: Create a New API

        -   `Go to AWS API Gateway Console → API Gateway`
        -   `Click Create API`
        -   `Select "REST API" → Click Build`
        -   `Choose "Regional" for deployment`
        -   `Set API Name (e.g., ToDoAPI)`
        -   `Click Create API`

  - Open cloned repository in VS Code
  - Navigate to your backend project directory
    `cd backend`

- Once inside the backend folder, install dependencies by running
  `npm install`
- After installation of the dependencies, create a deployment package (ZIP).
  `zip -r lambda_function.zip . -x "*.git*" "*.DS_Store" "node_modules/aws-sdk/*"`
- Upload ZIP to AWS Lambda.
  `Go to AWS Lambda Console → AWS Lambda`
  `Click Create Function (or select an existing one)`
  `Choose "Author from Scratch"`
  `Set:`
  `Runtime: Node.js`
  `Handler: index.handler (or your file)`
  `Under Code Source, upload the lambda_function.zip`
  `Click Deploy`
- Test the function by clicking "Test" and providing an event.

  This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
