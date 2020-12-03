const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://demouser:demouser123@cluster0.cetrw.mongodb.net/textbooks?retryWrites=true&w=majority";

  MongoClient.connect(url, function(err, db) {
  if(err) { return console.log(err); return;}
  
    var dbo = db.db("textbooks");
	var collection = dbo.collection('bks');
	
	console.log("Success!");
    db.close();
    
    /*
        you can do
        coll.find().toArray(function(err, items) {
            if (err) {
                console.log("Error: " + err);
            }
            else {
                console.log("Items: ");
                for (let i = 0; i < items.length; i++) {
                    console.log(i + ": " + items[i.title or whatever   );
                }
            }
        })
        --------------------------------
            TO INSERT
            --------------------------
        var newData = {"title": "Who did this", "author": "whoever"};
        collection.insertOne(newData, function(err, res) {
            if (err) {
                throw err;
            }
            console.log("new document inserted");
        });

        --------------
            TO DELETE
        -------------
        var theQuery = { title: /^Who/ };
        collection.deleteMany(theQuery, function(err, res) {
            
        });
    */
 
});
