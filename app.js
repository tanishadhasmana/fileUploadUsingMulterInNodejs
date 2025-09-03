const path = require("path");
const express = require("express");
// step 1 to take the uploaded file, we need to first install and import the multer library
const multer = require("multer");
// step 2  we also have to put a MW, as upload
// const upload = multer({dest : "uploads/"})

// step 4 we making disk storage, which taking 2 parameters, destination(we specify, inside which folder have to save that file), and the filename
const storage = multer.diskStorage({
  destination: function(req, file, cb){ //req is orgnl req, file is, file which is uploading by the user,callback, after ur steps, go to this this..
    return cb(null, "uploads"); //this callback again take 2 parameter, one is if err, handle it, if no err, then null, and then the folder path we want to upload that file
  },
  filename: function(req, file, cb){ //it say, which name u want to give to that file
    return cb(null, `${Date.now()}-${file.originalname}`); //we say that, there is no err, so null, and then filename, but multiple user can upload the file, with same name, so we keep track with the date, like file name is, current date of that time then dash and the name of file which is given by user.
  }
});

// step 5
const upload = multer({storage});

const app = express();


app.set("views", path.join(__dirname, "views")); // folder for ejs files
app.set("view engine", "ejs"); // tell express to use ejs



app.use(express.json()); //MW to read json data
app.use(express.urlencoded({extended:false})); //MW to read url encoded data/ form data

// home route
app.get('/', function(req, res){
  return res.render("homepage");
})

// step 3, for /upload route we use, upload.single("input file name")
// route for /upload
app.post('/upload', upload.single("resume"),function(req, res){
  console.log(req.body);
  console.log(req.file);
  // then as soon as we uploded the file, we redirect again to home, *** and the folder named uploads is created, inside which we have that file --- But but, this file come with very unconvinient name, so if we want to manipulate acc. to u, we want DiskStorage, so we can save as we want
  return res.redirect('/');
})


const PORT = 3007;
app.listen(PORT, function(req,res){
  console.log(`Server is running at http://localhost:${PORT}`);
})

// ----------------------------------------------Notes-------------------------------------
// 1. Multiple files from a single input field

// If your <input> looks like this:

// <input type="file" name="resume" multiple>


// Then in Express, you use:

// app.post('/upload', upload.array("resume", 5), function(req, res){
//   console.log(req.body);
//   console.log(req.files);  // <-- notice .files (array of file objects)
//   return res.redirect('/');
// })


// Here, 5 means you allow up to 5 files. You can increase/decrease it.

// ✅ 2. Multiple different file fields

// If your form has different file inputs like:

// <input type="file" name="resume">
// <input type="file" name="profilePic">


// Then you use:

// app.post('/upload', upload.fields([
//   { name: 'resume', maxCount: 1 },
//   { name: 'profilePic', maxCount: 1 }
// ]), function(req, res){
//   console.log(req.body);
//   console.log(req.files); // object with keys resume[], profilePic[]
//   return res.redirect('/');
// })

// ✅ 3. Any number of files (any field name)

// If you don’t care about field names and just want to accept everything:

// app.post('/upload', upload.any(), function(req, res){
//   console.log(req.body);
//   console.log(req.files);
//   return res.redirect('/');
// })


// ⚡ So the main difference is:

// upload.single("fieldName") → one file only.

// upload.array("fieldName", maxCount) → multiple files, one field.

// upload.fields([{...}, {...}]) → multiple files, different fields.

// upload.any() → all files from the form.