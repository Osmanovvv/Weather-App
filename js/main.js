import conditions from "./conditions.js";

console.log(conditions);

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

function showCard({city, country, tempC, condition, imgPath}) {
    // Разметка для карточек
        const html = `<div class="card">
        <h2 class="card-city">${city} <span>${country}</span></h2>

        <div class="card-weather">
            <div class="card-value">${tempC}<sup>°c</sup></div>
            <img class="card-img" src="${imgPath}" alt="Weather">
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

// Get conditions


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

        console.log(data.current.condition.code);

        const info = conditions.find(function(obj) {
            if (obj.code === data.current.condition.code) return true;
        })
        console.log(info);
        console.log(info.languages[23]['day_text']); 

        const filePath = '../img/' + (data.current.is_day ? 'day' : 'night') + '/';
		const fileName = (data.current.is_day ? info.day : info.night) + '.png';
        const imgPath = filePath + fileName;
        console.log('filePath', filePath + fileName);

        const weatherData = {
            city: data.location.name,
            country: data.location.country, 
            tempC: data.current.temp_c,
            condition: data.current.is_day 
                ? info.languages[23]['day_text'] 
                : info.languages[23]['night_text'],
            imgPath,
        }

        showCard(weatherData);
    }  
}