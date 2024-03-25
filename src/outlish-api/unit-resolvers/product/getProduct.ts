import { AppSyncResolverHandler, AppSyncResolverEvent } from "aws-lambda";
import { db } from "@src/core-setup/services/db";
import type { ArgsInputID, Product } from "@src/types/database";

export const handler: AppSyncResolverHandler<ArgsInputID, Product> = async (
  event: AppSyncResolverEvent<ArgsInputID>
): Promise<Product> => {
  try {
    console.log(event);
    const { id } = event.arguments;

    const { Item } = await db.get({
      TableName: process.env.OUTLISH_TABLE,
      Key: {
        PK: `product`,
        SK: `product#${id}`,
      },
    });

    console.log(Item);
    return Item as Product;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
