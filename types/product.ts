

type Size  = {
    name: string;
    stock: number;
};
export type ProductType = {
  _id: string;
  title: string;
  price: number;
  productId: string;
  category: string;
  stock: Size[];
  description: string;
  images: string[];
  thumbnail: string;
};
