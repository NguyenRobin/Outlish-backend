import { db } from "@src/core-setup/services/db";
import { slugifyString } from "@src/core-setup/utils";
import type { Category, CategoryArgsInput } from "@src/types/database";
import { AppSyncResolverEvent, AppSyncResolverHandler } from "aws-lambda";

export const handler: AppSyncResolverHandler<
  CategoryArgsInput,
  Category
> = async (
  event: AppSyncResolverEvent<CategoryArgsInput>
): Promise<Category> => {
  const { category, subCategory, subSubCategory } = event.arguments.input;

  let sortKey;

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
    const { Items } = await db.query({
      TableName: process.env.OUTLISH_TABLE,
      KeyConditionExpression: "PK = :PK and begins_with(SK, :SK)",
      ExpressionAttributeValues: {
        ":PK": "category",
        ":SK": sortKey,
      },
    });

    if (Items === undefined || !Items.length) {
      throw new Error("No Categories found");
    }

    const categoryResult: Category[] = [];

    for (const item of Items) {
      let category = categoryResult.find((cat) => cat.name === item.category);

      if (!category) {
        category = {
          name: item.category,
          slug: slugifyString(item.category),
          subCategory: [],
        };
        categoryResult.push(category);
      }

      if (item.subCategory) {
        let subCategory = category?.subCategory?.find(
          (subCat) => subCat.name === item.subCategory
        );

        if (!subCategory) {
          subCategory = {
            name: item.subCategory,
            slug: slugifyString(item.subCategory),
            subSubCategory: [],
          };

          category?.subCategory?.push(subCategory);
        }

        const subSubCategory = {
          name: item.subSubCategory,
          slug: slugifyString(item.subSubCategory),
        };

        if (
          !subCategory?.subSubCategory?.some(
            (subSub) => subSub.name === subSubCategory.name
          )
        ) {
          subCategory?.subSubCategory?.push(subSubCategory);
        }
      }
    }

    console.log(categoryResult[0]);
    return categoryResult[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};
