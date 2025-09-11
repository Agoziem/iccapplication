/** * @param {{order:Order}} param0 */
const PaymentSuccesful = ({ order }) => {
  return (
    <div>
      <div>
        <h4>Thank you for your Order</h4>
        <p>Dear {order.customer.name} </p>
        <p>
          Your purchase of the following items is successful. Kindly check your
          dashboard for the record.
        </p>
      </div>

      <div>
        <p>your payment Reference is {order.reference}</p>
        <p>your Order ID is {order.id}</p>
        <p>
          Payment Date is{" "}
          {order.last_updated_date
            ? new Date(order.last_updated_date).toLocaleDateString()
            : "N/A"}
        </p>
      </div>

      {/* The Services available in the Order */}
      {order?.services.length > 0 && (
        <div>
          <p>Services</p>
          <ul>
            {order.services.map((service) => (
              <li key={service?.id}>
                {service.name} &#8358;{service.price}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* The Products available in the Order */}
      {order?.products.length > 0 && (
        <div>
          <p>Products</p>
          <ul>
            {order.products.map((product) => (
              <li key={product?.id}>
                {product.name} &#8358;{product.price}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* The Videos available in the Order */}
      {order?.videos.length > 0 && (
        <div>
          <p>Videos</p>
          <ul>
            {order.videos.map((video) => (
              <li key={video?.id}>
                {video.title} &#8358;{video.price}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* button to view Orders */}
      <div>
        <a href={`${process.env.NEXT_PUBLIC_URL}/dashboard/my-orders`}>
          view your Orders
        </a>
      </div>

      <div>
        <strong>Regards,</strong> Innovations Cybercafe
      </div>
    </div>
  );
};

export default PaymentSuccesful;
