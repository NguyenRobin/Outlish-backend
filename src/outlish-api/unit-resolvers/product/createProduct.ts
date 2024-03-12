import { db } from "@src/core-setup/services/db";
import { generateId } from "@src/core-setup/utils";
import { ProductArgsInput } from "@src/types/database";
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
      section,
      seller,
      slug,
    } = event.arguments.input;

    const id = generateId();

    if (!name || !category || !description || !image || !inventory || !price) {
      throw new Error("Properties missing");
    }

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
                subCategory: subCategory ?? "",
                subSubCategory: subSubCategory ?? "",
                section: section ?? "",
                name,
                description,
                image,
                inventory,
                price,
                id: id,
                seller: seller ?? "",
                slug: slug ? [slug] : [],
              },
            },
          },
          {
            PutRequest: {
              Item: {
                PK: `category#${category}`,
                SK: `product#${id}`,
                entityType: "category",
                category,
                subCategory: subCategory ?? "",
                subSubCategory: subSubCategory ?? "",
                section: section ?? "",
                name,
                description,
                image,
                inventory,
                price,
                id: id,
                seller: seller ?? "",
                slug: slug ? [slug] : [],
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
