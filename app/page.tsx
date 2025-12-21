export const dynamic = "force-dynamic";

import "./style.css";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

import Categories from "@/components/Categories";
import Featured from "@/components/Featured";
import Hero from "@/components/Hero";
import Products from "@/components/Products";

import { ProductType } from "@/types/product";
import { CategoryType } from "@/types/category";
import CatProductSlider from "@/components/CatProducts";


export default async function Home() {
  await connectDB();

  const products: ProductType[] =JSON.parse(JSON.stringify( await Product.find({})));
  const categories: CategoryType[] = JSON.parse(JSON.stringify( await Category.find({})));

  return (
    <div className="page">
      <head>
        <title>Ravaa fashion</title>
        <meta name="description" content="Ravaa fashion is the fastest growing brand in Bangladesh" />
      </head>
      <div className="flex">
        <Hero />
      </div>

      <div className="categories flex">
        <Categories />
      </div>

      <div className="featured-products">
        <Products products={products} />
      </div>

      <div className="cat-container flex">
        {categories.map((cat) => {
          // Filter products for this category
          const matchedProducts = products.filter(
            (p) => p.category === cat.slug
          );

          // If no products for this category → skip rendering
          if (matchedProducts.length === 0) return null;

          return (
            <section className="grid" key={cat.slug}>
              {/* LEFT SIDE */}
               <a className="texts" href={`category/${cat.slug}`}>
                <div className="flex ">
                  {cat.image &&<img src={cat.image} alt={cat.slug}/>}
                  <h1>{cat.name}</h1>
                </div>
              </a>

              {/* RIGHT SIDE — pass full filtered array ONCE */}
              <div className="cat-product">
                <CatProductSlider products={matchedProducts} />
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
