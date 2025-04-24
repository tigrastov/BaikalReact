import { db } from "./firebase"; 
import { collection, addDoc, doc, setDoc, Timestamp } from "firebase/firestore";
import { Order } from "./models/models"; 

const sendOrder = async (orderData) => {
  try {
    const ordersCollection = collection(db, "orders");


    const date = Timestamp.fromDate(new Date());

    
    const order = new Order(
      orderData.id || Date.now().toString(), 
      orderData.userID, 
      orderData.positions, 
      date, 
      orderData.status || "New",
      orderData.cost 
    );

   
    console.log("Order data to be sent:", order.toFirestore());

    
    if (!order.id || !order.userID || !order.positions || !order.date || !order.status || !order.cost) {
      throw new Error("Invalid order data");
    }

    
    const orderRef = doc(ordersCollection, order.id);
    await setDoc(orderRef, {
      id: order.id,
      userID: order.userID,
      date: order.date, 
      status: order.status,
      cost: order.cost,
    });

    
    const positionCollection = collection(orderRef, "position");
    for (const position of order.positions) {
      
      if (!position.id || !position.cost || !position.count || !position.product || !position.product.price || !position.product.title) {
        console.error("Invalid position data:", position);
        continue; 
      }

      
      await addDoc(positionCollection, {
        id: position.id,
        cost: position.cost,
        count: position.count,
        price: position.product.price, 
        title: position.product.title, 
      });
    }

    console.log("Order sent with ID:", order.id);
    return order.id; 
  } catch (error) {
    console.error("Error sending order:", error);
    throw error;
  }
};

export default sendOrder;