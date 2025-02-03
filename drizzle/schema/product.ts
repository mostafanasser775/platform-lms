import { pgTable, text, integer, pgEnum } from "drizzle-orm/pg-core";
import { id, createdAt, updatedAt } from "@/drizzle/schemahelpers";
import { relations } from "drizzle-orm";
import { CourseProdcutTable } from "./courseProduct";
export const productStatuses = ["public", "private"] as const
export type ProdcutStatus = (typeof productStatuses)[number]
export const productStatusEnum = pgEnum("product_Status", productStatuses)

export const ProductTable = pgTable(("products"), {
    id,
    name: text().unique().notNull(),
    description: text().notNull(),
    imageUrl: text().notNull(),
    priceInDollars: integer().notNull(),
    status: productStatusEnum().notNull().default("private"),
    createdAt,
    updatedAt
})

export const ProductRelationships = relations(ProductTable, ({ many }) => ({
    courseProducts: many(CourseProdcutTable)
}))