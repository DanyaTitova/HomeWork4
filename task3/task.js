function searchOrdersOnServer(searchText) {
   return new Promise((resolve, reject) => {
      setTimeout(() => {
         const allOrders = [
            { id: 1, title: 'Заказ #A-101', comment: 'Оставить у двери', status: 'new' },
            { id: 2, title: 'Заказ #A-100', comment: 'Быстрее',  status: 'delivery' },
            { id: 3, title: 'Заказ #A-099', comment: 'Я доплачу', status: 'cooking' },
            { id: 4, title: 'Заказ #A-098', comment: 'Оставьте себе', status: 'delivered' },
         ];
         const filteredOrders = searchText
                 ? allOrders.filter(order => order.title.includes(searchText))
                 : allOrders;

         if (Math.random() > 0.2) {
            resolve(filteredOrders);
         } else {
            reject('Ошибка поиска заказов');
         }
      }, 300);
   });
}
function setupOrderSearchServerHandler(searchInput, searchClear, container) {
  let timeoutId;
  const errorDiv = document.getElementById('search-error');
  
  function renderOrders(orders) {
    if (orders.length === 0) {
      container.innerHTML = '<div class="no-results">Ничего не найдено</div>';
      return;
    }
    
    let html = '';
    orders.forEach(order => {
      html += `
        <div class="order ${order.status}" data-id="${order.id}">
          <div class="order-title">${order.title}</div>
          <div class="order-comment">${order.comment}</div>
        </div>
      `;
    });
    container.innerHTML = html;
  }
  async function loadOrders(searchText) {
    try {
      container.innerHTML = '<div class="loading">Загрузка...</div>';
      if (errorDiv) errorDiv.style.display = 'none';
      
      const orders = await searchOrdersOnServer(searchText);
      renderOrders(orders);
      
    } catch (error) {
      if (errorDiv) {
        errorDiv.textContent = error;
        errorDiv.style.display = 'block';
      }
      container.innerHTML = '<div class="error">Ошибка при загрузке заказов</div>';
    }
  }
  
  searchInput.addEventListener('input', function() {
    const searchText = this.value;
    
    if (searchText) {
      searchClear.style.display = 'block';
    } else {
      searchClear.style.display = 'none';
    }
    
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      loadOrders(searchText);
    }, 300);
  });
  
  searchClear.addEventListener('click', function() {
    searchInput.value = '';
    searchClear.style.display = 'none';
    clearTimeout(timeoutId);
    loadOrders('');
    searchInput.focus();
  });  
  loadOrders('');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { setupOrderSearchHandler, searchOrdersOnServer };
}