/**
 * Dependencies
 */
const express = require("express")
const router = express.Router()

/**
 * Routes INDUCESS
 */
// Index - GET render all of the books
router.get("/", async (req, res) => {
    // find all of the books
    let books = await req.model.Book.find({})

    // render all of the books to index.ejs
    res.render("index.ejs", {
        books: books.reverse()
    })
})

// New - GET for the form to create a new book
router.get("/new", (req, res) => {
    // render the create form
    res.render("new.ejs")
})

// DELETE
router.delete("/:id", async (req, res) => {
    try {
        // Find a book and then delete
        let deletedBook = await req.model.Book.findByIdAndDelete(req.params.id)
        // console.log(deletedBook)
        // redirect back to the index
        res.redirect("/books")
        
    } catch (error) {
        res.status(500).send("something went wrong when deleting")
    }
})

// UPDATE
router.put("/:id", async (req, res) => {
    
    try {
        // handle our checkbox
        if (req.body.completed === "on") {
            req.body.completed = true
        } else {
            req.body.completed = false
        }
        // Then find by id and update with the req.body
        // findByIdAndUpdate - id , data to update, options
        let updatedBook = await req.model.Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true
            }
        )
    
        // redirect to the show route with the updated book
        res.redirect(`/books/${updatedBook._id}`)
        
    } catch (error) {
        res.send("something went wrong in this route")        
    }
})

// Create - POST
router.post("/", async (req, res) => {
    try {
        if (req.body.completed === "on") {
            // if checked
            req.body.completed = true
        } else {
            // if not checked
            req.body.completed = false
        }
    
        let newBook = await req.model.Book.create(req.body)
        res.redirect("/books")

    } catch (err) {
        res.send(err)
    }
})

// EDIT
router.get("/edit/:id", async (req, res) => {
    try {
        // find the book to edit
        let foundBook = await req.model.Book.findById(req.params.id)
        res.render("edit.ejs", {
            book: foundBook
        })
    } catch (error) {
        res.send("hello from the error")
    }
})

// Seed - GET
router.get("/seed", async (req, res) => {
    
    try {
        // delete everything in the database
        await req.model.Book.deleteMany({})
        // Create data in the database
        await req.model.Book.create(
            req.model.seedData
        )
        
        // redirect back to the index
        res.redirect("/books")
        
    } catch (error) {
        res.send("something went wrong with your seeds")
    }
})

// Show - GET rendering only one book
router.get("/:id", async (req, res) => {
    // find a book by _id
    let foundBook = await req.model.Book.findById(req.params.id) // the request params object

    // render show.ejs with the foundBook
    res.render("show.ejs", {
        book: foundBook
    })
})

// Export our router
module.exports = router