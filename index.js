const express = require("express");
const bodyParser = require("body-parser");
const cartRouter = require("./cart/router/router");
const app = express();
const port = process.env.PORT || 1236;

require("./config/mongoose")(app);

app.use(bodyParser.json());
app.use("/cart", cartRouter);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
