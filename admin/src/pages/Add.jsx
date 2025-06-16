import React, { useState } from 'react';
import { assets } from '../assets/assets';
import axios from "axios";
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Add = ({ token }) => {
  // États images (tableau pour simplifier)
  const [images, setImages] = useState([false, false, false, false]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  
  // Catégories adaptées
  const categories = [
    "Beauté",
    "Bien-être",
    "Maison",
    "Accessoires",
    "Électronique",
    "Mode",
    "Nutrition",
    "Sport",
    "Parfums"
  ];

  // Sous-catégories adaptées (peuvent dépendre de la catégorie, mais ici en global)
  const subCategories = [
    // Beauté / Bien-être
    "Soins visage",
    "Huiles essentielles",
    "Compléments",
    "Autres soins",
    // Mode / Accessoires
    "Vêtements hommes",
    "Vêtements femmes",
    "Chaussures enfants",
    "Bijoux",
    "Sacs",
    // Maison
    "Ustensiles",
    "Décoration",
    // Électronique
    "Gadgets",
    "Accessoires tech",
    // Parfums
    "Eau de parfum",
    "Eau de toilette",
    "Parfum solide",
    // Sport / Nutrition
    "Nutrition sportive",
    "Équipement sportif"
  ];

  const [category, setCategory] = useState(categories[0]);
  const [subCategory, setSubCategory] = useState(subCategories[0]);
  const [bestSeller, setBestSeller] = useState(false);
  const [sizes, setSizes] = useState([]);

  // Gère la sélection des images dans le tableau
  const handleImageChange = (index, file) => {
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };

  // Tailles proposées, tu peux adapter selon besoin
  const availableSizes = ["S", "M", "L", "XL", "XXL"];

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestSeller", bestSeller);
      formData.append("sizes", JSON.stringify(sizes));

      images.forEach((img, i) => {
        if (img) formData.append(`image${i + 1}`, img);
      });

      const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: { token },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        // Reset champs
        setName(""); 
        setDescription(""); 
        setPrice("");
        setImages([false, false, false, false]);
        setSizes([]);
        setCategory(categories[0]);
        setSubCategory(subCategories[0]);
        setBestSeller(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      toast.error(error.message || "Erreur lors de l'ajout du produit.");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      {/* Images */}
      <div>
        <p className='mb-2'>Images du produit</p>
        <div className='flex gap-2'>
          {images.map((img, i) => (
            <label key={i} htmlFor={`image${i + 1}`} className="cursor-pointer">
              <img 
                className='w-20 h-20 object-cover border border-gray-300 rounded' 
                src={!img ? assets.upload_area : URL.createObjectURL(img)} 
                alt={`image${i + 1}`} 
              />
              <input 
                type="file" 
                id={`image${i + 1}`} 
                hidden 
                accept="image/*"
                onChange={(e) => handleImageChange(i, e.target.files[0])} 
              />
            </label>
          ))}
        </div>
      </div>

      {/* Nom */}
      <div className='w-full'>
        <p className='mb-2'>Nom du produit</p>
        <input 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className='w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded' 
          type="text" 
          placeholder='Nom du produit' 
          required 
        />
      </div>

      {/* Description */}
      <div className='w-full'>
        <p className='mb-2'>Description</p>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          className='w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded' 
          placeholder='Décrivez brièvement ce produit' 
          required 
        />
      </div>

      {/* Catégorie / Sous-catégorie / Prix */}
      <div className='flex flex-col sm:flex-row gap-4 w-full sm:gap-8'>
        <div className="flex flex-col">
          <label className='mb-2 font-semibold' htmlFor="category">Catégorie</label>
          <select 
            id="category"
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            className='px-3 py-2 border border-gray-300 rounded'
          >
            {categories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="flex flex-col">
          <label className='mb-2 font-semibold' htmlFor="subCategory">Sous-catégorie</label>
          <select 
            id="subCategory"
            value={subCategory} 
            onChange={(e) => setSubCategory(e.target.value)} 
            className='px-3 py-2 border border-gray-300 rounded'
          >
            {subCategories.map((sub, idx) => <option key={idx} value={sub}>{sub}</option>)}
          </select>
        </div>

        <div className="flex flex-col">
          <label className='mb-2 font-semibold' htmlFor="price">Prix (F CFA)</label>
          <input 
            id="price"
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            className='px-3 py-2 border border-gray-300 rounded w-full sm:w-[120px]' 
            type="number" 
            placeholder='Prix en F CFA' 
            required 
            min="0"
            step="0.01"
          />
        </div>
      </div>

      {/* Tailles disponibles */}
      <div>
        <p className='mb-2 font-semibold'>Tailles disponibles</p>
        <div className='flex gap-3 flex-wrap'>
          {availableSizes.map(size => (
            <div 
              key={size} 
              onClick={() => setSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])} 
              className={`${sizes.includes(size) ? "bg-green-200 border-green-700" : "bg-gray-200"} cursor-pointer px-3 py-1 rounded border`}
            >
              {size}
            </div>
          ))}
        </div>
      </div>

      {/* Best Seller */}
      <div className='flex items-center gap-2 mt-2'>
        <input 
          type="checkbox" 
          id='bestSeller' 
          checked={bestSeller} 
          onChange={() => setBestSeller(prev => !prev)} 
          className="cursor-pointer"
        />
        <label className='cursor-pointer' htmlFor="bestSeller">Mettre en avant (meilleure vente)</label>
      </div>

      <button 
        className='w-28 py-3 mt-4 bg-green-700 hover:bg-green-900 text-white rounded' 
        type='submit'
      >
        AJOUTER
      </button>
    </form>
  );
};

export default Add;
