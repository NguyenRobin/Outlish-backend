import { db } from "@src/core-setup/services/db";
import { AppSyncResolverHandler } from "aws-lambda";

export const handler: AppSyncResolverHandler<any, any> = async () => {
  try {
    const { Items } = await db.query({
      TableName: process.env.OUTLISH_TABLE,
      KeyConditionExpression: "PK = :PK and begins_with(SK, :SK)",
      ExpressionAttributeValues: { ":PK": "Category", ":SK": "Category#" },
    });

    console.log(Items);
    return Items;
  } catch (error) {
    console.log(error);
  }
};
