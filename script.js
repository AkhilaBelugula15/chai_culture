const products = [
  {
    name: "Royal Cardamom Bloom",
    price: "$48",
    description: "A luxurious chai infused with aromatic cardamom.",
    image: "images/bloom.png"
  },
  {
    name: "Masala Heritage Fusion",
    price: "$48",
    description: "A bold blend of traditional Indian spices.",
    image: "images/masala.png"
  },
  {
    name: "Zesty Ginger Elixir",
    price: "$48",
    description: "A warming ginger-forward chai with a royal kick.",
    image: "images/ginger.png"
  }
];

const productList = document.getElementById("product-list");

products.forEach(product => {
  const card = document.createElement("div");
  card.className = "product-card";

  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h3>${product.name}</h3>
    <p>${product.description}</p>
    <span>${product.price}</span>
  `;

  productList.appendChild(card);
});
