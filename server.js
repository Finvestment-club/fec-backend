import app from "./app.js";

import dotenv from "dotenv";

dotenv.config({ path: "./config/config.env" });

// app.post("/", (req, res) => {
//   res.send("Hello World");
// });

app.listen(process.env.PORT || 4000, () => {
    console.log("Server listening on port 4000 ");
});
