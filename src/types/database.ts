// data structure
export type Product = {
  PK?: string;
  SK?: string;
  name: string;
  entityType: "product";
  description: string;
  price: number;
  inventory: number;
  image: string;
  category: string;
  subCategory: string;
  subSubCategory?: string;
  slug: string[];
  id: string;
};

export type ProductByCategory = {
  PK?: string;
  SK?: string;
  name: string;
  entityType: "category";
  description: string;
  price: number;
  inventory: number;
  image: string;
  category: string;
  subCategory?: string;
  subSubCategory?: string;
  slug?: string[];
  id: string;
};

// response data
export type AllProducts = {
  result: number;
  products: Product[];
};

// response data
export type AllProductsBySubCategory = {
  result: number;
  products: ProductByCategory[];
};

// response data
export type AllProductsByCategory = {
  category: string;
  result: number;
  products: Product[];
};

// response data
export type Category = {
  category: string;
  subCategory?: string[];
  subSubCategory?: string[];
};

// event.argument.id
export type ID = {
  id: string;
};

// event.arguments.input
export type ProductArgsInput = {
  input: {
    name?: string;
    category?: string;
    subCategory?: string;
    subSubCategory?: string;
    description?: string;
    image?: string;
    inventory?: number;
    price?: number;
    section?: string;
    seller?: string;
    slug?: string;
  };
};

// event.arguments.input
export type CategoryArgsInput = {
  input: {
    category: string;
    subCategory?: string;
    subSubCategory?: string;
  };
};
