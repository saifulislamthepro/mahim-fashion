export const dynamic = "force-dynamic";


import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import "../new-arrival/style.css";
import Image from "next/image";
import Featured from "@/components/Featured";

export default async function ProductList() {
    await connectDB();
    const products = JSON.parse(JSON.stringify(await Product.find({featured: true}).lean()));

    return (
        <div className="products-container">
            <div className="flex">
                <section className="grid">
                    {products.map((p: any) => (
                        <a href={`/product/${p._id}`} key={p._id} className="product-card">
                            <div className="img-box">
                                <div className="img">
                                    <Image fill src={p.images[0]} alt={p.title} loading="lazy" />
                                </div>
                            </div>

                            <div className="details">
                                <h3>{p.title}</h3>
                                <p className="price">৳{p.price}</p>
                                <button className="view-btn">View Details</button>
                            </div>
                        </a>
                    ))}                    
                </section>
            </div>
        </div>
    );
}
