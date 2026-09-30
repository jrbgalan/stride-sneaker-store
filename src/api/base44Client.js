// Decoupled from Base44 - Powered by the AXIS Database Abstraction Layer
import { db, base44 as base44Adapter } from "@/lib/db";

export const base44 = base44Adapter;
export { db };
export default db;
