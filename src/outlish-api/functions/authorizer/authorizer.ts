import { db } from "@src/core-setup/services/db";

// This function should be called before being able to access some ADMIN ONLY request in database.
export const handler = async (event: any) => {
  console.log("AUTHORIZER", event);
  try {
    return {
      isAuthorized: true,
    };
  } catch (error) {
    console.log(error);
  }
};
