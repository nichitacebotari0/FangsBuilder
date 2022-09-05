## Available Scripts

In the project directory, you can run:

### `npm dev` or `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>

### `npm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
## Deployment

Deployment using Github Actions to Azure storage container created with terraform.

Stuff done manually: 
1. Created Service principal using az ad sp create-for-rbac with  contributor role for subscription
2. Assigned him storage blob data contributorrole for the resource group
3. Upload static files folders one by one to storage account using:  az storage fs directory upload -f '$web' --account-name prodstafangsbuilder -s ".\Empty.png" --recursive  

