// Модель Position (позиция в заказе)
export class Position {
  constructor(id, product, count) {
    this.id = id; // Уникальный идентификатор позиции
    this.product = product; // Информация о товаре
    this.count = count; // Количество товара
    this.cost = product.price * count; // Стоимость позиции
  }

  // Метод для преобразования в объект (для Firestore)
  toFirestore() {
    return {
      id: this.id,
      product: {
        id: this.product.id,
        title: this.product.title,
        price: this.product.price,
        imageUrl: this.product.imageUrl,
        descript: this.product.descript,
      },
      count: this.count,
      cost: this.cost,
    };
  }
}

// Модель Order (заказ)
export class Order {
  constructor(id, userID, positions, date, status, cost) {
    this.id = id;
    this.userID = userID;
    this.positions = Array.isArray(positions) ? positions : []; // Гарантируем, что positions — массив
    this.date = date;
    this.status = status;
    this.cost = cost;
  }

  // Метод для преобразования в объект (для Firestore)
  toFirestore() {
    if (!Array.isArray(this.positions)) {
      console.error('Positions is not an array:', this.positions);
      return {};
    }

    return {
      id: this.id,
      userID: this.userID,
      positions: this.positions.map((position) => {
        if (!position.product) {
          console.error('Product is missing in position:', position);
          return null;
        }

        return {
          id: position.id,
          cost: position.cost,
          count: position.count,
          price: position.product.price,
          title: position.product.title,
        };
      }).filter(Boolean), // Убираем null из массива
      date: this.date,
      status: this.status,
      cost: this.cost,
    };
  }
}