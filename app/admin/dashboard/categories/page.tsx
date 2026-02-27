'use client'

import { useEffect, useState } from 'react'
import './style.css'
import { set } from 'mongoose';

type Category = {
  _id?: string;
  name: string;
  slug: string;
  image: string | File | null;
};

export default function Settings() {
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<Category>({
    name: '',
    slug: '',
    image: null,
  });
  const [preview, setPreview] = useState<string | null>(null);

  // ✅ Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchCategories();
  }, []);

  // ✅ Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewCategory({ ...newCategory, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ Handle text change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory({
      ...newCategory,
      [e.target.name]: e.target.value,
      slug:
        e.target.name === 'name'
          ? e.target.value.toLowerCase().replace(/\s+/g, '-')
          : newCategory.slug,
    });
  };

  // ✅ Submit new category
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.image) {
      alert('Please enter name and select image');
      return;
    }

    const formData = new FormData();
    formData.append('name', newCategory.name);
    formData.append('slug', newCategory.slug);
    formData.append('image', newCategory.image);

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to create category');

      const data = await res.json();
      setCategories((prev) => [...prev, data]);
      setNewCategory({ name: '', slug: '', image: null });
      setPreview(null);
    } catch (err) {
      console.error(err);
      alert('Error creating category');
    }
  };

  // ✅ Delete category
  const handleDelete = async (id: string) => {

    const category = categories.find((cat) => cat._id === id);
    if (!category) return;

    const imgUrl = category.image;

        const deleteImageFromDB = async() => {
      const res = await fetch('/api/images/delete', {
        method: "DELETE",
        body: JSON.stringify(imgUrl)
      })
      const data = await res.json();
    }

    if (!confirm('Delete this category?')) return;
    try {      
      deleteImageFromDB()
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
    } catch (err) {
      console.error(err);
      alert('Error deleting category');
    }
  };

  if (!mounted) return null;
  return (
    <div className='settings'>
      <div className='heading'>
        <h1><i className='fa fa-cog' aria-hidden='true'></i>Settings</h1>
      </div>

      <div className='categories sub-heading'>
        <h3><i className='fa-solid fa-folder-tree'></i>Categories</h3>

        <ul className='category-list'>
          {categories.map((cat) => (
            <li key={cat._id} className='list'>
              <div className="img-container">
                <img src={`${cat.image}`} alt={cat.slug} width={50} />
              </div>              
              <div className='cat-name flex'>  {cat.name}</div>
              <div className='btn-container flex'>
                <button onClick={() => handleDelete(cat._id as string)}>Delete</button>
              </div>
            </li>
          ))}

          <form onSubmit={handleSubmit}>
            <p>Add New Category</p>
            <input
              type='text'
              name='name'
              placeholder='Enter category name'
              value={newCategory.name}
              onChange={handleChange}
            />
            <input type='file' accept='image/*' onChange={handleImageChange} className='files'/>
            {preview && (
              <img
                src={preview}
                alt='preview'
                style={{
                  width: '60px',
                  height: '60px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                }}
              />
            )}
            <button type='submit'>Add Category</button>
          </form>
        </ul>
      </div>
    </div>
  );
}
