'use client'

import { useEffect, useState } from "react";
import Image from "next/image";


type Categories = {
  name: string,
  slug: string,
  image: string
}

export default function Categories () {
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<Categories []>([{
    name: "",
    slug: "",
    image: ""
  }]);

  useEffect(()=> {
    const fetchCategories = async() => {
      const res = await fetch('/api/categories')
      const data = await res.json();
      setCategories(data);
    }

    fetchCategories();
    setMounted(true);
  },[])

  if (!mounted) return null;
    return(
        <section className="grid flex">
          {categories.map((cat, i) => (
          <a href={`category/${cat.slug}`} className="cat-card" key={i}>
            {cat.image && 
            <img src={cat.image} alt={cat.name} width={150} height={160} loading="lazy" />}
            <h2>{cat.name}</h2>
          </a>
          ))}
        </section>
    )
}