import { db } from "@src/core-setup/services/db";

// Currently returns test data
export const handler = async () => {
  try {
    const { Items } = await db.query({
      TableName: process.env.OUTLISH_TABLE,
      KeyConditionExpression: "PK = :PK and begins_with(SK, :SK)",
      ExpressionAttributeValues: { ":PK": "Product", ":SK": "Product#" },
    });

    return { result: Items?.length, products: Items };
  } catch (error) {
    console.log(error);
  }
};
