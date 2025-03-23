import React, { useState } from "react";
import { db, storage } from "../firebase"; // Импортируем Firestore и Storage
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AddProductModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Загружаем изображение в Firebase Storage
      const storageRef = ref(storage, `products/${image.name}`);
      await uploadBytes(storageRef, image);
      const imageUrl = await getDownloadURL(storageRef);

      // Добавляем товар в Firestore
      const docRef = await addDoc(collection(db, "products"), {
        title,
        price: parseInt(price, 10),
        description,
        imageUrl,
        createdAt: new Date(),
      });

      console.log("Product added with ID: ", docRef.id);
      onClose(); // Закрываем модальное окно после успешного добавления
    } catch (error) {
      console.error("Error adding product: ", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-modal-button" onClick={onClose}>
          &times;
        </button>
        <h2>Add Product</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Price:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Image:</label>
            <input type="file" onChange={handleImageChange} required />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;