"use server"

import { z } from "zod"

import { redirect } from "next/navigation"
import {
  canCreateProducts,
  canDeleteProducts,
  canUpdateProducts,
} from "../permissions/products"
import { getCurrentUser } from "@/services/clerk"
import { deleteProductDB, insertProductDB, updateProductDB } from "../db/product"
import { productSchema } from "../schema/products"

export async function createProductAction(unsafeData: z.infer<typeof productSchema>) {
  const { success, data } = productSchema.safeParse(unsafeData)

  if (!success || !canCreateProducts(await getCurrentUser())) {
    return { error: true, message: "There was an error creating your product" }
  }

  await insertProductDB(data)

  redirect("/admin/products")
}

export async function updateProductAction(
  id: string,
  unsafeData: z.infer<typeof productSchema>
) {
  const { success, data } = productSchema.safeParse(unsafeData)

  if (!success || !canUpdateProducts(await getCurrentUser())) {
    return { error: true, message: "There was an error updating your product" }
  }

  await updateProductDB(id, data)

  redirect("/admin/products")
}

export async function deleteProductAction(id: string) {
  if (!canDeleteProducts(await getCurrentUser())) {
    return { error: true, message: "Error deleting your product" }
  }

  await deleteProductDB(id)

  return { error: false, message: "Successfully deleted your product" }
}
