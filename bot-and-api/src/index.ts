import client from "./bot";
import { BOT_TOKEN } from "./config";

// pingDb();

// app.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });

console.log(Bun.argv);

client.login(BOT_TOKEN);
