import { db } from "@src/core-setup/services/db";
import {
  AllProductsBySubCategory,
  ProductArgsInput,
} from "@src/types/database";
import { AppSyncResolverEvent, AppSyncResolverHandler } from "aws-lambda";

export const handler: AppSyncResolverHandler<
  ProductArgsInput,
  AllProductsBySubCategory
> = async (
  event: AppSyncResolverEvent<ProductArgsInput>
): Promise<AllProductsBySubCategory> => {
  const { category, subCategory } = event.arguments.input;

  if (!category || !subCategory) {
    throw new Error("Category and SubCategory must be included");
  }

  try {
    const { Items } = await db.query({
      TableName: process.env.OUTLISH_TABLE,
      KeyConditionExpression: "PK = :PK and begins_with(SK, :SK)",
      FilterExpression: `#subCategory = :subCategory`,
      ExpressionAttributeNames: {
        "#subCategory": "subCategory",
      },
      ExpressionAttributeValues: {
        ":PK": `category#${category}`,
        ":SK": "product#",
        ":subCategory": `${subCategory}`,
      },
    });

    console.log(Items);
    if (Items?.length === undefined) {
      throw new Error("No subCategories Items found");
    }

    return {
      result: Items.length,
      products: Items,
    } as AllProductsBySubCategory;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
