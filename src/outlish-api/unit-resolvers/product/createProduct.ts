import { db } from "@src/core-setup/services/db";
import { generateId, slugifyString } from "@src/core-setup/utils";
import type { ProductArgsInput, Slug } from "@src/types/database";
import { AppSyncResolverEvent, AppSyncResolverHandler } from "aws-lambda";

export const handler: AppSyncResolverHandler<
  ProductArgsInput,
  boolean
> = async (event: AppSyncResolverEvent<ProductArgsInput>): Promise<boolean> => {
  try {
    const {
      name,
      category,
      description,
      image,
      inventory,
      price,
      subCategory,
      subSubCategory,
      seller,
    } = event.arguments.input;

    const id = generateId();

    if (!name || !category || !description || !image || !inventory || !price) {
      throw new Error("Properties missing");
    }

    const slug = {
      name: slugifyString(name),
      category: slugifyString(category),
      subCategory: subCategory ? slugifyString(subCategory) : "",
      subSubCategory: subSubCategory ? slugifyString(subSubCategory) : "",
      description: slugifyString(description),
      seller: seller ? slugifyString(seller) : "",
    };

    await db.batchWrite({
      RequestItems: {
        OutlishTable: [
          {
            PutRequest: {
              Item: {
                PK: "product",
                SK: `product#${id}`,
                entityType: "product",
                category,
                subCategory: slug.subCategory ?? "",
                subSubCategory: slug.subSubCategory ?? "",
                name,
                description,
                image,
                inventory,
                price,
                id: id,
                seller: seller ?? "",
                slug,
              },
            },
          },
          {
            PutRequest: {
              Item: {
                PK: `category#${slug.category}`,
                SK: `product#${id}`,
                entityType: "category",
                category,
                subCategory: slug.subCategory ?? "",
                subSubCategory: slug.subSubCategory ?? "",
                name,
                description,
                image,
                inventory,
                price,
                id: id,
                seller: seller ?? "",
                slug,
              },
            },
          },
        ],
      },
    });

    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
