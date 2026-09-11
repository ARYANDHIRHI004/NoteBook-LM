import { db } from "../config/db";
import { source } from "../models/soruce.models.js";


export async function createSourceRecord(data: Source) {
    return await db.insert(source).values(data);
}