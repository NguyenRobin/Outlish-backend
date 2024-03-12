import { db } from "@src/core-setup/services/db";
import { AppSyncResolverEvent, AppSyncResolverHandler } from "aws-lambda";

export const handler: AppSyncResolverHandler<any, any> = async (
  event: AppSyncResolverEvent<any>
) => {
  const { Category, SubCategory, SubSubCategory } = event.arguments.input;

  if (!Category) {
    throw new Error("A new category must have a category name");
  }

  try {
    const newCategory = {
      PK: "Category",
      SK: `Category#${Category}`,
      Category,
      SubCategory: SubCategory ? [SubCategory] : [],
      SubSubCategory: SubSubCategory ? [SubSubCategory] : [],
    };

    await db.put({
      TableName: process.env.OUTLISH_TABLE,
      Item: newCategory,
      ConditionExpression:
        "attribute_not_exists(#PK) and attribute_not_exists(#SK)",
      ExpressionAttributeNames: {
        "#PK": `${newCategory.PK}`,
        "#SK": `${newCategory.SK}`,
      },
    });

    return newCategory;
  } catch (error: any) {
    if (error.name === "ConditionalCheckFailedException") {
      return {
        Category:
          "ERROR: Category already exist, Create a new one or update the current one",
        SubCategory: [],
        SubSubCategory: [],
      };
    }
  }
};
