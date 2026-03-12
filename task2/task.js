function setupOrderSearchHandler(searchInput, searchClear, filterReady, filterNew, container) {
    function filterOrders() {
        const searchText = searchInput.value.toLowerCase().trim();
        const showReady = filterReady.checked;
        const showNew = filterNew.checked;
        
        const orders = container.querySelectorAll('.order');
        
        orders.forEach(order => {
            let showBySearch = true;
            let showByStatus = true;
            if (searchText !== '') {
                const orderId = order.dataset.id ? order.dataset.id.toLowerCase() : '';
                const orderTitle = order.querySelector('.order-title') ? 
                    order.querySelector('.order-title').textContent.toLowerCase() : '';
                const orderClient = order.querySelector('.order-client') ? 
                    order.querySelector('.order-client').textContent.toLowerCase() : '';
                
                showBySearch = orderId.includes(searchText) || 
                              orderTitle.includes(searchText) || 
                              orderClient.includes(searchText);
            }
            
            const status = order.dataset.status;
            const isReady = status === 'cooking' || status === 'delivery' || status === 'delivered';
            const isNew = status === 'new';
            
            if (showReady && showNew) {
                showByStatus = true;
            } else if (showReady) {
                showByStatus = isReady;
            } else if (showNew) {
                showByStatus = isNew;
            } else {
                showByStatus = true;
            }
            
            if (showBySearch && showByStatus) {
                order.style.display = '';
            } else {
                order.style.display = 'none';
            }
        });
        if (searchInput.value !== '') {
            searchClear.style.display = 'block';
        } else {
            searchClear.style.display = 'none';
        }
    }
    
    searchInput.addEventListener('input', filterOrders);
    
    searchClear.addEventListener('click', function() {
        searchInput.value = '';
        filterOrders();
        searchInput.focus();
    });
    
    filterReady.addEventListener('change', filterOrders);
    filterNew.addEventListener('change', filterOrders);
    
    filterOrders();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { setupOrderSearchHandler };
}