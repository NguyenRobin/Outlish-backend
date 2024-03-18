import { db } from "@src/core-setup/services/db";
import { slugifyString } from "@src/core-setup/utils";
import type {
  AllProductsByCategory,
  CategoryArgsInput,
} from "@src/types/database";
import { AppSyncResolverEvent, AppSyncResolverHandler } from "aws-lambda";

export const handler: AppSyncResolverHandler<
  CategoryArgsInput,
  AllProductsByCategory
> = async (event: AppSyncResolverEvent<any>) => {
  console.log(event);
  const { category } = event.arguments.input; // klader
  try {
    const { Items } = await db.query({
      TableName: process.env.OUTLISH_TABLE,
      KeyConditionExpression: "PK = :PK and begins_with(SK, :SK)",
      ExpressionAttributeValues: {
        ":PK": `category#${category}`, // category#kläder
        ":SK": `product#`,
      },
    });

    if (!Items?.length || Items === undefined) {
      throw new Error("no products");
    }

    console.log("Items", Items);

    const result = {
      category: category,
      result: Items.length,
      products: Items,
    };

    return result as AllProductsByCategory;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
