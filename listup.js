window.addEventListener("load", function() {
    const loadingOverlay = document.getElementById("loading-overlay");

    setTimeout(function() {
        loadingOverlay.style.display = "none";
    }, 2500); // Tempo suficiente para a animação de carregamento
});

document.addEventListener("DOMContentLoaded", function() {
    const addItemButton = document.getElementById("add-item-btn");
    const newItemInput = document.getElementById("new-item-input");
    const newItemPriceInput = document.getElementById("new-item-price");
    const shoppingList = document.getElementById("shopping-list");
    const totalPriceElement = document.getElementById("total-price");
    const logo = document.getElementById("logo");
    let totalPrice = 0;

    // Adiciona o evento de clique na logo para recarregar a página
    logo.addEventListener("click", function() {
        location.reload();
    });

    addItemButton.addEventListener("click", function() {
        const itemName = newItemInput.value.trim();
        const itemPrice = parseFloat(newItemPriceInput.value);

        if (itemName !== "" && !isNaN(itemPrice) && itemPrice > 0) {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <input type="checkbox" class="item-checkbox">
                <span>${itemName}</span>
                <span>R$ ${itemPrice.toFixed(2)}</span>
                <div>
                    <button class="adjust-quantity decrease">-</button>
                    <span class="quantity">1</span>
                    <button class="adjust-quantity increase">+</button>
                    <button class="delete-item">X</button>
                </div>
            `;

            shoppingList.appendChild(listItem);

            updateTotal(itemPrice);
            addQuantityEventListeners(listItem, itemPrice);
            addDeleteEventListener(listItem, itemPrice);
        }
    });

    function updateTotal(priceChange) {
        totalPrice += priceChange;
        totalPriceElement.textContent = totalPrice.toFixed(2);
    }

    function addQuantityEventListeners(listItem, itemPrice) {
        const decreaseButton = listItem.querySelector(".decrease");
        const increaseButton = listItem.querySelector(".increase");
        const quantityElement = listItem.querySelector(".quantity");

        decreaseButton.addEventListener("click", function() {
            let quantity = parseInt(quantityElement.textContent);

            if (quantity > 1) {
                quantity--;
                quantityElement.textContent = quantity;
                updateTotal(-itemPrice);
            }
        });

        increaseButton.addEventListener("click", function() {
            let quantity = parseInt(quantityElement.textContent);
            quantity++;
            quantityElement.textContent = quantity;
            updateTotal(itemPrice);
        });
    }

    function addDeleteEventListener(listItem, itemPrice) {
        const deleteButton = listItem.querySelector(".delete-item");

        deleteButton.addEventListener("click", function() {
            const selectedItems = document.querySelectorAll(".item-checkbox:checked");

            if (selectedItems.length > 0) {
                // Se houver itens selecionados, remova todos eles
                selectedItems.forEach(checkbox => {
                    const selectedItem = checkbox.parentElement;
                    const quantity = parseInt(selectedItem.querySelector(".quantity").textContent);
                    const price = parseFloat(selectedItem.querySelector("span:nth-child(3)").textContent.replace("R$ ", ""));
                    const totalItemPrice = price * quantity;
                    updateTotal(-totalItemPrice);
                    shoppingList.removeChild(selectedItem);
                });
            } else {
                // Se nenhum item estiver selecionado, remova apenas o item atual
                const quantity = parseInt(listItem.querySelector(".quantity").textContent);
                const totalItemPrice = itemPrice * quantity;
                updateTotal(-totalItemPrice);
                shoppingList.removeChild(listItem);
            }
        });
    }
});
