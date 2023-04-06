require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nbna82s.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("HellwetTodo");
    const todoCollection = db.collection("todos");
    //create todo
    app.post("/todo", async (req, res) => {
      const todo = req.body;
      //   console.log(req.body);
      const result = await todoCollection.insertOne(todo);
      res.send({ status: true, data: result });
    });
    //get my todo
    app.get("/todo", async (req, res) => {
      const email = req.query.email;
      const query = {
        creatorEmail: email,
      };
      const cursor = await todoCollection.find(query).toArray();
      res.send({ status: true, data: cursor });
    });
    //get single todo
    app.get("/signle-todo/:id", async (req, res) => {
      // console.log(req.params);
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await todoCollection.findOne(query);
      res.send({ status: true, data: result });
    });
    //Delete Todo
    app.delete("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await todoCollection.deleteOne(query);
      res.send({ result: true, data: result });
    });
    //update todo
    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const todo = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };

      const updatedTodo = {
        $set: {
          todoName: todo.todoName,
          todoDesc: todo.todoDesc,
          creatorEmail: todo.creatorEmail,
          date: todo.date,
        },
      };
      const result = await todoCollection.updateOne(
        filter,
        updatedTodo,
        options
      );
      res.send({ status: true, data: result });
    });
  } finally {
  }
};

run().catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.send("Hellwet Todo App Server is running");
});
app.listen(port, () => {
  console.log(`Hellwet Todo App Server is running on port ${port}`);
});
