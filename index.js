const express = require("express");
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(require('./routes/usersRoutes'));

app.listen(process.env.PORT||3000,() => {
    console.log("Db conectada");
});
