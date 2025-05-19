export default function WeatherWeek({ data }) {
  // console.log('week: ', data)

  const timePeriods = [
    { time: '09:00:00', title: 'Утро' },
    { time: '15:00:00', title: 'День' },
    { time: '21:00:00', title: 'Вечер' },
  ];

  return(
    <>
      {Object.entries(data).map(([date, entries]) => {
        return(
          <div className='weather__weekly-forecast' key={date}>
            <table>
              <thead>
                <tr>
                  <th colSpan='3' className='weather__weekly-forecast__time'>
                    {new Date(date).toLocaleDateString('ru-RU', 
                      { 
                        weekday: 'long',
                        day: 'numeric', 
                        month: 'long' 
                    })}
                  </th>
                  <th>ощущается</th>
                  <th>ветер</th>
                  <th>влажность</th>
                </tr>
              </thead>
              <tbody className='time-periods'>
                {timePeriods.map((period, index) => {
                  const item = entries.find(entry => entry.dt_txt.includes(period.time));
                  if (!item) return null;
                  return(
                    <tr className='time-period' key={index}>
                      <td>{period.title}</td>
                      <td>{Math.round(item.main.temp)} °C</td>
                      <td>
                        <img 
                          src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                          alt={item.weather[0].description}
                        />
                      </td>
                      <td>{Math.round(item.main.feels_like)} °C</td>
                      <td>{item.wind.speed} м/с</td>
                      <td>{item.main.humidity} %</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )
      })}
    </>
  )
}