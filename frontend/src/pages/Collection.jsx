import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import assets from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilters, setShowFilters] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [Category, setCategory] = useState([]);
  const [SousCategory, setSousCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');

  const allCategories = [
    'Huiles', 'Compléments', 'Cosmétiques', 'Épicerie', 'Hygiène', 'Bien-être',
    'Vêtements Homme', 'Vêtements Femme', 'Vêtements Enfant',
    'Chaussures Homme', 'Chaussures Femme', 'Chaussures Enfant',
    'Téléphones Android', 'iPhones', 'Ordinateurs'
  ];

  const allSousCategories = [
    'Huile végétale', 'Gélules', 'Savon', 'Infusion', 'Crème', 'Graines',
    'T-shirts', 'Robes', 'Pantalons', 'Jeans', 'Sneakers', 'Sandales',
    'iPhone 13', 'Samsung', 'MacBook', 'HP', 'Tablette', 'Accessoires'
  ];

  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory(prev =>
      prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
    );
  };

  const toggleSousCategory = (e) => {
    const value = e.target.value;
    setSousCategory(prev =>
      prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
    );
  };

  const applyFilterAndSort = () => {
    if (!products || products.length === 0) {
      setFilterProducts([]);
      return;
    }

    let result = [...products];

    // Filtres
    if (showSearch && search.trim() !== '') {
      result = result.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (Category.length > 0) {
      result = result.filter(item => Category.includes(item.category));
    }
    if (SousCategory.length > 0) {
      result = result.filter(item => SousCategory.includes(item.subCategory));
    }

    // Tri
    switch (sortType) {
      case 'low-high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'high-low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'az':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'za':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break; // pertinence = ordre original
    }

    setFilterProducts(result);
  };

  useEffect(() => {
    applyFilterAndSort();
  }, [products, search, showSearch, Category, SousCategory, sortType]);

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10'>
      {/* Filtres */}
      <div className='min-w-60'>
        <p
          onClick={() => setShowFilters(!showFilters)}
          className='my-2 text-xl cursor-pointer flex items-center gap-2'
        >
          FILTRES
          <img
            src={assets.icons.dropdown}
            className={`h-3 sm:hidden ${showFilters ? 'rotate-90' : ''}`}
            alt=""
          />
        </p>

        {/* Catégories */}
        <div className={`border border-gray-300 pl-5 py-3 mt-4 ${showFilters ? 'block' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-semibold'>CATÉGORIES</p>
          <div className='flex flex-col gap-2 text-sm text-gray-700'>
            {allCategories.map((cat, i) => (
              <label key={i} className='flex gap-2 items-center'>
                <input type="checkbox" className='w-3' value={cat} onChange={toggleCategory} />
                {cat}
              </label>
            ))}
          </div>
        </div>

        {/* Sous-catégories */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilters ? 'block' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-semibold'>SOUS-CATÉGORIES</p>
          <div className='flex flex-col gap-2 text-sm text-gray-700'>
            {allSousCategories.map((sub, i) => (
              <label key={i} className='flex gap-2 items-center'>
                <input type="checkbox" className='w-3' value={sub} onChange={toggleSousCategory} />
                {sub}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className='flex-1'>
        <div className='flex justify-between items-center text-base sm:text-2xl mb-4'>
          <Title text1="TOUS" text2="LES PRODUITS" />
          <select
            onChange={(e) => setSortType(e.target.value)}
            className='border px-2 py-1 text-sm border-gray-300 rounded'
          >
            <option value="relevant">Trier : Pertinence</option>
            <option value="low-high">Prix croissant</option>
            <option value="high-low">Prix décroissant</option>
            <option value="az">Nom A-Z</option>
            <option value="za">Nom Z-A</option>
          </select>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {filterProducts.length > 0 ? (
            filterProducts.map((item, index) => (
              <ProductItem
                key={index}
                name={item.name}
                id={item._id}
                slug={item.slug}
                price={item.price}
                image={Array.isArray(item.image) && item.image.length > 0 ? item.image[0] : ''}
              />
            ))
          ) : (
            <p className='text-center text-gray-500 col-span-full'>Aucun produit trouvé.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
