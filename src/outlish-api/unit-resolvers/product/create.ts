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

    await db.batchWrite({
      RequestItems: {
        OutlishTable: [
          {
            PutRequest: {
              Item: {
                PK: "Product",
                SK: `Product#${id}`,
                EntityType: "Product",
                Category,
                SubCategory: SubCategory ?? "",
                SubSubCategory: SubSubCategory ?? "",
                Section: Section ?? "",
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
                SK: `Product#${id}`,
                EntityType: "Category",
                Category,
                SubCategory: SubCategory ?? "",
                SubSubCategory: SubSubCategory ?? "",
                Section: Section ?? "",
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

    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
