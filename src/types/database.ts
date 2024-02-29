export type Product = {
  Name: string;
  EntityType: "Product";
  Description: string;
  Price: number;
  Inventory: number;
  Image: string;
  Category: string;
  Id: string;
};

export type AllProducts = {
  result: number;
  products: Product[];
};
