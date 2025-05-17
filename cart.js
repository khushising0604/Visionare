// Cart functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage if available
    let cart = JSON.parse(localStorage.getItem('visionCraftCart')) || [];
    updateCartCount();

    // Add to cart button event listeners
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard.dataset.productId;
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent.replace('₹', '');
            const productImage = productCard.querySelector('img').src;

            // Check if product is already in cart
            const existingItemIndex = cart.findIndex(item => item.id === productId);

            if (existingItemIndex > -1) {
                cart[existingItemIndex].quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: parseFloat(productPrice),
                    image: productImage,
                    quantity: 1
                });
            }

            // Save cart to localStorage
            localStorage.setItem('visionCraftCart', JSON.stringify(cart));

            // Update cart count
            updateCartCount();

            // Notification
            showNotification(`${productName} added to cart!`);
        });
    });

    // Function to update cart count in header
    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;

            // Add animation
            cartCount.classList.add('bounce');
            setTimeout(() => cartCount.classList.remove('bounce'), 400);
        }
    }

    // Notification function
    function showNotification(message) {
        // Check if notification container exists, if not create it
        let notification = document.querySelector('.notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.classList.add('notification');
            document.body.appendChild(notification);

            // Style the notification
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.right = '20px';
            notification.style.backgroundColor = '#8b7355';
            notification.style.color = 'white';
            notification.style.padding = '12px 20px';
            notification.style.borderRadius = '4px';
            notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
            notification.style.zIndex = '1000';
            notification.style.transform = 'translateY(100px)';
            notification.style.opacity = '0';
            notification.style.transition = 'transform 0.2s, opacity 0.2s';
        }

        // Set message and show notification
        notification.textContent = message;

        // Show the notification
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 10);

        // Hide after 2 seconds
        setTimeout(() => {
            notification.style.transform = 'translateY(100px)';
            notification.style.opacity = '0';
        }, 2000);
    }
});
