'use client'

import { useEffect, useState } from "react";
import { addToCart } from "./cartHelpers";
import "./SizeQty.css"

type Size  = {
    name: string;
    stock: number;
};

type Props = {
    id: string;
    stock: Size[],
    price: number,
    productId: string,
    title: string,
    images: string[]
}

export default function SizeQty({ stock, price, productId, images, title, id }: Props ) {
    const [mounted, setMounted] = useState(true);
    const [selectedSize, setSelectedSize] = useState<Size[]>(stock);
    const [qty, setQty] = useState(stock.reduce( (total, s)=> total + s.stock, 0));
    const [alert, setAlert] = useState("");




const handleAddToCart = () => {

    addToCart({
      productId,
      price,
      size: selectedSize,
      qty,
      title,
      images
    });

    setAlert("Added to cart!");
    window.location.href = '/cart';
  };
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
    return (
        <div className="client-container grid">
            <div className="size-quantity flex">
                

                {/* SIZE SELECT */}
                    <p>Size & qty:</p>
                <div className="size flex">
                        {stock.map((s, i) => (
                            <div
                                key={i}
                            >
                                {s.name} = {s.stock}
                            </div>
                        ))}
                </div>

                {/* QUANTITY SELECT */}
                <div className="qty flex">
                    <p>Qty:</p>
                    <div className="updater flex">
                        <strong></strong>
                        <strong>{qty}</strong>
                        <strong></strong>
                    </div>
                </div>

            </div>

            {/* BUTTONS */}

            <a onClick={handleAddToCart}>
                <button>Add to Cart</button>
            </a>
        </div>
    )
}
