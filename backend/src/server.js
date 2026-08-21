import app from "./app.js";
import env from "./config/env.js";
import seedAdmin from "./utils/seedAdmin.js";


const server = app.listen(env.port, env.host, () => {
  console.log(`IMIGANI API running at http://${env.host}:${env.port}`);
});


(async ()=>{
  try{
    await seedAdmin();
  
  } catch (error){
    console.error("Failed to seed admin:", error.message);
  }
})();


server.on("error", (error) => {
  console.error("Failed to start IMIGANI API:", error.message);
  process.exit(1);
});
