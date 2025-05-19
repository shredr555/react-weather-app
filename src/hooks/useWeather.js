import { useState, useCallback } from "react";
import { getCurrentWeather, getForecast } from '../api/weather';

function processForecastData(data) {
    const today = new Date().toISOString().split('T')[0];
    const weatherToday = [];
    const weatherByDays = {};

    data.list.forEach((item, index) => {
        const [date] = item.dt_txt.split(' ');
        if (index <= 7) {
            weatherToday.push(item);
        }
        if (date !== today) {
            if (!weatherByDays[date]) {
                weatherByDays[date] = [];
            }
            weatherByDays[date].push(item);
        }

    });

    const filteredByDays = Object.fromEntries(
        Object.entries(weatherByDays).filter(([_, items]) => items.length === 8)
    );

    return [weatherToday, filteredByDays];
}

export default function useWeather() {
    const [currentData, setCurrentData] = useState(null);
    const [todayData, setTodayData] = useState(null);
    const [weekData, setWeekData] = useState(null);
    const [error, setError] = useState(null);

    const fetchWeather = useCallback(async ({ lat, lon, city }) => {
        try {   
            setError(null);
    
            const [current, forecast] = await Promise.all([
                getCurrentWeather({ lat, lon, city }),
                getForecast({ lat, lon, city })
            ]);
    
            setCurrentData(current);
            const [today, week] = processForecastData(forecast);
            setTodayData(today);
            setWeekData(week);
        } catch(error) {
            setError(error.message);
        }
    }, []);

    return {
        currentData,
        todayData,
        weekData,
        error,
        setError,
        fetchWeather,
    };
}