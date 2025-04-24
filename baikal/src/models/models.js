
export class Position {
  constructor(id, product, count) {
    this.id = id; 
    this.product = product; 
    this.count = count; 
    this.cost = product.price * count; 
  }

  
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


export class Order {
  constructor(id, userID, positions, date, status, cost) {
    this.id = id;
    this.userID = userID;
    this.positions = Array.isArray(positions) ? positions : []; 
    this.date = date;
    this.status = status;
    this.cost = cost;
  }

  
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
      }).filter(Boolean), 
      date: this.date,
      status: this.status,
      cost: this.cost,
    };
  }
}