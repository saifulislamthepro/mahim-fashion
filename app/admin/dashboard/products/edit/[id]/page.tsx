'use client';
import "../../../create/style.css";
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';

import RichText from "@/components/RichText";

type Size = { name: string; stock: number };
type Product = {
  _id: string;
  productId: string,
  title: string;
  price: number;
  category: string;
  description: string;
  stock: Size[];
  images: string[];
  thumbnail: string;
};

type Category = {
  _id: string;
  name: string;
  slug: string;
  image: string;
};

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const router = useRouter();

  
    
    const [step, setStep] = useState(1);

    const next = () => setStep((s) => Math.min(s + 1, 5));
    const prev = () => setStep((s) => Math.max(s - 1, 1));

  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product>({
    _id: "",
    productId: "",
    title: "",
    price: 0,
    category: "",
    description: "",
    stock: [],
    images: [],
    thumbnail: ""
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const [newSize, setNewSize] = useState<Size>({ name: "", stock: 0 });
  const [sizeAndStock, setSizeAndStock] = useState<Size[]>([]);
  const [loading, setLoading] = useState(true);
  const [featured, setFeatured] = useState(false);

  // ✅ Load categories dynamically
  const loadCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  };

  // ✅ Fetch product by ID
  useEffect(() => {
    if (id) {
      Promise.all([
        loadCategories(),
        fetch(`/api/products/${id}`).then(res => res.json())
      ])
        .then(([_, prod]) => {
          setProduct(prod);
          setFeatured(prod.featured);
          setSizeAndStock(prod.stock || []);
          setExistingImages(prod.images || []);
          setLoading(false);
        })
        .catch(err => {
          console.error("❌ Product Fetch Error:", err);
          setLoading(false);
        });
    }
  }, [id]);

  // INPUT HANDLERS ------------------------------------------------------

    // input change
    const handleChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        > | { target: { name: string; value: string } }
    ) => {
        const { name, value } = e.target;
        setProduct((prev) => ({
            ...prev,
            [name]: name === "price" ? parseFloat(value) || 0 : value,
        }));
    };

  // New images
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setImageFiles(fileArray);

      const previews = fileArray.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  // Existing size-stock edit
  const handleExistingSizeChange = (i: number, field: keyof Size, value: string | number) => {
    setSizeAndStock(prev =>
      prev.map((item, index) =>
        index === i ? { ...item, [field]: field === "stock" ? Number(value) : value } : item
      )
    );
  };

  // Add size
  const handleAddNewSize = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!newSize.name || newSize.stock <= 0) return;

    setSizeAndStock(prev => [...prev, newSize]);
    setNewSize({ name: "", stock: 0 });
  };

  // Delete size
  const handleDeleteSize = (index: number) => {
    setSizeAndStock(prev => prev.filter((_, i) => i !== index));
  };

  // Delete image
  const handleImageDelete = (i: number, isExisting = true) => {
    let imgSrc = ""
    
    imgSrc = existingImages[i];

    const deleteImageFromDB = async() => {
      const res = await fetch('/api/images/delete', {
        method: "DELETE",
        body: JSON.stringify(imgSrc)
      })
      const data = await res.json();
    }
    deleteImageFromDB();

     if (isExisting) {
      setExistingImages(prev => prev.filter((_, idx) => idx !== i));
    } else {
      setImageFiles(prev => prev.filter((_, idx) => idx !== i));
      setImagePreviews(prev => prev.filter((_, idx) => idx !== i));
    } 
    
  };

  // SUBMIT --------------------------------------------------------------

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", product.title);
    formData.append("productId", product.productId);
    formData.append("price", String(product.price));
    formData.append("category", product.category);
    formData.append("description", product.description);
    formData.append("stock", JSON.stringify(sizeAndStock));
    formData.append('featured', String( featured));

    imageFiles.forEach(file => formData.append("images", file));
    formData.append("existingImages", JSON.stringify(existingImages));

    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      body: formData
    });

    if (res.ok) {
      router.push("/dashboard/products?menu=products");
    } else {
      alert("❌ Failed to update product");
    }
  };

  if (loading) return <p>Loading...</p>;

  // ---------------------------------------------------------------------

  console.log(product);
  return (
    <div className="edit-product-page">
      

            <div className="steps">
            {["Basic", "Stock", "Description", "Images", "Review"].map((s, i) => (
                <div key={i} className={step === i + 1 ? "step active" : "step"} onClick={() => setStep(i+1)}> {s}
                </div>
            ))}
            </div>
  
      <div className="">
        <section className="">
          <form onSubmit={handleSubmit}>

            
      {step === 1 && (

        <>

            <div className="input-container flex column">
              <label>Name:</label>
              <input type="text" name="title" value={product.title} onChange={handleChange} />
            </div>

            <div className="input-container featured flex">
              <label>Make Featured:</label>
              <input
                type="checkbox"
                name="featured"
                checked={featured}
                onChange={() => setFeatured(prev => !prev)}
              />
            </div>

            <div className="input-container flex column">
              <label>Product Id:</label>
              <input type="text" name="productId" value={product.productId} onChange={handleChange} />
            </div>

            <div className="input-container flex column">
              <label>Price:</label>
              <input
                type="number"
                name="price"
                value={String(product.price)}
                onChange={handleChange}
              />
            </div>

            <div className="input-container flex column">
              <label>Category:</label>

              {/* 🔥 Dynamic categories from DB */}
              <select name="category" value={product.category} onChange={handleChange}>
                <option value="">Select</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </>
            )}    

            {step === 2 && (
              <>
            {/* SIZES ---------------------------------------------------- */}
            <div className="input-container flex column">
              <h3>Edit Sizes & Stock</h3>
              {sizeAndStock.map((s, i) => (
                <div key={i} className="flex size-stock">
                  <input
                    type="text"
                    value={s.name}
                    onChange={e => handleExistingSizeChange(i, "name", e.target.value)}
                    placeholder="Size"
                    style={{ width: "80px", marginRight: "10px" }}
                  />
                  <input
                    type="number"
                    value={String(s.stock)}
                    onChange={e => handleExistingSizeChange(i, "stock", e.target.value)}
                    placeholder="Stock"
                    style={{ width: "80px", marginRight: "10px" }}
                  />
                  <div onClick={() => handleDeleteSize(i)} style={{ color: "red", cursor: "pointer" }}>
                    <i className="fa-solid fa-circle-xmark"></i>
                  </div>
                </div>
              ))}
            </div>

            {/* Add new size */}
            <div className="input-container flex size-stock">
              <input
                type="text"
                name="name"
                value={newSize.name}
                onChange={e => setNewSize(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Size"
              />
              <input
                type="number"
                name="stock"
                value={String(newSize.stock)}
                onChange={e => setNewSize(prev => ({ ...prev, stock: Number(e.target.value) }))}
                placeholder="Stock"
              />
              <button onClick={handleAddNewSize}>Add</button>
            </div>
              </>
            )}
            

            {step === 3 && (<>
            <div className="input-container">
                <div className="description-viewer" dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>

            {/* Description */}
            <div className="input-container flex column">
              <label>Description:</label>

                <RichText
                  value={product.description}
                  onChange={(html: string) =>
                  handleChange({
                  target: { name: "description", value: html },
                    })
                  }
                />
            </div>

            </>)}


            {step === 4 && (<>

            {/* IMAGES --------------------------------------------------- */}
            <div className="input-container flex ">
              <label>Images:</label>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} />

              {existingImages.map((src, i) => (
                <div key={i} className="image-container">
                  <img src={src} width={100} />
                  <p onClick={() => handleImageDelete(i, true)} style={{ color: "red", cursor: "pointer" }}>
                  <i className="fa-solid fa-circle-xmark" ></i>
                  Delete img
                  </p>
                </div>
              ))}
            </div>

            {imagePreviews.length > 0 && (
              <div className="image-preview-container">
                <h4>New</h4>
                {imagePreviews.map((src, i) => (
                  <img key={i} src={src} width={100} />
                ))}
              </div>
            )}

            </>)}

            {step === 5 && (
            <>
                <div className="product-preview">

                <h2>Product Preview</h2>

                {/* Basic Info */}
                <div className="preview-section">
                    <p><strong>Name:</strong> {product.title}</p>
                    <p><strong>Price:</strong> ৳{product.price}</p>
                    <p><strong>Product ID:</strong> {product.productId}</p>
                    <p><strong>Category:</strong> {product.category}</p>
                </div>

                {/* Sizes */}
                <div className="preview-section">
                    <h3>Sizes & Stock</h3>
                    {sizeAndStock.length === 0 && <p>No sizes added</p>}
                    {sizeAndStock.map((s, i) => (
                    <p key={i}>
                        Size: <strong>{s.name}</strong> — Stock: <strong>{s.stock}</strong>
                    </p>
                    ))}
                </div>

                {/* Description */}
                <div className="preview-section">
                    <h3>Description</h3>
                    <div
                    className="description-viewer"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                </div>

                {/* Images */}
                <div className="preview-section">
                    <h3>Images</h3>
                    <div className="image-preview-container">
                    {product.images.length === 0 && <p>No images selected</p>}
                    {product.images.map((src, i) => (
                        <img
                        key={i}
                        src={src}
                        alt="preview"
                        width={120}
                        className="image-preview"
                        />
                    ))}
                    </div>
                </div>

                {/* Submit */}
                <button type="submit" className="submit-btn">
                    Save Changes
                </button>
                </div>
            </>
            )}
          </form>

            <div className="form-nav">
            {step > 1 && <button type="button" onClick={prev}>Back</button>}
            {step < 5 && <button type="button" onClick={next}>Next</button>}
            </div>

        </section>
      </div>
    </div>
  );
}
