import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import WeatherNow from './components/WeatherNow';
import WeatherToday from './components/WeatherToday';
import WeatherWeek from './components/WeatherWeek';
import { getCitySuggestions } from './api/weather';
import useDebouncedValue from './hooks/useDebouncedValue';
import useWeather from './hooks/useWeather';


function App() {
  const {
    currentData,
    todayData,
    weekData,
    error,
    setError,
    fetchWeather,
  } = useWeather();

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebouncedValue(searchQuery, 300);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const searchInputRef = useRef(null);

  const fetchCitySuggestions = async (query) => {
    try {
      const suggestions = await getCitySuggestions(query);
      setCitySuggestions(suggestions);
    } catch (error) {
      console.error('Error fatching city suggestion: ', error);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (city) => {
    setSearchQuery(`${city.name}, ${city.country}`);
    setShowSuggestions(false);
    fetchWeather({ lat: city.lat, long: city.lon });
  };

  const getWeatherByGeolocation = useCallback(() => {

    if (!navigator.geolocation) {
      setError('Геолокация не поддерживается вашим браузером')
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        
        const { latitude, longitude } = position.coords;
        fetchWeather({ lat: latitude, lon: longitude });
      },
      (error) => {
        setError('Не удалось получить геолокацию: ' + error.message);
      }
    );
  }, [fetchWeather]);

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      fetchWeather({ city: searchQuery });
      setShowSuggestions(false);
    }
  };

  const checkScroll = () => {
    if (!containerRef.current) return;
    const {scrollLeft, scrollWidth, clientWidth} = containerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
  };

  const scroll = (offset) => {
    containerRef.current?.scrollBy({ left: offset, behavior: 'smooth'});
  };

  useEffect(() => {
    if (debouncedQuery) fetchCitySuggestions(debouncedQuery);
  }, [debouncedQuery, fetchCitySuggestions]);

  useEffect(() => {
    getWeatherByGeolocation();
  }, [getWeatherByGeolocation]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchInputRef.current && !searchInputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    checkScroll();
    const container = containerRef.current;
    container?.addEventListener('scroll', checkScroll);
    return () => container?.removeEventListener('scroll', checkScroll)
  }, [todayData]);

  return (
    <div className='weather-app'>
      <div className='search-form' ref={searchInputRef}>
        <div className='search-form__container'>
          <input 
            className='search-form__input' 
            value={searchQuery} 
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
          />
          {showSuggestions && citySuggestions.length > 0 && (
            <ul className='suggestions-list'>
              {citySuggestions.map((city) => (
                <li
                  key={`${city.lat}-${city.lon}`}
                  onClick={() => handleSuggestionClick(city)}
                >
                  {city.name}, {city.country}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button className='search-form__btn search-form__btn--search' onClick={handleSearch}>
          найти
        </button>
        <button className='search-form__btn search-form__btn--geo' onClick={getWeatherByGeolocation}>
          <i className="fa-solid fa-location-dot"></i>
        </button>
      </div>
      {error && <div className='weather__error'>{error}</div>}
      <div className='weather'>
        <div className='weather__current'>
          {currentData && <WeatherNow data={currentData} />}
        </div>
        <div className='weather__hourly'>
          {todayData && 
            <WeatherToday 
              data={todayData} 
              scroll={scroll} 
              containerRef={containerRef}
              canScrollLeft={canScrollLeft}
              canScrollRight={canScrollRight}
            />
          }
        </div>
        <div className='weather__weekly'>
          {weekData && <WeatherWeek data={weekData} />}
        </div>
      </div>
    </div>
  );
}

export default App;
