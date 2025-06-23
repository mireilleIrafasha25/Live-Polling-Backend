import { DataSource } from "typeorm";
import { User } from "../models/userEntity";
import { Token } from "../models/Token";
import * as dotenv from "dotenv";
dotenv.config();
export const AppDataSource=new DataSource(
{
type:"postgres",
host:"localhost",
 port: 5432,
 username: "postgres",
 password: "Mireille123@#",
 database: "Live_Poll",
 synchronize: true,
 logging: ["error"],
 entities: [User,Token],
 migrations: [],
 subscribers: [],
})

export const InitializeDatabase = async():Promise<void>=>
{
    try{
        await AppDataSource.initialize()
        console.log("Database Connected Successfully")
    }
    catch(error)
    {
        console.error("Error connecting to database",error)
        throw error;
    }
}


