const apiKey = 'e9a5d3b74bf84418b11193028231901';

// Получаем элементы на странице
const header = document.querySelector('.header');
const form = document.querySelector('.form');
const input = document.querySelector('.input');

function removeCard() {
    const prevCard = document.querySelector('.card');
    if (prevCard) prevCard.remove();
}

function showError(errorMessage) {
    const html = `<div class="card">${errorMessage}</div>`
    header.insertAdjacentHTML('afterend', html)
}

function showCard({city, country, tempC, condition}) {
    // Разметка для карточек
        const html = `<div class="card">
        <h2 class="card-city">${city} <span>${country}</span></h2>

        <div class="card-weather">
            <div class="card-value">${tempC}<sup>°c</sup></div>
            <img class="card-img" src="./img/example.png" alt="Weather">
        </div>

        <div class="card-description">${condition}</div>
    </div>`

// Отображаем карточку на странице
header.insertAdjacentHTML('afterend', html)
}

async function getWeather(city) {
    // Адрес запроса
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
} 

// Слушаем отправку формы
form.onsubmit = async function (e) {
    // Отменяем отправку формы
    e.preventDefault();

    // Берем значение из инпута, образаем пробелы
    let city = input.value.trim();

    // Получаем данные с сервера
    const data = await getWeather(city);

    // Проверка на ошибку
    if (data.error) {
        // Удаляем предыдущую карточку и выводим ошибку
        removeCard()
        showError(data.error.message);
    } else {
        // Удаляем предыдущую карточку и выводим новую
        removeCard()

        const weatherData = {
            city: data.location.name,
            country: data.location.country, 
            tempC: data.current.temp_c,
            condition: data.current.condition
        }

        showCard(weatherData);
    }  
}
