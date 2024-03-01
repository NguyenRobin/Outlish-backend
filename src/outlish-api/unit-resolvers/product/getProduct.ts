import { db } from "@src/core-setup/services/db";
import { Product } from "@src/types/database";
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-sdk";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<Product> => {
  try {
    console.log(event);
    console.log(event.arguments.id);

    const { Item } = await db.get({
      TableName: process.env.OUTLISH_TABLE,
      Key: {
        PK: "Product",
        SK: `Product#${event.arguments.id}`,
      },
    });
    console.log(Item);
    return Item as Product;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
