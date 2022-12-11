Running through azure cdn(classic): https://fangsbuilder.azureedge.net  
The actual storage account's $web: https://prodstafangsbuilder.z6.web.core.windows.net/

Currently being rewritten here: https://github.com/nichitacebotari0/FangsBuilder-ng .With desire to add features involving backend: https://github.com/nichitacebotari0/api , specifically: auth using discord Fangs Server Roles(done),  persisting builds, voting on builds(see which builds are good), add guides and potentially automatically list all guides for a particular build as youre making that build in the editor(use the build editor like a search engine), and other interesing ideas

# Features:
Browse to particular hero using solid-router. Create a build for that hero which is encoded into a string and written as a querystring param into the link. Link is shareable, pasting it in will show the same build again, meaning you can share your build with others. Implementation is purely front end, hosted in an azure storage container, served through azure CDN(Microsoft Classic).
 

Deployment using Github Actions to Azure storage container created with terraform.  

## Stuff done manually:  
1. Created Service principal using az ad sp create-for-rbac with  contributor role for subscription  
2. Assigned him storage blob data contributorrole for the resource group  
3. In case I want to delete a dir:  az storage blob directory delete --account-name accountname --container-name '$web' --directory-path Heroes --recursive  
    Annoying because you need to use a --marker for subsequent calls until it finishes deleting everything  
4. Upload static files folders one by one to storage account using az cli  
    A) for single file: az storage blob upload -c '$web' --account-name accountname -f .\Heroes\Hero\filename.json  -n Heroes\Hero\filename.json  --overwrite  
    B) for bunch: az storage blob upload-batch --source .\Heroes --account-name prodstafangsbuilder --destination '$web' --destination-path \Heroes  
