const API_KEY = process.env.REACT_APP_API_KEY;
const API_URL = process.env.REACT_APP_API_URL;

export async function getCitySuggestions(query) {
    if (query.length < 2) return [];

    const response = await fetch(
        `${API_URL}/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
    );

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Ошибка при получении погоды: ${errorText}`)
    };
    return await response.json();
}

export async function getCurrentWeather({ lat, lon, city }) {
    let url;
    if (city) {
        url = `${API_URL}/data/2.5/weather?q=${city}&units=metric&lang=ru&appid=${API_KEY}`;
    } else if (lat && lon) {
        url = `${API_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${API_KEY}`;
    } else {
        throw new Error('Не указаны координаты или название города для getCurrentWeather')
    }

    const response = await fetch(url);
    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Ошибка при получении погоды: ${errorText}`)
    };
    return await response.json();
}

export async function getForecast({ lat, lon, city }) {
    let url;
    if (city) {
        url = `${API_URL}/data/2.5/forecast?q=${city}&units=metric&lang=ru&appid=${API_KEY}`;
    } else if (lat && lon) {
        url = `${API_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${API_KEY}`;
    } else {
        throw new Error('Не указаны координаты или название города для getForecast')
    }

    const response = await fetch(url);
    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Ошибка при получении погоды: ${errorText}`)
    };
    return await response.json();
};