import { db } from "@src/core-setup/services/db";
import type { AllProducts } from "@src/types/database";

// Currently returns test data
export const handler = async (event: any) => {
  console.log(event);
  try {
    const { Items } = await db.query({
      TableName: process.env.OUTLISH_TABLE,
      KeyConditionExpression: "PK = :PK",
      ExpressionAttributeValues: {
        ":PK": `Category#${event.arguments.id}`,
      },
    });
    console.log(Items);
    if (Items?.length === 0 || Items === undefined) {
      return [];
    } else {
      console.log({ result: Items.length, products: Items });
      return { result: Items.length, products: Items };
    }

    // const cat = [...products];
    // const subCategory = products.filter((product) => product.SubCategory);
    // const subSubCategory = products.filter((product) => product.SubSubCategory);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const products = [
  {
    Inventory: 10,
    Image: "img.jpg",
    Price: 10,
    SK: "Product#52m26",
    SubCategory: "fasinon sub",
    Description: "2009 yehe",
    PK: "Category#kläder",
    Id: "52m26",
    Category: "kläder",
    EntityType: "Product",
    Name: "rt-whirt",
  },
  {
    Inventory: 10,
    Image: "img.jpg",
    Price: 10,
    SK: "Product#c1n35",
    SubCategory: "fasinon sub",
    Description: "fuck",
    PK: "Category#kläder",
    Id: "c1n35",
    Category: "kläder",
    EntityType: "Product",
    Name: "trainingshirt",
  },
  {
    Inventory: 10,
    Image: "img.jpg",
    Price: 10,
    SK: "Product#jt9at",
    SubCategory: "fasinon sub",
    Description: "fuck",
    PK: "Category#kläder",
    Id: "jt9at",
    Category: "kläder",
    EntityType: "Product",
    Name: "hooide",
  },
  {
    Inventory: 10,
    Image: "img.jpg",
    Price: 10,
    SK: "Product#xyp36",
    SubCategory: "fasinon sub",
    Description: "fuck",
    PK: "Category#kläder",
    Id: "xyp36",
    Category: "kläder",
    EntityType: "Product",
    Name: "aa vi testar",
  },
  {
    Inventory: 10,
    Image: "img.jpg",
    Price: 10,
    SK: "SubCategory#fasinon sub#52m26",
    SubCategory: "fasinon sub",
    Description: "2009 yehe",
    PK: "Category#kläder",
    Id: "52m26",
    Category: "kläder",
    EntityType: "Subcategory",
    Name: "rt-whirt",
  },
  {
    Inventory: 10,
    Image: "img.jpg",
    Price: 10,
    SK: "SubCategory#fasinon sub#c1n35",
    SubCategory: "fasinon sub",
    Description: "fuck",
    PK: "Category#kläder",
    Id: "c1n35",
    Category: "kläder",
    EntityType: "Subcategory",
    Name: "trainingshirt",
  },
  {
    Inventory: 10,
    Image: "img.jpg",
    Price: 10,
    SK: "SubCategory#fasinon sub#jt9at",
    SubCategory: "fasinon sub",
    Description: "fuck",
    PK: "Category#kläder",
    Id: "jt9at",
    Category: "kläder",
    EntityType: "Subcategory",
    Name: "hooide",
  },
  {
    Inventory: 10,
    Image: "img.jpg",
    Price: 10,
    SK: "SubCategory#fasinon sub#xyp36",
    SubCategory: "fasinon sub",
    Description: "fuck",
    PK: "Category#kläder",
    Id: "xyp36",
    Category: "kläder",
    EntityType: "Subcategory",
    Name: "aa vi testar",
  },
  {
    Inventory: 10,
    Image: "img.jpg",
    Price: 10,
    SK: "SubSubCategory#fashion sub sub#52m26",
    SubCategory: "fasinon sub",
    Description: "2009 yehe",
    PK: "Category#kläder",
    Id: "52m26",
    Category: "kläder",
    EntityType: "SubSubCategory",
    Name: "rt-whirt",
  },
  {
    Inventory: 10,
    Image: "img.jpg",
    Price: 10,
    SK: "SubSubCategory#fashion sub sub#c1n35",
    SubCategory: "fasinon sub",
    Description: "fuck",
    PK: "Category#kläder",
    Id: "c1n35",
    Category: "kläder",
    EntityType: "SubSubCategory",
    Name: "trainingshirt",
  },
  {
    Inventory: 10,
    Image: "img.jpg",
    Price: 10,
    SK: "SubSubCategory#fashion sub sub#jt9at",
    SubCategory: "fasinon sub",
    Description: "fuck",
    PK: "Category#kläder",
    Id: "jt9at",
    Category: "kläder",
    EntityType: "SubSubCategory",
    Name: "hooide",
  },
  {
    Inventory: 10,
    Image: "img.jpg",
    Price: 10,
    SK: "SubSubCategory#fashion sub sub#xyp36",
    SubCategory: "fasinon sub",
    Description: "fuck",
    PK: "Category#kläder",
    Id: "xyp36",
    Category: "kläder",
    EntityType: "SubSubCategory",
    Name: "aa vi testar",
  },
];
