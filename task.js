let isLoading = false;

// Источник 1
function getSource1() {
  return new Promise((resolve, reject) => {
    const delay = 200 + Math.random() * 1800;
    setTimeout(() => {
      if (Math.random() < 0.7) {
        resolve(['Данные из источника 1', 'Еще данные из 1']);
      } else {
        reject('Ошибка в источнике 1');
      }
    }, delay);
  });
}

// Источник 2
function getSource2() {
  return new Promise((resolve, reject) => {
    const delay = 200 + Math.random() * 1800;
    setTimeout(() => {
      if (Math.random() < 0.7) {
        resolve(['Данные из источника 2', 'Еще данные из 2']);
      } else {
        reject('Ошибка в источнике 2');
      }
    }, delay);
  });
}

// Источник 3
function getSource3() {
  return new Promise((resolve, reject) => {
    const delay = 200 + Math.random() * 1800;
    setTimeout(() => {
      if (Math.random() < 0.7) {
        resolve(['Данные из источника 3', 'Еще данные из 3']);
      } else {
        reject('Ошибка в источнике 3');
      }
    }, delay);
  });
}

const btn = document.getElementById('loadBtn');
const container = document.getElementById('container');

btn.addEventListener('click', function() {
  if (isLoading) return;
  
  isLoading = true;
  btn.disabled = true;
  container.innerHTML = '<div class="loader"></div><p>Загрузка...</p>';
  
  Promise.all([getSource1(), getSource2(), getSource3()])
    .then(results => {
      let html = '<h3>Все источники загружены:</h3>';
      results.forEach((data, index) => {
        html += `<div class="source"><b>Источник ${index + 1}:</b> ${data.join(', ')}</div>`;
      });
      container.innerHTML = html;
    })
    .catch(error => {
      container.innerHTML = `<div class="error">❌ Ошибка: ${error}</div>`;
    })
    .finally(() => {
      isLoading = false;
      btn.disabled = false;
    });
});