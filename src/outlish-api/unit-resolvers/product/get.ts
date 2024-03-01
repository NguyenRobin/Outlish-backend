import { db } from "@src/core-setup/services/db";
import { type AllProducts } from "@src/types/database";

// Currently returns test data
export const handler = async (): Promise<AllProducts | []> => {
  try {
    const { Items } = await db.query({
      TableName: process.env.OUTLISH_TABLE,
      KeyConditionExpression: "PK = :PK and begins_with(SK, :SK)",
      ExpressionAttributeValues: { ":PK": "Product", ":SK": "Product#" },
    });

    if (Items?.length === 0 || Items === undefined) {
      return [];
    } else {
      console.log({ result: Items.length, products: Items });
      return { result: Items.length, products: Items } as AllProducts;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
