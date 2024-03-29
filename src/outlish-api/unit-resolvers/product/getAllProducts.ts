import { db } from "@src/core-setup/services/db";
import type { AllProducts } from "@src/types";
import { AppSyncResolverHandler } from "aws-lambda";

export const handler = async (): Promise<AllProducts | []> => {
  try {
    const { Items } = await db.query({
      TableName: process.env.OUTLISH_TABLE,
      KeyConditionExpression: "PK = :PK and begins_with(SK, :SK)",
      ExpressionAttributeValues: { ":PK": "product", ":SK": "product#" },
    });

    if (Items?.length === 0 || Items === undefined) {
      return [];
    } else {
      return { result: Items.length, products: Items } as AllProducts;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
