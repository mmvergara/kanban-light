import { app } from "./api/api";
import { pingDb } from "./supabase";

pingDb();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
