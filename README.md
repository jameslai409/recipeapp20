# recipeapp20

All pages found in 'views' folder
-to include external .js files in one of the pages do the following:
  -say the file you want to include in a page is called externalJavascript.js
  -put externalJavascript.js in the 'public/js' folder
  -then go to 'views/partials' folder
  -create a new file 
  -call it externalJavascriptFooter.ejs (the name doesn't really matter)
  -in this new file, post the html script tag: 
    <script language="text/javascript" src="js/externalJavascript.js"></script> 
    (note that you must include js in the path before the file name)
  -now go to the 'views' folder and find the page you want to include externalJavascript.js in
  -scroll to the bottom of the page, and insert the following right before the *closing* </body> tag:
  <% include partials/recipeObjectFooter %>
  
  so the bottom of the page should look like
  
  //html stuff here
  //html stuff here
  <% include partials/recipeObjectFooter %>
  </body>
  </html>
  
