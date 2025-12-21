'use client';

import { useEffect, useState, ChangeEvent, MouseEvent, FormEvent } from "react";
import "./CreateProduct.css";

type Size = {
    name: string;
    stock: number;
};

type Category = {
    _id: string;
    name: string;
    slug: string;
    image: string;
};

type Product = {
    title: string;
    price: number;
    productId: string;
    category: string; // this should be only string
    stock: Size[];
    description: string;
    images: File[];
};

export default function CreateProduct() {
    const [mounted, setMounted] = useState(false);

    // sizes / stock
    const [size, setSize] = useState<Size>({ name: "", stock: 0 });
    const [sizeAndStock, setSizeAndStock] = useState<Size[]>([]);

    // product
    const [product, setProduct] = useState<Product>({
        title: "",
        price: 0,
        productId: "",
        category: "",
        stock: [],
        description: "",
        images: [],
    });

    // dynamic categories
    const [categories, setCategories] = useState<Category[]>([]);

    // images
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    // alerts
    const [alert, setAlert] = useState("");
    const [showAlert, setShowAlert] = useState(false);

    // ---------------------------------------
    // 📌 Fetch categories dynamically
    // ---------------------------------------
    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/categories");
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            console.error("❌ Failed to fetch categories", err);
        }
    };

    // image change
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const fileArray = Array.from(files);
            setImageFiles(fileArray);
            const previews = fileArray.map((file) => URL.createObjectURL(file));
            setImagePreviews(previews);
        }
    };

    // size input
    const handleSizeStockChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSize((prev) => ({
            ...prev,
            [name]: name === "stock" ? Number(value) || 0 : value,
        }));
    };

    // add size + stock
    const handleSave = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (size.name && size.stock > 0) {
            setSizeAndStock((prev) => [...prev, size]);
            setSize({ name: "", stock: 0 });
        }
    };

    // input change
    const handleChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setProduct((prev) => ({
            ...prev,
            [name]: name === "price" ? parseFloat(value) || 0 : value,
        }));
    };

    // submit
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", product.title);
        formData.append("price", String(product.price));
        formData.append("productId", product.productId);
        formData.append("category", product.category);
        formData.append("description", product.description);
        formData.append("stock", JSON.stringify(sizeAndStock));

        imageFiles.forEach((file) => {
            formData.append("images", file);
        });

        try {
            const res = await fetch("/api/products", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            console.log("✅ Created product:", data);

            // Reset form
            setProduct({
                title: "",
                price: 0,
                productId: "",
                category: "",
                stock: [],
                description: "",
                images: [],
            });

            setSizeAndStock([]);
            setImageFiles([]);
            setImagePreviews([]);

            setAlert("Product Created Successfully");
            setShowAlert(true);
        } catch (err) {
            console.error("❌ Error creating product:", err);
        }
    };

    useEffect(() => {
        setMounted(true);
        fetchCategories(); // fetch dynamic categories
    }, []);

    if (!mounted) return null;

    return (
        <div className="create-product">
            <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="input-container flex column">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="title"
                        value={product.title}
                        onChange={handleChange}
                    />
                </div>

                {/* Price */}
                <div className="input-container flex column">
                    <label>Price:</label>
                    <input
                        type="number"
                        name="price"
                        value={String(product.price)}
                        onChange={handleChange}
                    />
                </div>

                {/* product ID */}
                <div className="input-container flex column">
                    <label>Product ID:</label>
                    <input
                        type="text"
                        name="productId"
                        value={product.productId}
                        onChange={handleChange}
                    />
                </div>

                {/* Category */}
                <div className="input-container flex column">
                    <label>Category:</label>
                    <select
                        name="category"
                        value={product.category}
                        onChange={handleChange}
                    >
                        <option value="">Select</option>

                        {/* dynamically load categories here */}
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat.slug}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Show saved sizes */}
                <div className="input-container flex column">
                    {sizeAndStock.map((size, i) => (
                        <div key={i} className="size-stock">
                            <h3>
                                Size: {size.name} — Stock: {size.stock}
                            </h3>
                        </div>
                    ))}
                </div>

                {/* Add size/stock */}
                <div className="input-container flex size-stock">
                    <div className="flex column">
                        <label>Size:</label>
                        <input
                            type="text"
                            name="name"
                            value={size.name}
                            onChange={handleSizeStockChange}
                        />
                    </div>

                    <div className="flex column">
                        <label>Stock:</label>
                        <input
                            type="number"
                            name="stock"
                            value={String(size.stock)}
                            onChange={handleSizeStockChange}
                        />
                    </div>

                    <button onClick={handleSave}>Add</button>

                </div>
                <div className="desc-label"> 
                    <h3>Description:</h3> 
                </div> 
                <div className="input-container">
                     <div className="description-viewer" dangerouslySetInnerHTML={{ __html: product.description }} />
                </div>

                {/* Description */}
                <div className="desc-label">
                    <h3>Description:</h3>
                </div>

                <div className="input-container flex column">
                    <textarea
                        name="description"
                        rows={8}
                        value={product.description}
                        onChange={handleChange}
                    />
                </div>

                {/* Image input */}
                <div className="input-container flex column">
                    <label>Images:</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        required
                        onChange={handleImageChange}
                    />
                </div>

                {/* Image previews */}
                {imagePreviews.length > 0 && (
                    <div className="image-preview-container">
                        {imagePreviews.map((src, i) => (
                            <img
                                key={i}
                                src={src}
                                alt="preview"
                                width={100}
                                className="image-preview"
                                style={{ marginRight: "1rem" }}
                            />
                        ))}
                    </div>
                )}

                <button type="submit">Create</button>

            {/* Alert */}
            <div className={showAlert ? "showalert" : "alert"}>
                <div className="flex" onClick={() => setShowAlert(false)}>
                    <h3>{alert}</h3>
                    <i className="fa-solid fa-circle-xmark"></i>
                </div>
            </div>
            </form>
        </div>
    );
}
