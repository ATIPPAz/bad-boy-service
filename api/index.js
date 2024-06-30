const { initialRouting } = require("./routes");
const { app } = require("./configServer");
initialRouting(app);
app.listen(3001, async () => {
  console.log("Server is running on port 3001");
});
