document.addEventListener("DOMContentLoaded", function() {
    const addItemButton = document.getElementById("add-item-btn");
    const newItemInput = document.getElementById("new-item-input");
    const newItemPrice = document.getElementById("new-item-price");
    const shoppingList = document.getElementById("shopping-list");
    const totalPriceElement = document.getElementById("total-price");
    const loadingOverlay = document.getElementById("loading-overlay");
    const logo = document.getElementById("logo"); // Adiciona a referência à logomarca

    let totalPrice = 0;

    // Função para adicionar um novo item à lista
    function addItem() {
        const itemText = newItemInput.value.trim();
        const itemPrice = parseFloat(newItemPrice.value.replace(',', '.').trim());

        if (itemText !== "" && !isNaN(itemPrice)) {
            const listItem = document.createElement("li");

            let quantity = 1;

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.addEventListener("change", function() {
                if (this.checked) {
                    listItem.classList.add("purchased");
                } else {
                    listItem.classList.remove("purchased");
                }
            });

            const itemSpan = document.createElement("span");
            itemSpan.textContent = `${itemText} - R$ ${(itemPrice).toFixed(2).replace('.', ',')} (Qtd: ${quantity})`;
            itemSpan.dataset.price = itemPrice;
            itemSpan.dataset.quantity = quantity;
            itemSpan.dataset.initialPrice = itemPrice;
            itemSpan.dataset.itemText = itemText;

            const increaseButton = document.createElement("button");
            increaseButton.textContent = "+";
            increaseButton.className = "adjust-quantity";
            increaseButton.addEventListener("click", function() {
                updateQuantity(listItem, itemPrice, 1);
            });

            const decreaseButton = document.createElement("button");
            decreaseButton.textContent = "-";
            decreaseButton.className = "adjust-quantity";
            decreaseButton.addEventListener("click", function() {
                updateQuantity(listItem, itemPrice, -1);
            });

            const removeButton = document.createElement("button");
            removeButton.textContent = "Remover";
            removeButton.addEventListener("click", function() {
                const quantity = parseInt(itemSpan.dataset.quantity);
                shoppingList.removeChild(listItem);
                updateTotal(-itemPrice * quantity);
            });

            listItem.appendChild(checkbox);
            listItem.appendChild(itemSpan);
            listItem.appendChild(decreaseButton);
            listItem.appendChild(increaseButton);
            listItem.appendChild(removeButton);
            shoppingList.appendChild(listItem);

            updateTotal(itemPrice);

            newItemInput.value = "";
            newItemPrice.value = "";
        }
    }

    function updateQuantity(listItem, itemPrice, change) {
        const itemSpan = listItem.querySelector("span");
        let quantity = parseInt(itemSpan.dataset.quantity);

        quantity += change;

        if (quantity < 1) {
            quantity = 1;
        }

        itemSpan.textContent = `${itemSpan.dataset.itemText} - R$ ${(itemPrice).toFixed(2).replace('.', ',')} (Qtd: ${quantity})`;
        itemSpan.dataset.quantity = quantity;

        const previousQuantity = parseInt(itemSpan.dataset.quantity) - change;
        const totalChange = (quantity - previousQuantity) * itemPrice;

        totalPrice += totalChange;
        if (totalPrice < 0) {
            totalPrice = 0;
        }

        totalPriceElement.textContent = totalPrice.toFixed(2).replace('.', ',');

        const decreaseButton = listItem.querySelector("button.adjust-quantity");
        if (quantity <= 1) {
            decreaseButton.disabled = true;
        } else {
            decreaseButton.disabled = false;
        }
    }

    function updateTotal(priceChange) {
        totalPrice += priceChange;

        if (totalPrice < 0) {
            totalPrice = 0;
        }

        totalPriceElement.textContent = totalPrice.toFixed(2).replace('.', ',');
    }

    addItemButton.addEventListener("click", addItem);

    newItemInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            addItem();
        }
    });

    newItemPrice.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            addItem();
        }
    });

    // Adiciona um evento de animação de conclusão ao loadingOverlay
    loadingOverlay.addEventListener('animationend', function() {
        loadingOverlay.style.display = 'none'; // Oculta a tela de carregamento após a animação
    });

    // Ajusta o tempo total da animação para garantir que ela se repita duas vezes
    loadingOverlay.style.animation = 'fadeInUp 4s ease-in-out';

    // Adiciona evento de clique na logomarca para atualizar a página
    logo.addEventListener("click", function() {
        window.location.reload();
    });
});
