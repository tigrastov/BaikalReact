import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export const fetchOrders = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "orders"));
    const orders = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return orders;
  } catch (error) {
    console.error("Ошибка чтения данных:", error);
    return [];
  }
};