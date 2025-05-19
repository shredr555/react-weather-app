export default function WeatherToday({ data, scroll, containerRef, canScrollLeft, canScrollRight }) {
    // console.log('today: ', data)
  
    return(
      <>
        {canScrollLeft && (
          <button className='weather__hourly__scroll-btn weather__hourly__scroll-btn--left' onClick={() => scroll(-300)} disabled={!canScrollLeft}>
            &lt;
          </button>
        )}
        <div ref={containerRef} className='weather__hourly-container'>
          {data.map((item, index) => {
            const date = new Date(item?.dt_txt)
            const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            return(
                <div className='weather__hourly-element' key={index}>
                  <p>{timeString}</p>
                  <p>
                    <img 
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                      alt={item.weather[0].description}
                    />
                  </p>
                  <p>{item?.weather[0].description}</p>
                  <p>{item?.main.temp}°C</p>
                </div>
            );
          })}
        </div>
        {canScrollRight && (
          <button className='weather__hourly__scroll-btn weather__hourly__scroll-btn--right' onClick={() => scroll(300)} disabled={!canScrollRight}>
            &gt;
          </button>
        )}
      </>
    );
}