import { db } from "@src/core-setup/services/db";

// This function should return some dummy data like products later
export const handler = async (event: any) => {
  console.log("getProducts", event);
  try {
    const params = {
      TableName: process.env.OUTLISH_TABLE,
    };
    const response = await db.scan(params);

    console.log("data", response.Items);
    return response.Items;
  } catch (error) {
    console.log(error);
  }
};
