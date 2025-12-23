export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/db";
import ProductModel from "@/models/Product";
import Products from "@/components/Products";
import SizeQty from "@/components/SizeQty";
import "./style.css"
import { title } from "process";
import ImageGallery from "@/components/ImageGallery";

export default async function Product ({ params }: { params:Promise< { id: string }> }) {
const param = await params;

await connectDB()

const product = JSON.parse(JSON.stringify(
  await ProductModel.findById(param.id)
));

const relatedProducts = JSON.parse(JSON.stringify(
  await ProductModel.find({category: product.category, _id: { $ne: product._id }
})
));

    return(
        <div className="single-product page flex">
            <div className="single-product-container">
                <section>
                    <div className="shortcuts">
                        <p><a href="/"><i className="fa fa-home" aria-hidden="true"></i></a>   /   <a href={`/category/${product.category}`}>{product.category}</a>   /   <a href={product._id}>{product._id}</a></p>
                    </div>
                </section>
                <section className="main-section">
                    <div className="container grid">
                        <div className="image-gallery">
                            <ImageGallery images={product.images}/>
                        </div>
                        <div className="details">
                            <h2>{product.title}</h2>
                            <SizeQty id={product._id} stock={product.stock} price={product.price} productId={param.id} title={product.title} images={product.images}/>  

                    <div className="description"> 
                        <div className="desc-container">
                            <div className="description-viewer" dangerouslySetInnerHTML={{ __html: product.description }} />
                        </div>
                    </div> 

                        </div>
                    </div>
                    <div className="related">
                        <h2>Related Products</h2>
                        <Products products={relatedProducts}/>
                    </div>
                </section>
            </div>
        </div>
    )
}