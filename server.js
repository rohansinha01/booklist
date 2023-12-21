/**
 * Dependencies
 */

require("dotenv").config() // this is how we make use of our .env variables
require("./config/db")
const express = require("express")
const morgan = require("morgan") // logger

const app = express()
const { PORT = 3013 } = process.env;

// Bring in our model
const Book = require("./models/Book")

/**
 * Middleware
 */
app.use(morgan("dev")) // logging
app.use(express.urlencoded({ extended: true })) // body parser this is how we get access to req.body
/**
 * Routes & Router
 */

// INDEX - GET render all of the books
app.get("/books", async (req, res) => {
    // find all of the books
    let books = await Book.find({})
    // render all of the books to index.ejs
    res.render("index.ejs", {
        books: books.reverse()
    })
   
})

// NEW - GET for the form to create a new book
app.get("/books/new", (req, res) => {
    res.render("new.ejs")
})

// CREATE - POST
app.post("/books", async (req, res) => {
     try { 
        if (req.body.completed === "on") {
        // if checked
        req.body.completed = true
    } else {
        // if not checked
        req.body.completed = false
    }

    let newBook = await Book.create(req.body)
    res.redirect("/books")
  

    } catch (err) {
        res.send(err)
    }
})

// SHOW - GET rendering only one book

/**
 * Server Listener
 */

app.listen(PORT, () => console.log(`Listening to the sounds of ${PORT}`))