// we have access to the "module" object in every node module
// we create, including this one

const injectTemplate = (template, product) => {
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

module.exports = injectTemplate;

//
// or, shorthand, without defining AND THEN exporting our function, we
// could replace ALL of the above code with this:

// module.exports = (template, product) => {
//   let output = template.replace(/{%PRODUCTNAME%}/g, product.productName);
//   output = output.replace(/{%IMAGE%}/g, product.image);
//   output = output.replace(/{%QUANTITY%}/g, product.quantity);
//   output = output.replace(/{%PRICE%}/g, product.price);
//   output = output.replace(/{%FROM%}/g, product.from);
//   output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
//   output = output.replace(/{%DESCRIPTION%}/g, product.description);
//   output = output.replace(/{%ID%}/g, product.id);

//   if (!product.organic) {
//     output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
//   }
//   return output;
// };
