export default function WeatherNow({ data }) {
    // console.log('current: ', data)
    
    return(
      <>
        <h2 className='weather__current-city'>{data?.name}</h2>
        <p className='weather__current-time'>
          {new Date().toLocaleDateString('ru-RU', 
            {
              weekday: 'long',
              day: 'numeric',
              month: 'long'
          })}
        </p>
        <div className='weather__current-temp'>
          {Math.round(data?.main.temp)} <span>°C</span>
        </div>
        <div className='weather__current-icon'>
          <img 
            src={`https://unpkg.com/@bybas/weather-icons/production/fill/openweathermap/${data?.weather[0].icon}.svg`}
            alt={data?.weather[0].description}
          />
        </div>
        <div className='weather__current-details'>
          <div className='weather__current-detail'>
            <span className='weather__current-detail-label'>Ощущается</span>
            <span className='weather__current-detail-value'>{Math.round(data?.main.feels_like)}°C</span>
          </div>
          <div className='weather__current-detail'>
            <span className='weather__current-detail-label'>Влажность</span>
            <span className='weather__current-detail-value'>{data?.main.humidity}%</span>
          </div>
          <div className='weather__current-detail'>
            <span className='weather__current-detail-label'>Облачность</span>
            <span className='weather__current-detail-value'>{data?.clouds.all}%</span>
          </div>
          <div className='weather__current-detail'>
            <span className='weather__current-detail-label'>Ветер</span>
            <span className='weather__current-detail-value'>{data?.wind.speed} м/с</span>
          </div>
        </div>
      </>
    )
}