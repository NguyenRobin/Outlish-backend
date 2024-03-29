import { db } from "@src/core-setup/services/db";
import { generateId, slugifyString } from "@src/utils";
import type { ProductArgsInput } from "@src/types";
import { AppSyncResolverEvent, AppSyncResolverHandler } from "aws-lambda";
import { addResizeImagesToS3Bucket } from "../../functions/addResizeImagesToS3Bucket";

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

    const id = generateId(4);

    if (!name || !category || !description || !image || !inventory || !price) {
      throw new Error("Properties missing");
    }

    const objWithImageUrl = await addResizeImagesToS3Bucket(image, name);

    if (!objWithImageUrl) {
      throw new Error("Object url could not be generated");
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
                subCategory: subCategory ?? "",
                subSubCategory: subSubCategory ?? "",
                name,
                description,
                image: objWithImageUrl,
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
                subCategory: subCategory ?? "",
                subSubCategory: subSubCategory ?? "",
                name,
                description,
                image: objWithImageUrl,
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
