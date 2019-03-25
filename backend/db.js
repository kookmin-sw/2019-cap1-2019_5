//To connect DB , must excute mongodb
let fs = require("fs");
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test',{useNewUrlParser: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected!");
});

//define schema
let areaSchema = new mongoose.Schema({
    data : {},
  });


// add method
areaSchema.methods.speaklocation = function () {
    console.log("name :"+this.data.name);
  }

// compile schema to model
let areaModel = mongoose.model('area', areaSchema);

//read JSONfile
let datas = JSON.parse(fs.readFileSync('exam.json', 'utf8'));
data = datas.data;

// insert data in db
areaModel.collection.insertMany(data,function(err,r)
{
    if(err) console.log(err)
    else db.close
})

