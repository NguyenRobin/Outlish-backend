import { AppSyncResolverHandler, AppSyncResolverEvent } from "aws-lambda";
import { db } from "@src/core-setup/services/db";
import type { ID, Product } from "@src/types/database";

export const handler: AppSyncResolverHandler<ID, Product> = async (
  event: AppSyncResolverEvent<ID>
): Promise<Product> => {
  try {
    console.log(event);
    console.log(event.arguments.id);

    const { Item } = await db.get({
      TableName: process.env.OUTLISH_TABLE,
      Key: {
        PK: `Product#${event.arguments.id}`,
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
