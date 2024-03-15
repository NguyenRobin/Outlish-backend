import { db } from "@src/core-setup/services/db";
import { slugifyString } from "@src/core-setup/utils";
import type { CategoryArgsInput, Category } from "@src/types/database";
import { AppSyncResolverEvent, AppSyncResolverHandler } from "aws-lambda";

export const handler: AppSyncResolverHandler<CategoryArgsInput, any> = async (
  event: AppSyncResolverEvent<CategoryArgsInput>
): Promise<any> => {
  const { category, subCategory, subSubCategory } = event.arguments.input;
  let newCategory;

  if (!category) {
    throw new Error("A new category must have a category name");
  }

  if (category && subCategory && subSubCategory) {
    newCategory = {
      PK: "category",
      SK: `category#${slugifyString(category)}#subCategory#${slugifyString(
        subCategory
      )}#subSubCategory#${slugifyString(subSubCategory)}`,
      category,
      subCategory: subCategory ?? "",
      subSubCategory: subSubCategory ?? "",
    };
  }

  if (category && subCategory && !subSubCategory) {
    newCategory = {
      PK: "category",
      SK: `category#${slugifyString(category)}#subCategory#${slugifyString(
        subCategory
      )}`,
      category,
      subCategory: subCategory ?? "",
      subSubCategory: subSubCategory ?? "",
    };
  }

  if (category && !subCategory && !subSubCategory) {
    newCategory = {
      PK: "category",
      SK: `category#${slugifyString(category)}`,
      category,
      subCategory: subCategory ?? "",
      subSubCategory: subSubCategory ?? "",
    };
  }
  try {
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
    console.log("error", error);
    console.error("error", error);
    throw error;
  }
};
