import { db } from "@src/core-setup/services/db";
import { AppSyncResolverEvent, AppSyncResolverHandler } from "aws-lambda";

export const handler: AppSyncResolverHandler<any, any> = async (
  event: AppSyncResolverEvent<any>
) => {
  const { Category, SubCategory, SubSubCategory } = event.arguments.input;

  if (!Category) {
    throw new Error("A new category must include a category name");
  }

  const newCategory = {
    PK: "Category",
    SK: `Category#${Category}`,
    Category,
    SubCategory: SubCategory ?? "",
    SubSubCategory: SubSubCategory ?? "",
  };

  try {
    await db.put({
      TableName: process.env.OUTLISH_TABLE,
      Item: newCategory,
    });

    return newCategory;
  } catch (error) {
    console.log(error);
  }
};
