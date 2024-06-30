let products = [];
let cart = [];
const notyf = new Notyf({
  position: {
    x: 'center',
    y: 'bottom'
  }
});

//Selector
const selectors = {
  products: document.querySelector(".products"),
  spinner: document.querySelector(".spinner-container"),
  cartQty: document.querySelector(".cart_qty"),
  cartTotal: document.querySelector(".cart-total"),
  cart_product: document.querySelector(".cart-product"),
  cartclear: document.querySelector(".cart_clear")

};

const setupListeners = () => {
  document.addEventListener("DOMContentLoaded", initStore);

  selectors.products.addEventListener("click", (e) => {
    if (e.target.classList.contains("add_to_cart")) {
      addToCart(e);
    }
  });
  selectors.cart_product.addEventListener("click", updateCart);
  selectors.cartclear.addEventListener("click", cleatCart);
};

const initStore = () => {
  loadCart();
  loadProducts("https://fakestoreapi.com/products")
    .then(renderProducts)
    .finally(renderCart);
};

const saveCart = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const loadCart = () => {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
};

const loadProducts = async (API_URI) => {
  try {
    const response = await fetch(API_URI);
    if (!response.ok) {
      throw new Error(`http error STATUS=${response.status}`);
    }
    products = await response.json();
    selectors.spinner.style.display = "none";

  } catch (err) {
    console.error("Fetch Error : ", err);
  }
};

const renderProducts = () => {
  selectors.products.innerHTML = products.map((product) => {
    const { id, title, image, price, category } = product;
    const inCart = cart.find((x) => x.id == id);
    const text = inCart ? "Added in Cart" : "Add to Cart";
    return `
    <div>
      <div class="card">
       <img src="${image}" class="card-img-top" alt="${title}" />
         <div class="card-body">
         <span class="text-muted">${category}</span>
           <h5 class="card-title">${title}</h5>
           <p class="card-title">$ ${price}</p>
           <hr/>
           <button class="btn btn-primary add_to_cart" data-id="${id}">${text}</button>
         </div>
       </div>
       </div>
    `;
  }).join("");
};

const addToCart = (e) => {
  // alert("btn is click");
  if (e.target.hasAttribute("data-id")) {
    const id = parseInt(e.target.dataset.id);
    const inCart = cart.find((x) => x.id === id);

    if (inCart) {
      notyf.error('Product already Cart.');
      return;
    } else {
      notyf.success('Product Successfully Carted.');
    }

    cart.push({ id, qty: 1 });
    saveCart();
    renderProducts();
    renderCart();
  }
};

const renderCart = () => {
  //show Cart Quantity in Navbar
  const cartQty = cart.reduce((sum, item) => {
    return sum + item.qty;
  }, 0);

  selectors.cartQty.textContent = cart.length;
  selectors.cartTotal.textContent = calculateTotal().toFixed(2);

  if (cart.length === 0) {
    notyf.error('Cart is Empty.');
    let img = `<img src='img.png' height='300px'>`;
    selectors.cart_product.innerHTML = img;
    return;
  }

  selectors.cart_product.innerHTML = cart
    .map(({ id, qty }) => {
      // get product info of each cart item
      const product = products.find((x) => x.id === id);

      const { title, image, price, category } = product;

      const amount = price * qty;

      return `
       <div class="row align-items-center mb-2">
         <div class="col-4">
           <img src="${image}" class="img-fluid" />
         </div>
         <div class="col-8">
           <h5 class="product-heading mb-1">${title}</h5>
           <p class="product-category text-muted mb-2">
             <small>${category}</small>
           </p>
           <p class="product-price mb-2">
             <strong>${price}</strong>
           </p>
           <div class="d-flex combo justify-content-between align-items-center">
              <div class="quantity-indicator d-flex align-items-center" data-id="${id}">
                  <button data-btn="decr" class="btn btn-sm btn-outline-primary px-2 py-0 decrease-qty">-</button>
                  <p class='px-3 mb-0 quantity'>${qty}</p>
                <button data-btn="incr" class="btn btn-sm btn-outline-primary px-2 py-0 increase-qty">+</button>
              </div>
              <span class="cart-item-price">
                ${amount}
              </span>
           </div>
         </div>
       </div>
       <hr/>`;
    })
    .join("");
};


const calculateTotal = () => {
  return cart.map(({ id, qty }) => {
    const { price } = products.find((x) => x.id === id);
    return qty * price;
  }).reduce((sum, number) => {
    return sum + number;
  }, 0);
};

const cleatCart = () => {
  cart = [];
  saveCart();
  renderCart();
  renderProducts();
}

const increaseQty = (id) => {
  const item = cart.find((x) => x.id === id);
  if (!item) return;
  item.qty++;
};

const decreaseQty = (id) => {
  const item = cart.find((x) => x.id === id);
  if (!item) return;

  item.qty--;

  if (item.qty === 0) removeFromCart(id);
};

const removeFromCart = (id) => {
  cart = cart.filter((x) => x.id !== id);
  renderProducts();
};

const updateCart = (e) => {
  if (e.target.hasAttribute("data-btn")) {
    const cartItem = e.target.closest(".quantity-indicator");
    const id = parseInt(cartItem.dataset.id);
    const btn = e.target.dataset.btn;

    btn === "incr" && increaseQty(id);
    btn === "decr" && decreaseQty(id);

    saveCart();
    renderCart();
  }
}



// start the store
setupListeners();















// 10.20lpa



































// let products_container = document.querySelector(".products_container");
// let count_cart = document.querySelector("#count_cart");
// let spinner = document.querySelector(".spinner-container");
// let add_to_cart = document.querySelector(".add_to_cart");
// // let cart_body = document.querySelector(".card-body");




// document.addEventListener('DOMContentLoaded', async () => {
//   const BASE_URI = "https://fakestoreapi.com/products";
//   // main_content.style.visibility = "visible";
//   const res = await fetch(BASE_URI);
//   const data = await res.json();
//   localStorage.setItem("products", JSON.stringify(data));
//   if (!localStorage.getItem("cart")) {
//     localStorage.setItem("cart", "[]");
//   }


//   let products = JSON.parse(localStorage.getItem("products"));

//   let cart = JSON.parse(localStorage.getItem("cart"));

//   // console.log(products);
//   // display data from display


//   products.forEach(product => {
//     let div = document.createElement("div");
//     let product_card = `
//       <div class="card">
//         <img src="${product.image}" class="card-img-top" alt="..." />
//         <div class="card-body">
//           <h5 class="card-title">${product.title}</h5>
//           <h5 class="card-title">Category : ${product.category}</h5>
//           <h5 class="card-title">Price : ${product.price}</h5>
//           <hr/>
//         </div>
//       </div>
//     `;
//     div.innerHTML = product_card;

//     let btn = document.createElement('button');
//     btn.classList.add("btn", "btn-primary");
//     btn.textContent = 'Add To Cart';
//     div.querySelector(".card-body").appendChild(btn);
//     btn.addEventListener("click", function () { addItemToCart(`${product.id}`) });
//     products_container.appendChild(div);
//   });


//   function addItemToCart(productId) {
//     let product = products.find((product) => {
//       return product.id == productId;
//     });
//     if (cart.lenngth === 0) {
//       cart.push(product);
//     } else {
//       // this line find the product availabel in cart or not
//       //product no male to undefind ave
//       let res = cart.find(element => element.id == element.productId);
//       if (res === undefined) {
//         cart.push(product);
//       }
//     }
//     // now add the product in the cart
//     localStorage.setItem("cart", JSON.stringify(cart));
//     // count_cart.innerText = cart.lenngth;
//   }
//   // product id argument is when click the btn that time get the btn id
//   // jeni uper click karu hoy teni sivay no array banavi store kari didho

//   function removeItemFromCart(productId) {
//     let temp = cart.filter(item => item.id != productId);
//     localStorage.setItem("cart", JSON.stringify(temp));
//   }
//   removeItemFromCart(1);


//   // in = object loop && of array loop
//   function updateQuantity(productId, quantity) {
//     for (product of cart) {
//       if (productId == product.id) {
//         product.quantity = quantity;
//       }
//     }
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }

//   function getTotal() {
//     let temp = cart.map((item) => {
//       return parseFloat(item.price);
//     });
//     let sum = temp.reduce((prev, next) => {
//       return prev + next;
//     }, 0)
//     console.log(sum);
//   }
//   // getTotal();
// });
// // document.write(products);
// let products_container = document.querySelector(".products_container");
// let count_cart = document.querySelector("#count_cart");
// let spinner = document.querySelector(".spinner-container");
// let show_cart_item = document.querySelector("#show_cart_item");
// let rm_quantity = document.querySelector(".combo");
// let carted_pro = document.querySelector("#carted_pro");



// let products = JSON.parse(localStorage.getItem("products"));
// let cart = JSON.parse(localStorage.getItem("cart"));
// async function storProductLocalstoraage() {
//   const BASE_URI = "https://fakestoreapi.com/products";
//   const res = await fetch(BASE_URI);
//   const data = await res.json();
//   spinner.style.display = "none";

//   localStorage.setItem("products", JSON.stringify(data));

//   if (!localStorage.getItem("cart")) {
//     localStorage.setItem("cart", "[]");
//   }

//   products.forEach(product => {
//     let div = document.createElement("div");
//     let product_card = `
//       <div class="card">
//         <img src="${product.image}" class="card-img-top" alt="..." />
//         <div class="card-body">
//         <span class="text-muted">${product.category}</span>
//           <h5 class="card-title">${product.title}</h5>
//           <p class="card-title">$ ${product.price}</p>
//           <hr/>
//         </div>
//       </div>
//     `;
//     div.innerHTML = product_card;

//     let btn = document.createElement('button');
//     btn.classList.add("btn", "btn-primary");
//     btn.textContent = 'Add To Cart';
//     btn.setAttribute("pro_id", `${product.id}`);
//     div.querySelector(".card-body").appendChild(btn);
//     btn.addEventListener("click", function () {
//       let produ_id = btn.getAttribute('pro_id');
//       addItemToCart(produ_id);
//       count_cart.innerText = cart.length;
//     });
//     products_container.appendChild(div);
//   });
// }

// storProductLocalstoraage();
// count_cart.innerText = cart.length;

// function addItemToCart(productId) {
//   let product = products.find(product => product.id == productId);
//   if (cart.length === 0) {
//     cart.push(product);
//   } else {
//     //find method is used aegs as callback
//     let res = cart.find(element => element.id == productId);
//     if (res === undefined) {
//       cart.push(product);
//     } else {
//       alert("product already carted");

//     }
//   }
//   localStorage.setItem("cart", JSON.stringify(cart));
// }

// function updateQuantity(productId, quantity) {
//   for (let product of cart) {
//     if (productId == product.id) {
//       product.quantity = quantity;
//     }
//   }
//   localStorage.setItem("cart", JSON.stringify(cart));
// }

// function removeItemFromCart(productId) {
//   cart = cart.filter(item => item.id != productId);
//   localStorage.setItem("cart", JSON.stringify(cart));
//   count_cart.innerText = cart.length;
//   show_cart_item_fn();
// }

// const RemoveItemFromCart = (cart_item) => {
//   removeItemFromCart(cart_item.id);
// }

// function show_cart_item_fn() {
//   // Clear the previous content
//   document.querySelector("#carted_pro").innerHTML = "";

//   // Iterate over the cart items and append each one to the #carted_pro
//   cart.forEach((items) => {
//     let card_data = `
//       <div class="row align-items-center mb-2">
//         <div class="col-4">
//           <img
//             src="${items.image}"
//             alt="Product"
//             class="img-fluid productImg rounded shadow-sm"
//           />
//         </div>
//         <div class="col-8">
//           <h5 class="product-heading mb-1">${items.title}</h5>
//           <p class="product-category text-muted mb-2">
//             <small>${items.category}</small>
//           </p>
//           <p class="product-price mb-2">
//             <strong>${items.price}</strong>
//           </p>
//           <div class="d-flex combo justify-content-between align-items-center">
//             <div class="quantity-indicator d-flex align-items-center" cart_id="${items.id}">
//               <button class="btn btn-sm btn-outline-primary px-2 py-0 decrease-qty">-</button>
//               <p class='px-3 mb-0 quantity'>1</p>
//               <button class="btn btn-sm btn-outline-primary px-2 py-0 increase-qty">+</button>
//             </div>
//           <button class="btn btn-sm btn-outline-danger remove-btn" cart_id="${items.id}">
//               Remove
//             </button>
//           </div>
//         </div>
//       </div>
//       <hr/>
//     `;
//     carted_pro.insertAdjacentHTML('beforeend', card_data);
//   });
//   document.querySelectorAll('.remove-btn').forEach(button => {
//     button.addEventListener('click', function () {
//       const itemId = this.getAttribute('cart_id');
//       const item = cart.find(i => i.id == itemId);
//       RemoveItemFromCart(item);
//     });
//   });
// }

// show_cart_item.addEventListener("click", () => {
//   show_cart_item_fn();
// });



// function getTotal() {
//   let temp = cart.map(item => parseFloat(item.price));
//   let sum = temp.reduce((prev, next) => prev + next, 0);
//   console.log(sum);
// }

