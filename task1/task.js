async function setupOrderHandlers(container) {
    container.addEventListener('mouseover', function(event) {
        const order = event.target.closest('.order');
        if (!order) return;
        
        let details = order.querySelector('.order-details');
        
        if (!details) {
            details = document.createElement('div');
            details.className = 'order-details';
            
            const client = order.dataset.client;
            const items = order.dataset.items;
            const total = order.dataset.total;
            const address = order.dataset.address;
            
            details.innerHTML = `
                <strong>Клиент:</strong> ${client}<br>
                <strong>Товары:</strong> ${items}<br>
                <strong>Сумма:</strong> ${total}<br>
                <strong>Адрес:</strong> ${address}
            `;
            
            order.appendChild(details);
        }
    });
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { setupOrderHandlers };
}