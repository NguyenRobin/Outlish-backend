import { db } from "@src/core-setup/services/db";
import { slugifyString } from "@src/core-setup/utils";
import type { Category } from "@src/types/database";
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

    // const categories = [];

    // for (let i = 0; i < Items.length; i++) {
    //   console.log(Items[i].subSubCategory.map((subsub) => subsub));

    //   const obj = {
    //     name: Items[i].category,
    //     slug: slugifyString(Items[i].category),
    //     subCategory: [
    //       {
    //         name: Items[i].subCategory[0],
    //         slug: slugifyString(Items[i].subCategory[0]),
    //         subSubCategory: Items[i].subSubCategory.map((subsub) => {
    //           return {
    //             name: subsub,
    //             slug: slugifyString(subsub),
    //           };
    //         }),
    //       },
    //     ],
    //   };
    //   categories.push(obj);
    // }

    const categories = Items.map((item) => item.category);
    const uniqueCategories = [...new Set(categories)];
    console.log(uniqueCategories);
    return Items;
    return categories as Category[];
  } catch (error) {
    console.log(error);
    throw error;
  }
};
