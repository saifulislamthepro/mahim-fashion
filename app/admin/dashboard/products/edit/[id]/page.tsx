'use client';
import "./style.css";
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';

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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setProduct(prev => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value
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
    formData.append('featured', String( featured))

    imageFiles.forEach(file => formData.append("images", file));
    formData.append("existingImages", JSON.stringify(existingImages));

    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      body: formData
    });

    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      alert("❌ Failed to update product");
    }
  };

  if (loading) return <p>Loading...</p>;

  // ---------------------------------------------------------------------

  console.log(product);
  return (
    <div className="main-page flex ">
      <div className="flex">
        <section className="flex ">
          <form onSubmit={handleSubmit}>

            <div className="input-container flex column">
              <label>Name:</label>
              <input type="text" name="title" value={product.title} onChange={handleChange} />
            </div>

            <div className="input-container flex column">
              <label>Make Featured:</label>
              <input
                type="checkbox"
                name="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
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
            
            <div className="input-container">
                <div className="description-viewer" dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>

            {/* Description */}
            <div className="input-container flex column">
              <label>Description:</label>
              <textarea
                name="description"
                rows={8}
                value={product.description}
                onChange={handleChange}
              />
            </div>

            {/* IMAGES --------------------------------------------------- */}
            <div className="input-container flex ">
              <label>Images:</label>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} />

              {existingImages.map((src, i) => (
                <div key={i} className="image-container">
                  <img src={src} width={100} />
                  <i className="fa-solid fa-circle-xmark" onClick={() => handleImageDelete(i, true)}></i>
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

            <button type="submit" style={{ marginTop: "1rem" }}>
              Save Changes
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
