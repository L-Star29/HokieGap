// D1 schema. After changing it, run `npm run db:generate` and commit the new drizzle/ migration.
import {sqliteTable,text,integer,index} from 'drizzle-orm/sqlite-core';
export const reports=sqliteTable('reports',{
 id:text('id').primaryKey(),
 sessionId:text('session_id').notNull(),
 spaceId:text('space_id').notNull(),
 level:text('level').notNull(),
 createdAt:integer('created_at').notNull(),
},t=>[index('idx_reports_created_at').on(t.createdAt),index('idx_reports_session_created_at').on(t.sessionId,t.createdAt)]);

export const agentBudget=sqliteTable("agent_budget",{bucket:integer("bucket").primaryKey(),count:integer("count").notNull()});
