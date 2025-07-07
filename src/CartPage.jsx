import { useCart } from './CartContext';

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  const handleCheckout = async () => {
    const res = await fetch('http://localhost:5002/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart }),
    });

    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <div>
      <h1>Votre Panier</h1>
      {cart.length === 0 ? <p>Panier vide</p> : (
        <>
          {cart.map((item) => (
            <div key={item.id}>
              <h4>{item.name} x {item.quantity}</h4>
              <p>${item.price}</p>
              <button onClick={() => removeFromCart(item.id)}>Retirer</button>
            </div>
          ))}
          <button onClick={handleCheckout}>Payer avec Stripe</button>
        </>
      )}
    </div>
  );
}
