import { db } from "@src/core-setup/services/db";

// Test Data to play with for now.
export const handler = async () => {
  const id = generateId();
  try {
    await db.batchWrite({
      RequestItems: {
        OutlishTable: products.map((product) => ({
          PutRequest: {
            Item: {
              PK: `product`,
              SK: `product#${generateId()}`,
              entityType: "product",
              name: product.name,
              description: product.description,
              price: product.price,
              inventory: product.inventory,
              category: product.category,
              subCategory: product.subCategory,
              subSubCategory: product.subSubCategory,
              seller: product.seller,
              image: product.image,
              id: generateId(),
              slug: "",
            },
            PutRequest: {
              Item: {
                PK: `category`,
                SK: `category#${product.category}`,
                entityType: "category",
                name: product.name,
                description: product.description,
                price: product.price,
                inventory: product.inventory,
                category: product.category,
                subCategory: product.subCategory,
                subSubCategory: product.subSubCategory,
                seller: product.seller,
                image: product.image,
                id: generateId(),
                slug: "",
              },
            },
          },
        })),
      },
    });
  } catch (error) {
    console.log(error);
  }
};

function generateId(len = 5) {
  let id = "";
  let chars = "abcdefghijklmnopqrstuvqxyz1234567890";
  for (let i = 0; i < len; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

const products = [
  {
    subSubCategory: "Överdelar",
    subCategory: "Herr",
    slug: "",
    seller: "H&M",
    section: "",
    price: 100,
    name: "T-shirt med tryck",
    inventory: 10,
    image: "bild.jpg",
    description: "Sommarkläder",
    category: "Kläder",
  },
  {
    subSubCategory: "Underdelar",
    subCategory: "Dam",
    slug: "",
    seller: "Gina Tricot",
    section: "",
    price: 150,
    name: "Svarta jeans",
    inventory: 20,
    image: "bild2.jpg",
    description: "Snygga och bekväma jeans",
    category: "Kläder",
  },
  {
    subSubCategory: "Skor",
    subCategory: "Barn",
    slug: "",
    seller: "Lindex",
    section: "",
    price: 200,
    name: "Stövlar",
    inventory: 15,
    image: "bild3.jpg",
    description: "Varma och bekväma stövlar för vintern",
    category: "Kläder",
  },
  {
    subSubCategory: "Trädgårdsmöbler",
    subCategory: "Hem & fritid",
    slug: "",
    seller: "IKEA",
    section: "",
    price: 500,
    name: "Trädgårdsbord",
    inventory: 5,
    image: "bild4.jpg",
    description: "Stilrent och praktiskt trädgårdsbord",
    category: "Hem & fritid",
  },
  {
    subSubCategory: "Husgeråd",
    subCategory: "Hem & fritid",
    slug: "",
    seller: "Åhléns",
    section: "",
    price: 300,
    name: "Kastrullset",
    inventory: 10,
    image: "bild5.jpg",
    description: "Högkvalitativt kastrullset i rostfritt stål",
    category: "Hem & fritid",
  },
  {
    subSubCategory: "Sport & fritid",
    subCategory: "Fritid",
    slug: "",
    seller: "Intersport",
    section: "",
    price: 700,
    name: "Cykel",
    inventory: 3,
    image: "bild6.jpg",
    description: "Snabb och lätt mountainbike",
    category: "Fritid",
  },
  {
    subSubCategory: "Böcker",
    subCategory: "Underhållning",
    slug: "",
    seller: "Adlibris",
    section: "",
    price: 180,
    name: "Spännande thriller",
    inventory: 25,
    image: "bild7.jpg",
    description: "En fängslande bok du inte kan lägga ner",
    category: "Underhållning",
  },
  {
    subSubCategory: "Spel",
    subCategory: "Underhållning",
    slug: "",
    seller: "Elgiganten",
    section: "",
    price: 400,
    name: "TV-spel",
    inventory: 8,
    image: "bild8.jpg",
    description: "Actionfyllt spel med snygg grafik",
    category: "Underhållning",
  },
  {
    subSubCategory: "Skönhet",
    subCategory: "Hälsa & skönhet",
    slug: "",
    seller: "Kicks",
    section: "",
    price: 250,
    name: "Ansiktskräm",
    inventory: 12,
    image: "bild9.jpg",
    description: "Fuktgivande och återfuktande ansiktskräm",
    category: "Hälsa & skönhet",
  },
];
