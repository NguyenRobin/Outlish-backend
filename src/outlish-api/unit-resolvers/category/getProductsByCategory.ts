import { db } from "@src/core-setup/services/db";
import type { AllProducts } from "@src/types/database";

export const handler = async (event: any) => {
  console.log(event);
  try {
    const { Items } = await db.query({
      TableName: process.env.OUTLISH_TABLE,
      KeyConditionExpression: "PK = :PK and begins_with(SK, :SK)",
      ExpressionAttributeValues: {
        ":PK": `Category#${event.arguments.input}`,
        ":SK": `Product#`,
      },
    });

    if (!Items?.length || Items === undefined) {
      throw new Error("no products");
    }

    // If product has a SubCategory as attribute only return them
    const SubCategoriesProducts = Items?.filter(
      (product) => product.SubCategory !== ""
    );

    // If product has a SubSubCategory as attribute only return them
    const SubSubCategoriesProducts = Items?.filter(
      (product) => product.SubSubCategory !== ""
    );

    console.log("Items", Items);

    // const test = {
    //   Category: event.arguments.input,
    //   SubCategory: SubCategory1.map((item) => item),
    //   SubSubCategory: SubSubCategory2.map((item) => item),
    // };
    const test = {
      Category: event.arguments.input,
      SubCategory: {
        Products: SubCategoriesProducts.map((item) => item),
      },
      SubSubCategory: {
        Products: SubSubCategoriesProducts.map((item) => item),
      },
      AllProducts: Items,
    };
    console.log(test);
    return test;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
