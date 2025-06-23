import 'reflect-metadata';
import express, { Express } from 'express';
import * as dotenv from 'dotenv';
import routes from './routes/index';
import { InitializeDatabase } from './config/database';
import {errorHandler} from "./middleware/errorhandler"
import swaggerUi from "swagger-ui-express";
import fs from "fs/promises"
import path from 'path';
import cors from "cors"
dotenv.config();

const app: Express = express();
const PORT=Number(process.env.PORT);

async function loadDocumentation() {
  try {
   const swaggerPath = path.join(__dirname, 'doc', 'swagger.json');
const data = await fs.readFile(swaggerPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading Swagger JSON:", error);
    return null; // Prevents app crash
  }
}
app.use(cors()); // Enable CORS for all origins
//Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/', routes);
const startDocumentation=async()=>
{
  try{
    const documentation=await loadDocumentation();
    if(documentation)
    {
      app.use("/api_docs",swaggerUi.serve,swaggerUi.setup(documentation))
    }
    else{
      console.error("Swagger documentation could not be loaded.")
    }
  }
  catch(error)
  {
    console.error("Error loading documentation",error)
  }
}
startDocumentation()
// Error handling middleware
app.use(errorHandler);

// Start the server
const startServer = async () => {
    try {
      // Initialize db connection
      await InitializeDatabase();
      
      // Start Express server
     app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };
  
  // Run the server
  startServer();