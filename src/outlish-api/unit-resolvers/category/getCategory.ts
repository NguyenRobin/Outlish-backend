import { db } from "@src/core-setup/services/db";
import { slugifyString } from "@src/core-setup/utils";
import type { Category } from "@src/types/database";
import { AppSyncResolverHandler } from "aws-lambda";

export const handler: AppSyncResolverHandler<Event, Category[]> = async (
  event: any
): Promise<Category[]> => {
  const { category, subCategory, subSubCategory } = event.arguments.input;
  try {
    const { Items } = await db.query({
      TableName: process.env.OUTLISH_TABLE,
      KeyConditionExpression: "PK = :PK and begins_with(SK, :SK)",
      ExpressionAttributeValues: {
        ":PK": "category",
        ":SK": `category#${category}`,
      },
    });
    if (Items === undefined || !Items.length) {
      throw new Error("No Categories found");
    }

    const result = [];

    for (const item of Items) {
      let category = result.find((cat) => cat.name === item.category);

      if (!category) {
        category = {
          name: item.category,
          slug: slugifyString(item.category),
          subCategory: [],
        };
        result.push(category);
      }

      if (item.subCategory) {
        let subCategory = category.subCategory.find(
          (subCat) => subCat.name === item.subCategory
        );
        if (!subCategory) {
          subCategory = {
            name: item.subCategory,
            slug: slugifyString(item.subCategory),
            subSubCategory: [],
          };
          category.subCategory.push(subCategory);
        }

        const subSubCategory = {
          name: item.subSubCategory,
          slug: slugifyString(item.subSubCategory),
        };
        if (
          !subCategory.subSubCategory.some(
            (subSub) => subSub.name === subSubCategory.name
          )
        ) {
          subCategory.subSubCategory.push(subSubCategory);
        }
      }
    }

    console.log(result[0]);
    return result[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};
