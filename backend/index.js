import express  from "express";
import mysql from "mysql2"
import cors from "cors"

const app = express();

const db = mysql.createConnection({
    host: "mysql",
    user: "root",
    password: "password",
    database: "test"
});

db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database: ', err);
      return;
    }
    console.log('Connected to the database');
    // based on norbert's schema 
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        cover VARCHAR(255),
        price DECIMAL(10, 2) NOT NULL
      )
    `;
  
    db.query(createTableQuery, (err, result) => {
      if (err) {
        console.error('Error creating table: ', err);
        return;
      }
    });
  });
  

app.use(express.json())//return json data using the api server postman

app.use(cors())

app.get("/", (req,res)=>{
    res.json("Hello World from the backend!!!")
})

//postman -> get method  http://localhost:8800/books
app.get("/books", (req, res) => {
    const query = "SELECT * FROM books"
    db.query(query, (err, data) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ error: err.message })
      }
  
      console.log("Books data from DB:", data);
  
      if (!data || data.length === 0) {
        console.log("No books found in the database.")
        return res.json([])
      }
  
      return res.json(data)
    });
  });


  //postman ---> post method
  //json body bellow
  //----------------------------- http://localhost:8800/books
  //{
// "title": "title from client",
// "description": "description from client",
// "cover": "cover from client"
// }

  app.post("/books", (req,res)=>{
    const query = "INSERT INTO books (`title`, `description`, `price`, `cover`) VALUES (?)"
    const values = [
       req.body.title,
       req.body.description,
       req.body.price,
       req.body.cover
    ]

    db.query(query, [values], (err,data)=>{
        if(err) return res.json(err)
        return res.json("Book has been created successfully!!!")
    })
  })

  app.delete("/books/:id", (req,res)=>{
      const bookID = req.params.id
      const query = "DELETE FROM books WHERE id = ?"

      db.query(query, [bookID], (err, data)=>{
        if(err) return res.json(err)
        return res.json("Book has been deleted successfully!!!")
      } )
  })

  app.put("/books/:id", (req,res)=>{
    const bookID = req.params.id
    const query = "UPDATE books SET `title`= ?, `description`= ?, `price`= ?, `cover`= ? WHERE id = ?";

    const values = [
      req.body.title,
      req.body.description,
      req.body.price,
      req.body.cover
    ]

    db.query(query, [...values, bookID], (err, data)=>{
      if(err) return res.json(err)
      return res.json("Book has been updated successfully!!!")
    } )
})


app.listen(8800, ()=>{
    console.log("Connect to the backend!!!!")
})

//npm start