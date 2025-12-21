import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Products from "@/components/Products";
import Categories from "@/components/Categories";
import Category from "@/models/Category";
import { CategoryType } from "@/types/category";
import SearchButton from "@/components/SearchProduct";
import { Key } from "react";
import './style.css';



export default async function ({ params }: { params: Promise<{ category: string }>}) {
    await connectDB();
    const param = await params;
    const categories = JSON.parse(JSON.stringify( await Category.find({})));
    const products =JSON.parse(JSON.stringify( await Product.find({category: param.category})));


    return(
        <div className="category-product-page page">
            <div className="flex">
                <section className="grid">
                    <div className="filter-component">
                        {categories.map((cat: CategoryType, i: number) => (
                        <a href={`${cat.slug}`} className="cat-card flex" key={i}>
                            {cat.image && 
                            <img className="img" src={cat.image} alt={cat.name} />}
                            <h2>{cat.name}</h2>
                        </a>
                        ))}
                    </div>
                    <div className="products-list">
                        <div className="search-container flex">
                        <SearchButton/>
                        </div>
                    <Products products={products}/>
                    </div>
                </section>
            </div>
        </div>
    )
}