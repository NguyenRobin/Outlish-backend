import { db } from "@src/core-setup/services/db";
import { slugifyString } from "@src/core-setup/utils";
import type { CategoryArgsInput, NewCategory } from "@src/types/database";
import { AppSyncResolverEvent, AppSyncResolverHandler } from "aws-lambda";

export const handler: AppSyncResolverHandler<
  CategoryArgsInput,
  NewCategory
> = async (
  event: AppSyncResolverEvent<CategoryArgsInput>
): Promise<NewCategory> => {
  const { category, subCategory, subSubCategory } = event.arguments.input;

  let sortKey;

  if (!category) {
    throw new Error("A new category must have a category name");
  }

  if (category && subCategory && subSubCategory) {
    sortKey = `category#${slugifyString(category)}#subCategory#${slugifyString(
      subCategory
    )}#subSubCategory#${slugifyString(subSubCategory)}`;
  }

  if (category && subCategory && !subSubCategory) {
    sortKey = `category#${slugifyString(category)}#subCategory#${slugifyString(
      subCategory
    )}`;
  }

  if (category && !subCategory && !subSubCategory) {
    sortKey = `category#${slugifyString(category)}`;
  }
  try {
    const newCategory = {
      PK: "category",
      SK: sortKey,
      category,
      subCategory: subCategory ?? "",
      subSubCategory: subSubCategory ?? "",
    };

    await db.put({
      TableName: process.env.OUTLISH_TABLE,
      Item: newCategory,
      ConditionExpression:
        "attribute_not_exists(#PK) and attribute_not_exists(#SK)",
      ExpressionAttributeNames: {
        "#PK": `${newCategory?.PK}`,
        "#SK": `${newCategory?.SK}`,
      },
    });

    return {
      category: newCategory?.category,
      subCategory: newCategory?.subCategory,
      subSubCategory: newCategory?.subSubCategory,
    };
  } catch (error: any) {
    if (error.name === "ConditionalCheckFailedException") {
      return {
        category:
          "ERROR: Category already exist, Create a new one or update the current one",
        subCategory:
          "ERROR: Category already exist, Create a new one or update the current one",
        subSubCategory:
          "ERROR: Category already exist, Create a new one or update the current one",
      };
    }
    console.error("error", error);
    throw error;
  }
};
