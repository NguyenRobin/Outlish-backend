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
    console.log("✅", Items);
    // const sub = Items.map((sub) => sub.subCategory).filter((sub) => sub !== "");
    // const fitta = [...new Set(sub)];
    // console.log(fitta);
    const apa = Items.map((subsub) => {
      return { name: subsub.subSubCategory };
    });

    console.log("apa", apa);
    const sub = Items.map((sub) => {
      return {
        name: sub.category,
        slug: slugifyString(sub.category),
        subSubCategory: Items.filter((el) => {
          if (el.subSubCategory !== "")
            return {
              name: el.subSubCategory,
              slug: slugifyString(el.subSubCategory),
            };
        }),
      };
    });
    // const fitta = [...new Set(sub)];
    // console.log(fitta);
    const categories = [];
    console.log(sub[0].subSubCategory);
    // for (let i = 0; i < Items.length; i++) {
    // console.log(Items[i].subSubCategory.map((subsub) => subsub));
    const obj = {
      name: Items[0].category,
      slug: slugifyString(Items[0].category),
      subCategory: sub,
      // [
      // {
      //   name: Items[i].subCategory,
      //   slug: slugifyString(Items[i].subCategory),
      //   subSubCategory: {
      //     name: Items[i].subSubCategory,
      //     slug: slugifyString(Items[i].subSubCategory),
      //   },
      // },
      // ],
    };
    console.log(obj.subCategory[0].subSubCategory);
    // categories.push(obj);
    // }

    // const categories = Items.map((item) => item.category);
    // const uniqueCategories = [...new Set(categories)];
    // console.log("Items", Items);
    // console.log(categories);
    return Items;
    return categories as Category[];
  } catch (error) {
    console.log(error);
    throw error;
  }
};
