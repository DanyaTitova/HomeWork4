function setupFavoriteHandler() {
  const states = new Map();
  const animations = new Map();
  
  function searchOrdersOnServer(searchText) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const allOrders = [
          { id: 1, title: 'Заказ #A-101', comment: 'Оставить у двери', status: 'new', client: 'Иван Иванов', items: 'Бургер, Картошка фри', total: '420 ₽', address: 'ул. Пушкина, д. 10' },
          { id: 2, title: 'Заказ #A-100', comment: 'Быстрее', status: 'delivery', client: 'Мария Смирнова', items: 'Салат Цезарь, Суп', total: '380 ₽', address: 'ул. Ленина, д. 5' },
          { id: 3, title: 'Заказ #A-099', comment: 'Я доплачу', status: 'cooking', client: 'Петр Петров', items: 'Пицца, Кола', total: '560 ₽', address: 'ул. Гагарина, д. 15' },
          { id: 4, title: 'Заказ #A-098', comment: 'Оставьте себе', status: 'delivered', client: 'Анна Сидорова', items: 'Роллы, Соевый соус', total: '720 ₽', address: 'ул. Мира, д. 7' },
        ];
        
        const filteredOrders = searchText && searchText.trim() !== ''
          ? allOrders.filter(order => 
              order.title.toLowerCase().includes(searchText.toLowerCase()) ||
              order.client.toLowerCase().includes(searchText.toLowerCase()) ||
              order.id.toString().includes(searchText))
          : allOrders;

        if (Math.random() > 0.2) {
          resolve(filteredOrders);
        } else {
          reject('Ошибка поиска заказов');
        }
      }, 300);
    });
  }
  function renderOrders(orders) {
    const container = document.getElementById('orders');
    
    if (orders.length === 0) {
      container.innerHTML = '<div class="no-results">Ничего не найдено</div>';
      return;
    }
    
    container.innerHTML = '';
    
    orders.forEach(order => {
      const orderDiv = document.createElement('div');
      orderDiv.className = `order ${order.status}`;
      orderDiv.dataset.id = order.id;
      orderDiv.dataset.client = order.client;
      orderDiv.dataset.items = order.items;
      orderDiv.dataset.total = order.total;
      orderDiv.dataset.address = order.address;
      orderDiv.dataset.status = order.status;
      
      orderDiv.innerHTML = `
        <div class="order-title">${order.title}</div>
        <div class="order-client">${order.client}</div>
        <button class="favorite-button" title="Добавить в избранное">❤</button>
      `;
      
      container.appendChild(orderDiv);
    });
  }

  function setupDetailsOnHover() {
    const container = document.getElementById('orders');
    
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

  function setupSearch() {
    const searchInput = document.getElementById('order-search');
    const searchClear = document.querySelector('.search-clear');
    let timeoutId;
    
    async function handleSearch(searchText) {
      const orders = await searchOrdersOnServer(searchText);
      renderOrders(orders);
      setupFavoriteHandler(); 
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
        handleSearch(searchText);
      }, 300);
    });
    
    searchClear.addEventListener('click', function() {
      searchInput.value = '';
      searchClear.style.display = 'none';
      clearTimeout(timeoutId);
      handleSearch('');
      searchInput.focus();
    });
  }
  function setupFilters() {
    const filterReady = document.querySelector('.filter-ready');
    const filterNew = document.querySelector('.filter-new');
    const container = document.getElementById('orders');
    
    function filterOrders() {
      const showReady = filterReady.checked;
      const showNew = filterNew.checked;
      
      const orders = container.querySelectorAll('.order');
      
      orders.forEach(order => {
        const status = order.dataset.status;
        const isReady = status === 'cooking' || status === 'delivery' || status === 'delivered';
        const isNew = status === 'new';
        
        let showByStatus = true;
        
        if (showReady && showNew) {
          showByStatus = true;
        } else if (showReady) {
          showByStatus = isReady;
        } else if (showNew) {
          showByStatus = isNew;
        }
        
        if (showByStatus) {
          order.style.display = '';
        } else {
          order.style.display = 'none';
        }
      });
    }
    
    filterReady.addEventListener('change', filterOrders);
    filterNew.addEventListener('change', filterOrders);
  }
  function setupFavoriteButton() {
    const container = document.getElementById('orders');
    
    function startRotation(button) {
      let start = null;
      
      function rotate(timestamp) {
        if (!start) start = timestamp;
        const progress = (timestamp - start) / 1000;
        const rotation = (progress * 360) % 360;
        
        button.style.transform = `rotate(${rotation}deg)`;
        
        const frameId = requestAnimationFrame(rotate);
        animations.set(button, frameId);
      }
      
      const frameId = requestAnimationFrame(rotate);
      animations.set(button, frameId);
    }
    
    function stopRotation(button) {
      if (animations.has(button)) {
        cancelAnimationFrame(animations.get(button));
        animations.delete(button);
        button.style.transform = '';
      }
    }
    
    container.addEventListener('click', function(event) {
      const button = event.target.closest('.favorite-button');
      if (!button) return;
      
      const order = button.closest('.order');
      if (!order) return;
      
      let state = states.get(order) || 0;
      state = (state + 1) % 3;
      
      if (state === 0) {
        button.classList.remove('favorite', 'rotating');
        order.classList.remove('favorite');
        stopRotation(button);
      } else if (state === 1) {
        button.classList.add('favorite');
        button.classList.remove('rotating');
        order.classList.add('favorite');
        stopRotation(button);
      } else if (state === 2) {
        button.classList.add('favorite', 'rotating');
        order.classList.add('favorite');
        startRotation(button);
      }
      
      states.set(order, state);
    });
  }
  async function init() {
    const orders = await searchOrdersOnServer('');
    renderOrders(orders);
    
    setupDetailsOnHover();
    setupSearch();
    setupFilters();
    setupFavoriteButton();
  }
  init();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { setupFavoriteHandler };
}