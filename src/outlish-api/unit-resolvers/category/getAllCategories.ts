import { db } from "@src/core-setup/services/db";
import type { Category } from "@src/types/database";
import { AppSyncResolverHandler } from "aws-lambda";

export const handler: AppSyncResolverHandler<any, Category[]> = async () => {
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
    return Items as Category[];
  } catch (error) {
    console.log(error);
    throw error;
  }
};
