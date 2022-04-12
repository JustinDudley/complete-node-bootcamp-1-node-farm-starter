This project was built by following the 
Udemy class with 
Jonas Schmedtmann.

NodeJS Express Mongodb Bootcamp
https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/
Section 2, chapters 4 - 17

The meat of the index.js is the section under the comment: //SERVER

There is also, first a section under the comment: //FILES
This "files" section causes an existing file to be updated 
with Date.now() every
time you run the project. Don't be alarmed if your git changes
keep showing that a file has been changed after you run the project.

Also, there is a shadow index file called index-with-comments.js
This file is not called by anything, anywhere.
It has a bunch of useful comments from stuff Jonas said.
It was copy-pasted near the end of the project.  It may not 
quite be functional. In particular, the function called injectTemplate
is still included in the file; it has not yet been abstracted to its
own module.

There is an OXBOX in github for this project.  It was made before 
the package.json, and node_modules, and slugify, and prettier, were added. The functionality
of the oxbow is exactly the same as the final functionality, I believe. 
The oxbow may just look a bit cleaner, without some of the bells and whistles.

To run:
$ node index.js