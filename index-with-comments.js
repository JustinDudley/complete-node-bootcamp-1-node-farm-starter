// This is the index file with all comments included, at a certain point in time
// It just sits here, to be read by my future self,
// leaving the regular index.js file (which will be executed) free
// of comments

const fs = require("fs");
const http = require("http"); // with this built-in module, we can build an http server
const url = require("url"); //  Looks like url.parse is legacy. WHATWG URL API  is now preferred

///////////////////////////
// FILES

// blockig, synchronous reading of file
const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
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

// First, here is the 'top-level' code.  It only gets run ONCE when the server gets turned on.
// The code below the top-level code, the stuff within the server blocks, gets run each
// time a user hits the endpoint.  But this stuff here gets run only once, so it's
// okay that we're doing a synchronous read here in the top-level.

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const products = JSON.parse(data);

// read html files into variables, synchronous i/o:
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const injectTemplate = (template, product) => {
  // use regex g to ensure ALL intances get replaced
  let output = template.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }
  return output;
};

// createServer() is a method on the http object
// createServer accepts a callback function [(req,res) => ...].
// The callback will be fired off each time a new request hits our server.
const server = http.createServer((req, res) => {
  // the req object has a ton of info, including req.url, the path the user put into the browser
  // second arg, "true", makes your url query parameters get parsed into an object
  const { query, pathname } = url.parse(req.url, true);

  // overview page
  if (pathname === "/" || pathname === "/overview") {
    // create an array of cards of html
    const htmlCards = products.map((product) =>
      injectTemplate(templateCard, product)
    );
    const htmlString = htmlCards.join(""); //turn array into string
    res.writeHead(200, { "Content-type": "text/html" });
    // now we NEST one html string inside another. In effect, two of the html files in the file structure are delivered as a single string.
    res.end(templateOverview.replace(/{%PRODUCT_CARDS%}/g, htmlString));

    // product page
  } else if (pathname === "/product") {
    const product = products[query.id];
    const productHtml = injectTemplate(templateProduct, product);

    res.writeHead(200, { "Content-type": "text/html" }); // unnecessary line? Wasn't in Jonas's lesson
    res.end(productHtml);

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data); // sending orig json object

    // Not Found
  } else {
    // send 404 status code, and message
    res.writeHead(
      404
      //    , {"Content-type": "text/html", }     // could choose a different Content-type like html...
    );
    res.end("Page Not Found, yo");
    // res.end("<h1>Page not found, yo</h1>");    //  ...and then put in html here
  }
});

// Now we USE the server we just defined
// We start up the server. It is now listening for incoming requests
// There is an event loop involved. The server keeps listening, the app doesn't just stop.
server.listen(
  8000,
  "127.0.0.1",
  /* optional third parameter for callback */ () =>
    console.log("Server is listening on PORT 8000")
);

// This is the code Jonas first wrote.
// He used an asynchronous readFile WITHIN the routing block.
// It had a callback, being asynchronous
// Later, we put this I/O at the top level, putting the data into a
// variable, synchronously

// else if (pathname === "/api") {
//     // fs.readFile("./dev-data/data.json" ...etc.);
//     fs.readFile(`${__dirname}/dev-data/data.json`, "utf-8", (err, data) => {
//       const productData = JSON.parse(data);
//       console.log(productData);
//       res.writeHead(200, { "Content-type": "application/json" });
//       // send the original JSON string, not the js object
//       res.end(data);
//       //   res.end("API");
//     }
//     );
//   }

// 🐔
