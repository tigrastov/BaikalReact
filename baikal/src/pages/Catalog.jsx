import React, { useState, useEffect, useContext } from "react";
import { collection, getDocs } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase"; 
import placeholderImage from "../assets/placeholder.jpg"; 
import { CartContext } from "../CartContext"; 
import LoadingScreen from "./LoadingScreen"; 

function Catalog() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const { addToCart } = useContext(CartContext);


  useEffect(() => {
    const fetchProducts = async () => {
      try {

        const productsCollection = collection(db, "products");
        const productsSnapshot = await getDocs(productsCollection);


        if (productsSnapshot.empty) {
          setError("No products found.");
          setLoading(false);
          return;
        }


        const productsData = await Promise.all(
          productsSnapshot.docs.map(async (doc) => {
            const product = doc.data();


            const productId = product.id || doc.id;

            let imageUrl;
            try {

              const imageRef = ref(storage, `products/${productId}`);
              imageUrl = await getDownloadURL(imageRef);
            } catch (error) {
              console.error(`Image not found for product ${productId}:`, error);

              imageUrl = placeholderImage;
            }


            return { ...product, id: productId, imageUrl };
          })
        );

        
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false); 
      }
    };

    fetchProducts(); 
  }, []);

  
  if (loading) {
    return <LoadingScreen />;
  }

  
  if (error) {
    return <div className="error-message">{error}</div>;
  }


  return (
    <div className="catalog">
      
      <div className="catalog-container">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            
            <img
              src={product.imageUrl}
              alt={product.title}
              className="product-image"
              onError={(e) => {
                e.target.src = placeholderImage; 
              }}
            />

            
            <h3 className="product-name">{product.title}</h3>

            
            <p className="product-price">{product.price} din</p>

            
            <p className="product-description">{product.descript}</p>

           
            <button
              className="add-to-cart"
              onClick={() => addToCart(product)} 
              aria-label={`Add ${product.title} to cart`}
            >
              <p>Add to Cart</p>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Catalog;