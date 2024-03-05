import { db } from "@src/core-setup/services/db";
import { generateId } from "@src/core-setup/utils";
import { Product } from "@src/types/database";
import { AppSyncResolverEvent, AppSyncResolverHandler } from "aws-lambda";

type ProductArgsInput = {
  input: {
    Name: string;
    Category: string;
    SubCategory?: string;
    SubSubCategory?: string;
    Description: string;
    Image: string;
    Inventory: number;
    Price: number;
    Section?: "Mens" | "Womens" | "Kids";
  };
};

type ProductTest = {
  PK?: string;
  SK?: string;
  Name: string;
  EntityType: "Product";
  Description: string;
  Price: number;
  Inventory: number;
  Image: string;
  Category: string;
  SubCategory?: string;
  SubSubCategory?: string;
  Section?: "Mens" | "Womens" | "Kids";
  Id: string;
};

export const handler: AppSyncResolverHandler<ProductArgsInput, any> = async (
  event: AppSyncResolverEvent<ProductArgsInput>
): Promise<any> => {
  try {
    const {
      Name,
      Category,
      Description,
      Image,
      Inventory,
      Price,
      SubCategory,
      SubSubCategory,
      Section,
    } = event.arguments.input;
    const id = generateId();

    if (!Name || !Category || !Description || !Image || !Inventory || !Price) {
      throw new Error("Properties missting");
    }

    if (!SubCategory && !SubSubCategory) {
      await db.put({
        TableName: process.env.OUTLISH_TABLE,
        Item: {
          PK: `Category#${Category}`,
          SK: `Product#${id}`,
          EntityType: "Product",
          Category,
          Name,
          Description,
          Image,
          Inventory,
          Price,
          Id: id,
        },
      });
    }

    if (SubCategory && !SubSubCategory) {
      await db.batchWrite({
        RequestItems: {
          OutlishTable: [
            {
              PutRequest: {
                Item: {
                  PK: `Category#${Category}`,
                  SK: `Product#${id}`,
                  EntityType: "Product",
                  Category,
                  SubCategory,
                  Name,
                  Description,
                  Image,
                  Inventory,
                  Price,
                  Id: id,
                },
              },
            },
            {
              PutRequest: {
                Item: {
                  PK: `Category#${Category}`,
                  SK: `SubCategory#${SubCategory}#${id}`,
                  EntityType: "Subcategory",
                  Category,
                  SubCategory,
                  Name,
                  Description,
                  Image,
                  Inventory,
                  Price,
                  Id: id,
                },
              },
            },
          ],
        },
      });
    }

    if (SubCategory && SubSubCategory) {
      await db.batchWrite({
        RequestItems: {
          OutlishTable: [
            {
              PutRequest: {
                Item: {
                  PK: `Category#${Category}`,
                  SK: `Product#${id}`,
                  EntityType: "Product",
                  Category,
                  SubCategory,
                  SubSubCategory,
                  Name,
                  Description,
                  Image,
                  Inventory,
                  Price,
                  Id: id,
                },
              },
            },
            {
              PutRequest: {
                Item: {
                  PK: `Category#${Category}`,
                  SK: `SubCategory#${SubCategory}#${id}`,
                  EntityType: "Subcategory",
                  Category,
                  SubCategory,
                  Name,
                  Description,
                  Image,
                  Inventory,
                  Price,
                  Id: id,
                },
              },
            },
            {
              PutRequest: {
                Item: {
                  PK: `Category#${Category}`,
                  SK: `SubSubCategory#${SubSubCategory}#${id}`,
                  EntityType: "SubSubCategory",
                  Category,
                  SubCategory,
                  SubSubCategory,
                  Name,
                  Description,
                  Image,
                  Inventory,
                  Price,
                  Id: id,
                },
              },
            },
          ],
        },
      });
    }

    // await db.put({
    //   TableName: process.env.OUTLISH_TABLE,
    //   Item: {
    //     PK: `Product#${id}`,
    //     SK: `Product#${id}`,
    //     EntityType: "Product",
    //     Category,
    //     SubCategory,
    //     Name,
    //     Description,
    //     Image,
    //     Inventory,
    //     Price,
    //     Id: id,
    //   },
    // });

    // const newItem: ProductTest = {
    //   PK: `Product#${id}`,
    //   SK: `Product#${id}`,
    //   EntityType: "Product",
    //   Category,
    //   Name,
    //   Description,
    //   Image,
    //   Inventory,
    //   Price,
    //   Id: id,
    // };

    // const response = await db.put({
    //   TableName: process.env.OUTLISH_TABLE,
    //   Item: newItem,
    // });

    // await db.batchWrite({
    //   RequestItems: {
    //     OutlishTable: [
    //       {
    //         PutRequest: {
    //           Item: newItem,
    //           // Item: {
    //           //   PK: `Product#${id}`,
    //           //   SK: `Product#${id}`,
    //           //   EntityType: "Product",
    //           //   Name: product.Name,
    //           //   Description: product.Description,
    //           //   Price: product.Price,
    //           //   Inventory: product.Inventory,
    //           //   Category: product.Category,
    //           //   Image: product.Image,
    //           //   Id: id,
    //           // },
    //         },
    //       },
    //     ],
    //   },
    // });

    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
