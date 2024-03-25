// data structure
export type Product = {
  PK?: string;
  SK?: string;
  name: string;
  entityType: "product";
  description: string;
  price: number;
  inventory: number;
  image: Images;
  category: string;
  subCategory: string;
  subSubCategory?: string;
  slug: Slug;
  id: string;
};

// data structure
type Images = {
  image_xs: string;
  image_small: string;
  image_medium: string;
  image_large: string;
  image_original: string;
};

// data structure
export type Slug = {
  name: string;
  category: string;
  subCategory: string;
  subSubCategory: string;
  description: string;
  seller: string;
};

// data structure
export type ProductByCategory = {
  PK?: string;
  SK?: string;
  name: string;
  entityType: "category";
  description: string;
  price: number;
  inventory: number;
  image: Images;
  category: string;
  subCategory?: string;
  subSubCategory?: string;
  slug?: string[];
  id: string;
};

// data structure
export type NewCategory = {
  PK?: string;
  SK?: string;
  category: string;
  subCategory: string;
  subSubCategory: string;
};

// response data
export type AllProducts = {
  result: number;
  products: Product[];
};

// response data
export type ProductsByCategory = {
  category: string;
  result: number;
  products: Product[];
};

// response data
export type Category = {
  name: string;
  slug?: string;
  subCategory?: SubCategory[];
};

// data structure
type SubCategory = {
  name?: string;
  slug?: string;
  subSubCategory?: SubSubCategory[];
};

// data structure
type SubSubCategory = {
  name?: string;
  slug?: string;
};

// event.argument.id from client
export type ArgsInputID = {
  id: string;
};

// event.arguments.input from client
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
    seller?: string;
    slug?: string;
  };
};

// event.arguments.input from client
export type CategoryArgsInput = {
  input: {
    category: string;
    subCategory?: string;
    subSubCategory?: string;
  };
};
