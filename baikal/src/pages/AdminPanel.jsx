import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase"; // Импортируем Firestore и Storage
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AdminPanel = () => {
  const [orders, setOrders] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [ordersPerPage] = useState(10);

  
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [productLoading, setProductLoading] = useState(false);

  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersSnapshot = await getDocs(collection(db, "orders"));
        const ordersData = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

       
        const ordersWithDetails = await Promise.all(
          ordersData.map(async (order) => {
            
            const userDoc = await getDoc(doc(db, "users", order.userID));
            const userData = userDoc.data();

            
            const positionsCollection = collection(
              db,
              "orders",
              order.id,
              "position"
            );
            const positionsSnapshot = await getDocs(positionsCollection);
            const positionsData = positionsSnapshot.docs.map((posDoc) =>
              posDoc.data()
            );

            return {
              ...order,
              user: userData,
              positions: positionsData, 
            };
          })
        );

        setOrders(ordersWithDetails); 
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false); 
      }
    };

    fetchOrders();
  }, []);

  
  const formatDate = (date) => {
    if (!date) return "N/A";

    
    if (typeof date.toDate === "function") {
      return date.toDate().toLocaleString();
    }
   
    else if (typeof date === "string") {
      try {
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate.toLocaleString();
        }
      } catch (error) {
        console.log("Error parsing date:", error);
      }
    }
    
    else if (date instanceof Date) {
      return date.toLocaleString();
    }
    
    else if (typeof date === "number") {
      return new Date(date).toLocaleString();
    }

    return "N/A";
  };

  
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });

      
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      console.log("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  
  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
    const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
    return dateB - dateA; 
  });

  
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  
  const nextPage = () => {
    if (currentPage < Math.ceil(sortedOrders.length / ordersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };


  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setProductLoading(true);
  
    try {
      if (!image) {
        throw new Error("No image selected");
      }
  
      
      const productId = crypto.randomUUID();
  
      
      const storageRef = ref(storage, `products/${productId}`);
      await uploadBytes(storageRef, image);
      const imageUrl = await getDownloadURL(storageRef);
  
      
      const product = {
        id: productId,
        title,
        price: parseInt(price, 10),
        descript: description,
        imageUrl, 
        createdAt: new Date(),
      };
  
      
      await addDoc(collection(db, "products"), product);
  
      console.log("Product added with ID: ", productId);
      setIsAddProductModalOpen(false); 
      setTitle(""); 
      setPrice("");
      setDescription("");
      setImage(null);
    } catch (error) {
      console.error("Error adding product: ", error);
    } finally {
      setProductLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>; 
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <button
          className="add-product-button"
          onClick={() => setIsAddProductModalOpen(true)}
        >
          Add Product
        </button>
      </div>

      
      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Products</th>
              <th>Total Cost</th>
              <th>Status</th>
              <th>Change Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user?.name || "N/A"}</td>
                <td>{order.user?.email || "N/A"}</td>
                <td>{order.user?.phone || "N/A"}</td>
                <td>{order.user?.address || "N/A"}</td>
                <td>
                  {order.positions && order.positions.length > 0 ? (
                    <ul className="products-list">
                      {order.positions.map((position, index) => (
                        <li key={`${order.id}-${position.id}-${index}`}>
                          {position.product ? (
                            <>
                              <strong>{position.product.title}</strong> (x
                              {position.count}) - {position.cost} din
                            </>
                          ) : (
                            <>
                              <strong>{position.title}</strong> (x
                              {position.count}) - {position.cost} din
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "No positions found."
                  )}
                </td>
                <td>{order.cost || "N/A"} din</td>
                <td>
                  <span
                    className={`status-${order.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {order.status || "N/A"}
                  </span>
                </td>
                <td>
                  <select
                    value={order.status || "New"}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className={`status-select status-${order.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    <option value="New">New</option>
                    <option value="In progress">In progress</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Completed">Completed</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                </td>
                <td>{formatDate(order.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(sortedOrders.length / ordersPerPage)}
        </span>
        <button
          onClick={nextPage}
          disabled={
            currentPage === Math.ceil(sortedOrders.length / ordersPerPage)
          }
        >
          Next
        </button>
      </div>

     
      {isAddProductModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button
              className="close-modal-button"
              onClick={() => setIsAddProductModalOpen(false)}
            >
              &times;
            </button>
            <h2>Add Product</h2>
            <form onSubmit={handleAddProduct}>
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
              <button type="submit" disabled={productLoading}>
                {productLoading ? "Saving..." : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;