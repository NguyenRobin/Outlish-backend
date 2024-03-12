export type Product = {
  PK?: string;
  SK?: string;
  Name: string;
  EntityType: "Product";
  Description: string;
  Price: number;
  Inventory: number;
  Image: string;
  Category: string;
  Id: string;
};

export type ProductOfCategory = {
  PK?: string;
  SK?: string;
  Name: string;
  EntityType: "Category";
  Description: string;
  Price: number;
  Inventory: number;
  Image: string;
  Category: string;
  SubCategory: string;
  Slug: string[];
  Id: string;
};

export type AllProducts = {
  result: number;
  products: Product[];
};

export type AllProductsBySubCategory = {
  result: number;
  products: ProductOfCategory[];
};

export type ID = {
  id: string;
};

export type ProductArgsInput = {
  input: {
    Name?: string;
    Category?: string;
    SubCategory?: string;
    SubSubCategory?: string;
    Description?: string;
    Image?: string;
    Inventory?: number;
    Price?: number;
    Section?: string;
    Designer?: string;
    Seller?: string;
    Slug?: string;
  };
};
