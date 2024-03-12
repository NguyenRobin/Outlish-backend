import { db } from "@src/core-setup/services/db";
import type { CategoryArgsInput, Category } from "@src/types/database";
import { AppSyncResolverEvent, AppSyncResolverHandler } from "aws-lambda";

export const handler: AppSyncResolverHandler<
  CategoryArgsInput,
  Category
> = async (
  event: AppSyncResolverEvent<CategoryArgsInput>
): Promise<Category> => {
  const { category, subCategory, subSubCategory } = event.arguments.input;

  if (!category) {
    throw new Error("A new category must have a category name");
  }

  try {
    const newCategory = {
      PK: "category",
      SK: `category#${category}`,
      category,
      subCategory: subCategory ? [subCategory] : [],
      subSubCategory: subSubCategory ? [subSubCategory] : [],
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

    return {
      category: newCategory.category,
      subCategory: newCategory?.subCategory,
      subSubCategory: newCategory?.subSubCategory,
    };
  } catch (error: any) {
    if (error.name === "ConditionalCheckFailedException") {
      return {
        category:
          "ERROR: Category already exist, Create a new one or update the current one",
        subCategory: [],
        subSubCategory: [],
      };
    }
    throw error;
  }
};
