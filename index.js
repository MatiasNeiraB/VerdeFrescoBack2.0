const express = require("express");
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(require('./routes/usersRoutes'));
app.use(require('./routes/productsRoutes'));
app.use(require('./routes/cartRoutes'));

app.listen(process.env.PORT||3000,() => {
    console.log("Db conectada");
});
