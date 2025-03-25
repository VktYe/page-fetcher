const needle = require('needle');
const fs = require('fs');
const readline = require("readline");
const args = process.argv;
const fetcher = args.slice(2);
const url = fetcher[0];
const path = fetcher[1];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

if (!url || !path) {
  console.log("No URL or PATH provided");
  process.exit(1);
}


// Check if the file exists in current directory.
fs.access(path, fs.constants.F_OK, (err) => {
  
  if (!err) { // file exist - ask question
    rl.question(`File ${path} already exists. To overwrite press Y:   `, (answer) => {
      console.log('User answered:', answer);
      if (answer.toLowerCase() === 'y') {
        pageDownloader();
      } else {
        console.log("Skipping download. File is not overwritten");
        rl.close();
        process.exit(0);
      }
    });

  } else { // file does not exist - download
    pageDownloader();
    
  }
});


const pageDownloader = function() {
  console.log('Starting download from:', url);
  needle.get(url, (error, response, body) => {
    if (error) {
      console.log("Error: ", error);
      process.exit(1);
    }
    if (response && response.statusCode !== 200) {
      console.log("Error. HTTP Status: ", response.statusCode);
      rl.close();
      process.exit(1);

    }
      fs.writeFile(path, body, err => { // writes to a file
      if (err) {
        console.log("Error in write file: ", err);
        rl.close();
        process.exit(1);

      }
      const bytes = body.length;
      console.log(`Downloaded and saved ${bytes} bytes to ${path}`);
      rl.close();
    });
  
  });
};