import { db } from "@src/core-setup/services/db";
import { slugifyString } from "@src/utils";
import type { Category } from "@src/types";
import { AppSyncResolverHandler } from "aws-lambda";

export const handler: AppSyncResolverHandler<
  Event,
  Category[]
> = async (): Promise<Category[]> => {
  try {
    const { Items } = await db.query({
      TableName: process.env.OUTLISH_TABLE,
      KeyConditionExpression: "PK = :PK and begins_with(SK, :SK)",
      ExpressionAttributeValues: {
        ":PK": "category",
        ":SK": "category#",
      },
    });
    if (Items === undefined || !Items.length) {
      throw new Error("No Categories found");
    }

    const categories = [];

    for (const item of Items) {
      let category = categories.find((cat) => cat.name === item.category);

      if (!category) {
        category = {
          name: item.category,
          slug: slugifyString(item.category),
          subCategory: [],
        };
        categories.push(category);
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
    console.log(categories);
    return categories as Category[];
  } catch (error) {
    console.log(error);
    throw error;
  }
};
