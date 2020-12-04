# recipeapp20

## Folder structure
-All pages are found in the 'views' folder
-All external CSS stylesheets are put in the 'public/css' folder
-All external Javascript files are put in the 'public/js' folder

## How to add an external javascript file to an .ejs page
To include external .js files in one of the pages do the following:
1. Say the file you want to include in a page is called externalJavascript.js
2. Put externalJavascript.js in the 'public/js' folder
3. Then go to the 'views/partials' folder
4. Create a new file. Call it externalJavascriptFooter.ejs (the name doesn't really matter)
5. In this new file, post the html script tag: \
  `<script language="text/javascript" src="js/externalJavascript.js"></script> `
    - (note that you must include js in the path before the file name)
6. Now go to the 'views' folder and find the page you want to include externalJavascript.js in
7. Scroll to the bottom of the page, and insert the following right before the **closing** </body> tag: \
  `<% include partials/recipeObjectFooter %>`
  
  so the bottom of the page should look like
  
  //html stuff here \
  `<% include partials/recipeObjectFooter %>`
  `</body>`
  `</html>`
  
