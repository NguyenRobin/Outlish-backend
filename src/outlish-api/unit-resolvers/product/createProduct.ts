import { db } from "@src/core-setup/services/db";
import { generateId } from "@src/core-setup/utils";
import { ProductArgsInput } from "@src/types/database";
import { AppSyncResolverEvent, AppSyncResolverHandler } from "aws-lambda";

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
      Designer,
      Seller,
      Slug,
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
                Designer,
                Seller,
                Slug,
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
                Designer,
                Seller,
                Slug,
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
