let loading = false;

function simulateRequest() {
  return new Promise((resolve, reject) => {
    const time = 300 + Math.random() * 1200;
    
    setTimeout(() => {
      if (Math.random() < 0.7) {
        const orders = [
          { id: 1, title: 'Заказ №1', price: '420 ₽' },
          { id: 2, title: 'Заказ №2', price: '380 ₽' },
          { id: 3, title: 'Заказ №3', price: '560 ₽' },
          { id: 4, title: 'Заказ №4', price: '720 ₽' }
        ];
        resolve(orders);
      } else {
        reject('Ошибка сервера');
      }
    }, time);
  });
}

const btn = document.getElementById('loadBtn');
const content = document.getElementById('container');

btn.addEventListener('click', async function() {
  if (loading) {
    console.log('Уже грузится');
    return;
  }
  
  loading = true;
  content.innerHTML = '<div class="loader"></div><p>Загрузка...</p>';
  
  try {
    const result = await simulateRequest();
    
    content.innerHTML = '';
    result.forEach(item => {
      const block = document.createElement('div');
      block.className = 'card';
      block.innerHTML = `<strong>${item.title}</strong><br>Сумма: ${item.price}`;
      content.appendChild(block);
    });
    
  } catch (error) {
    content.innerHTML = `<div class="error">❌ ${error}</div>`;
  } finally {
    loading = false;
  }
});