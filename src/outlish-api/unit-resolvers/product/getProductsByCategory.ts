import { db } from "@src/core-setup/services/db";
import { slugifyString } from "@src/utils";
import type {
  ProductsByCategory,
  CategoryArgsInput,
  Product,
} from "@src/types";
import { AppSyncResolverEvent, AppSyncResolverHandler } from "aws-lambda";

export const handler: AppSyncResolverHandler<
  CategoryArgsInput,
  ProductsByCategory
> = async (
  event: AppSyncResolverEvent<CategoryArgsInput>
): Promise<ProductsByCategory> => {
  const { category, subCategory, subSubCategory } = event.arguments.input;
  console.log(event);

  let products: Product[] = [];

  try {
    if (category && !subCategory && !subSubCategory) {
      const { Items } = await db.query({
        TableName: process.env.OUTLISH_TABLE,
        KeyConditionExpression: "PK = :PK and begins_with(SK, :SK)",
        ExpressionAttributeValues: {
          ":PK": `category#${slugifyString(category)}`,
          ":SK": `product#`,
        },
      });

      products = Items as Product[];
    }

    if (category && subCategory && !subSubCategory) {
      const { Items } = await db.query({
        TableName: process.env.OUTLISH_TABLE,
        KeyConditionExpression: "PK = :PK and begins_with(SK, :SK)",
        FilterExpression: `slug.#subCategory = :subCategory`,
        ExpressionAttributeNames: {
          "#subCategory": "subCategory",
        },
        ExpressionAttributeValues: {
          ":PK": `category#${slugifyString(category)}`,
          ":SK": "product#",
          ":subCategory": `${slugifyString(subCategory)}`,
        },
      });
      products = Items as Product[];
    }

    if (category && subCategory && subSubCategory) {
      const { Items } = await db.query({
        TableName: process.env.OUTLISH_TABLE,
        KeyConditionExpression: "PK = :PK and begins_with(SK, :SK)",
        FilterExpression: `slug.#subCategory = :subCategory AND slug.#subSubCategory = :subSubCategory`,
        ExpressionAttributeNames: {
          "#subCategory": "subCategory",
          "#subSubCategory": "subSubCategory",
        },
        ExpressionAttributeValues: {
          ":PK": `category#${slugifyString(category)}`,
          ":SK": "product#",
          ":subCategory": `${slugifyString(subCategory)}`,
          ":subSubCategory": `${slugifyString(subSubCategory)}`,
        },
      });
      products = Items as Product[];
    }

    const result = {
      category: category,
      result: products.length,
      products: products,
    };

    console.log(result);

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
