const fs = require("fs");
const http = require("http");
const url = require("url");

const slugify = require("slugify");

const injectTemplate = require("./modules/injectTemplate");

///////////////////////////
// FILES

const textIn = fs.readFileSync("./txt/input.txt", "utf-8"); // blocking
const textOut = `This is what we know about the avocado: ${textIn}.\nCreated ${Date.now()}`;
fs.writeFileSync("./txt/output.txt", textOut);
console.log("File written !");

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

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const products = JSON.parse(data);
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

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // overview page
  if (pathname === "/" || pathname === "/overview") {
    const htmlCards = products.map((product) =>
      injectTemplate(templateCard, product)
    );
    const htmlString = htmlCards.join("");
    res.writeHead(200, { "Content-type": "text/html" });
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
    res.end(data);

    // Not Found
  } else {
    res.writeHead(404);
    res.end("Page Not Found, yo");
  }
});

// Now we USE the server we just defined
server.listen(
  8000,
  "127.0.0.1",
  /* optional third parameter for callback */ () =>
    console.log("Server is listening on PORT 8000")
);
