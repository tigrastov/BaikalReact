import foto from '/yagoda.jpg'; // Импорт картинки



function Info() {
  return (
    <div className="info-container">
      <div className="info-text">
        <h3>About Us</h3>

        <p>Company is a food manufacturing company from Belgrade, Serbia. We specialize in the production of frozen semi-finished products, as well as various salads, confectionery - everything that requires preparations and labor-intensive manual cooking process. 
          Thus, we try to implement a service that saves your time and effort. The product catalog contains a basic list of popular products, which we try to always keep in stock. We also make some dishes on an individual order basis.
           We deliver finished products around the city by ourselves free of charge for the client. You can place an order in various ways: through the application, by phone, through messages in Telegram and Instagram.</p>

           <h3>Delivery</h3>
           <p>The Baikal company delivers products in Belgrade free of charge for the client. 
            Delivery of frozen products requires a special approach to organizing the process. 
            Therefore, the assembly and assembly of orders must be done in advance. 
            In this process, dialogue between the contractor and the client is very important to determine the exact location and time of delivery of the order. 
            Therefore, each order is individually discussed by phone or in messages. We try to deliver the order to the client's address on the day of the order or the next day. 
            If we are talking about items that are made individually for the client, the conditions are discussed separately. We value each client. 
            Call - write, and we will agree on everything.
           </p>
 

           <img src="/yagoda.jpg" alt="Icon 1" className="yagoda" />


      </div>

      <div className="info-bg">
      <div className="info-overlay">
      <span class="phone-number">+7 (999) 123-45-67</span>
          <p>
            <a href="https://telegram.org/" target="_blank" rel="noopener noreferrer"> Telegram</a>
            </p>
          <p><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></p>
        </div>
        {/* Первый контейнер для иконки */}
        <div className="icon1-container">
          <img src="/icons1.png" alt="Icon 1" className="icon" />
        </div>

        {/* Второй контейнер для иконки */}
        <div className="icon2-container">
          <img src="/icons2.png" alt="Icon 2" className="icon" />
        </div>
      </div> {/* Правая половина с фоном */}
    </div>
  );
}

export default Info;