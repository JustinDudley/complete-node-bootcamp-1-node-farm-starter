const fs = require("fs");
const http = require("http"); // with this built-in module, we can build an http server

///////////////////////////
// FILES

// blockig, synchronous reading of file
const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(textIn);
const textOut = `This is what we know about the avocado: ${textIn}.\nCreated ${Date.now()}`;
fs.writeFileSync("./txt/output.txt", textOut);
console.log("File written !");

// non-blocking, asynchronous reading, basic
// fs.readFile("./txt/start.txt", "utf-8", (err, data) => console.log(data));
// console.log("will read file...");

// non-blocking, asynchronous reading, more advanced  (BUT uses callback hell)
fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
  //   if (err) {return console.log("error reading first file ");}
  fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
    console.log(data2);
    fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
      console.log(data3);
      fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) =>
        console.log("Your file has been written")
      );
    });
  });
});

/////////////////////////
// SERVER

// createServer() is a method on the http object
// createServer accepts a callback function [(req,res) => ...].
// The callback will be fired off each time a new request hits our server.
const server = http.createServer((req, res) => {
  // logging the request from the browser will yield a ton of information, including headers, ...
  console.log("req is: ", req);
  res.end("Hello from the server!");
});

// Now we USE our new server
// We start up the server. It is now listening for incoming requests
// There is an event loop involved. The server keeps listening, the app doesn't just stop.
server.listen(
  8000,
  "127.0.0.1",
  /* optional third parameter for callback */ () =>
    console.log("Server is listening on PORT 8000")
);
