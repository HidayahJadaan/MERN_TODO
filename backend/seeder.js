const {Book} = require('./models/Book');
const {books, authors } = require('./data');
const dotenv = require('dotenv');
const connectionToDB = require('./config/db');
const { Author } = require('./models/Authors');

dotenv.config();

//Connection To DB
connectionToDB();
// IMPORT BOOKS
const importBooks = async()=>{
    try{
        await Book.insertMany(books);
        console.log("Books Imported")
        process.exit(0)
    }catch(err){
        console.log(err)
        process.exit(1)
    }
}

// Import Authors (seeding database)
const importAuthors = async () => {
    try {
        await Author.insertMany(authors);
        console.log("Authors Imported");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
// DELETE BOOKS
const deleteBooks = async()=>{
    try{
        await Book.deleteMany();
        console.log("Books Deleted")
        process.exit(0)
    }catch(err){
        console.log(err)
        process.exit(1)
    }
}

if(process.argv[2] === "-import"){
    importBooks();
}
else if(process.argv[2] === '-remove'){
    deleteBooks();
}else if (process.argv[2] === "-import-authors") {
    importAuthors();
}
