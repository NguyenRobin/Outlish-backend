import { db } from "@src/core-setup/services/db";

// Test Data to play with for now.
export const handler = async () => {
  try {
    await db.batchWrite({
      RequestItems: {
        OutlishTable: products.map((product) => ({
          PutRequest: {
            Item: {
              PK: "Product",
              SK: `Product#${product.Id}`,
              EntityType: "Product",
              Name: product.Name,
              Description: product.Description,
              Price: product.Price,
              Inventory: product.Inventory,
              Category: product.Category,
              Image: product.Image,
              Id: product.Id,
            },
          },
        })),
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const products = [
  {
    Name: "T-shirt",
    Description: "En klassisk t-shirt i bomull med rund halsringning.",
    Price: 199,
    Inventory: 100,
    Image: "https://example.com/tshirt.jpg",
    Category: "Kläder",
    Id: "1",
  },
  {
    Name: "Jeans",
    Description: "Snygga och bekväma jeans i slim fit.",
    Price: 499,
    Inventory: 50,
    Image: "https://example.com/jeans.jpg",
    Category: "Kläder",
    Id: "2",
  },
  {
    Name: "Sneakers",
    Description: "Stilrena sneakers i vitt och grått.",
    Price: 799,
    Inventory: 25,
    Image: "https://example.com/sneakers.jpg",
    Category: "Skor",
    Id: "3",
  },
  {
    Name: "Klocka",
    Description: "En elegant klocka med svart urtavla och läderband.",
    Price: 1499,
    Inventory: 15,
    Image: "https://example.com/watch.jpg",
    Category: "Accessoarer",
    Id: "4",
  },
  {
    Name: "Väska",
    Description: "En praktisk och snygg väska i brunt läder.",
    Price: 999,
    Inventory: 30,
    Image: "https://example.com/bag.jpg",
    Category: "Accessoarer",
    Id: "5",
  },
  {
    Name: "Solglasögon",
    Description: "Stilrena solglasögon med svarta bågar och gröna glas.",
    Price: 499,
    Inventory: 40,
    Image: "https://example.com/sunglasses.jpg",
    Category: "Accessoarer",
    Id: "6",
  },
  {
    Name: "Mobiltelefon",
    Description: "En modern smartphone med avancerade funktioner.",
    Price: 8999,
    Inventory: 10,
    Image: "https://example.com/smartphone.jpg",
    Category: "Elektronik",
    Id: "7",
  },
  {
    Name: "Dator",
    Description: "En kraftfull bärbar dator för arbete och fritid.",
    Price: 12999,
    Inventory: 5,
    Image: "https://example.com/laptop.jpg",
    Category: "Elektronik",
    Id: "8",
  },
  {
    Name: "TV",
    Description: "En Smart TV med 4K-upplösning och HDR-teknik.",
    Price: 5999,
    Inventory: 20,
    Image: "https://example.com/tv.jpg",
    Category: "Elektronik",
    Id: "9",
  },
  {
    Name: "Kamera",
    Description: "En systemkamera med spegel och utbytbara objektiv.",
    Price: 9999,
    Inventory: 8,
    Image: "https://example.com/camera.jpg",
    Category: "Elektronik",
    Id: "10",
  },
  {
    Name: "Bok",
    Description: "En spännande roman om en dystopisk framtid.",
    Price: 199,
    Inventory: 100,
    Image: "https://example.com/book.jpg",
    Category: "Elektronik",
    Id: "11",
  },
];
