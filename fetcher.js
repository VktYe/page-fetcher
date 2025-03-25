const needle = require('needle');
const fs = require('fs')
const args = process.argv;
const fetcher = args.slice(2);
const url = fetcher[0];
const path = fetcher[1];


needle.get(url, (error, response, body) => {
  if (error) {
    console.log('Error: ', error)
  }  
  fs.writeFile(path, body, err => { // writes to a file 
    if (err) {
      console.log("Error in write file:", err)
    }
    const bytes = body.length;
    console.log(`Downloaded and saved ${bytes} bytes to ${path}`);
      
  })
  
});