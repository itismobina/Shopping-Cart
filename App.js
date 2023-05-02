import { productsData } from "./products.js";
const cartIcon = document.querySelector(".cartIcon");
const cartDiv = document.querySelector(".cart");
const backdrop = document.querySelector(".backdrop");
const productsDom = document.querySelector(".main");
const confrim = document.querySelector(".confrimCart");
const cartTotal = document.querySelector(".total-price");
const cartItems = document.querySelector(".content-number");
const CartContent = document.querySelector(".cartItems");
const clearItem = document.querySelector(".clearCart");

let cart = [];

class Products {
    // get from API and porint !
    getProducts() {
        return productsData;
    }
}

let btnsDom = [];
class UI {
    displayProducts(product) {
        let result = '';
        product.forEach(item => {
            result += 
            `<li class="item">
                    <img class="productImg" src="${item.imgUrl}"/>
                    <p class="title">${item.title}</p>
                    <p class="price">${item.price}$</p>
                    <button class="btn" data-id=${item.id}>
                        <i class="fa fa-plus" aria-hidden="true"></i>
                        Add to Cart
                    </button>                
                </li>`
            productsDom.innerHTML = result;
        });
    }
    getBtn () {
        const addToCartBtn = [...document.querySelectorAll(".btn")];
        btnsDom = addToCartBtn;
        addToCartBtn.forEach(btn => {
            const id = btn.dataset.id;
            // check if this product id is in cart or not !!!
            btn.addEventListener("click", (event) => {
                event.target.disabled = true;
                 const addProdcut = {...Storage.getProduct(id), quantity : 1 };
                cart = [...cart,{...addProdcut,quantity : 1}]
                Storage.saveCart(cart);
                this.setCartValue(cart);
                this.addCartItem(addProdcut); 
            })
        });
    }
    setCartValue (cart) {
        let temp = 0;
        const totalPrice = cart.reduce((acc,curr) => {
            temp += curr.quantity;
            return acc + curr.quantity * curr.price; 
            
        },0)
        cartTotal.innerText = `Total Price : ${totalPrice.toFixed(2)}$`;
        cartItems.innerText = temp;
    }

    addCartItem(cartItems) {
        const ul = document.createElement("li");
        ul.classList.add("cartItem");
        ul.innerHTML = 
        `
        <div class="cartImg">
            <img src="${cartItems.imgUrl}" />
        </div>
        <div class="title-price">
            <p class="cartName">${cartItems.title}</p>
            <p class="price">${cartItems.price}$</p>
        </div>
        <div class="counter">
            <i class="fa fa-chevron-up up" aria-hidden="true" data-id="${cartItems.id}"></i>
            <span class="count">${cartItems.quantity}</span>
            <i class="fa fa-chevron-down down" aria-hidden="true" data-id="${cartItems.id}"></i>
        </div>
        <i class="fa fa-trash" aria-hidden="true" data-id="${cartItems.id}"></i>`
    CartContent.appendChild(ul);
    }

    setUpApp () {
        cart = Storage.getCart() || [];
        cart.forEach(cartItems => {
            this.addCartItem(cartItems);
        });
        this.setCartValue(cart); 
    }

    cartLogic() {
        clearItem.addEventListener("click", () => {
            cart.forEach((cItem) => this.removeItem(cItem.id));
            while(CartContent.children.length) {
                CartContent.removeChild(CartContent.children[0])
            }
            closeModal()
        });

        CartContent.addEventListener("click", (event) => {
            if(event.target.classList.contains('fa-chevron-up')) {
                const addQuantity = event.target;
                const addedItem = cart.find(cItem => cItem.id == addQuantity.dataset.id);
                addedItem.quantity++;
                this.setCartValue(cart);
                Storage.saveCart(cart);
                addQuantity.nextElementSibling.innerText = addedItem.quantity;
            } 
            else if(event.target.classList.contains('fa-chevron-down')) {
                const subQuantity = event.target;
                const substractedItem = cart.find(cItem => cItem.id == subQuantity.dataset.id);
                if( substractedItem.quantity === 1 ) {
                    this.removeItem(substractedItem.id);
                    Storage.saveCart(cart)
                    CartContent.removeChild(subQuantity.parentElement.parentElement);
                    return;
                }
                substractedItem.quantity--;
                this.setCartValue(cart);
                Storage.saveCart(cart);
                subQuantity.previousElementSibling.innerText = substractedItem.quantity;
            } 
            else if (event.target.classList.contains("fa-trash")) {
                const removeItem = event.target;
                const _removedItem = cart.find(c => c.id == removeItem.dataset.id);
                this.removeItem(_removedItem.id);
                Storage.saveCart(cart);
                CartContent.removeChild(removeItem.parentElement);
            }

        })
    }

    removeItem(id) {
        cart = cart.filter((cItem) => cItem.id !== id);
        this.setCartValue(cart);
        Storage.saveCart(cart);

        // const finallBtn = btnsDom.find(btn => parseInt(btn.dataset.id) === parseInt(id));
        // finallBtn.innerHTML = "Add to Cart";
        // btnsDom.disabled = flase;
    }
}

class Storage {
    saveProducts(){
        localStorage.setItem('products',JSON.stringify(productsData))
    }

    static getProduct(id) {
        const _products = JSON.parse(localStorage.getItem("products"));
        return _products.find((p) => p.id === parseInt(id));
    }

    static saveCart (cart) {
        localStorage.setItem('cart',JSON.stringify(cart));
    }

     static getCart(id) {
        return JSON.parse(localStorage.getItem("cart"))
        ? JSON.parse(localStorage.getItem("cart"))
        : [];
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const products = new Products();
    const productData = products.getProducts();
    const ui = new UI();
    ui.setUpApp();
    ui.displayProducts(productData);
    ui.removeItem()
    ui.cartLogic()
    const storage = new Storage();
    storage.saveProducts(productData);
    ui.getBtn();
});

function closeModal () {
    cartDiv.style.display = "none";
    backdrop.style.display = "none";
}

cartIcon.addEventListener("click", () => {
    cartDiv.style.display = "block";
    backdrop.style.display = "block";
})

backdrop.addEventListener("click", closeModal);
confrim.addEventListener("click",closeModal);