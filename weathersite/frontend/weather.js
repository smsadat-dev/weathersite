const dateElement = document.getElementById('id_current-date');

const locationElement  = document.getElementById('id_location');
const temparatureElement = document.getElementById('id_temparature');
const description = document.getElementById('id_description');
const humidityElement = document.getElementById('id_humidity_value');
const windspeedElement = document.getElementById('id_wind_speed_value');
const uvamountElement = document.getElementById('id_uv_value');

const weatherImgElement = document.getElementById('weather-image');

const searchInput = document.getElementById('id_locationInput');
const searchBtn = document.getElementById('id_searchBtn');

const forecastD1 = document.getElementById('forecast-day-1');
const forecastD2 = document.getElementById('forecast-day-2');
const forecastD3 = document.getElementById('forecast-day-3');
const forecastD4 = document.getElementById('forecast-day-4');
const forecastD5 = document.getElementById('forecast-day-5');
const forecastD6 = document.getElementById('forecast-day-6');
const forecastD7 = document.getElementById('forecast-day-7');


const backend_api = 'http://127.0.0.1:8000/weather/api/';


function getOrdinalSuffix(day)
{
    if(day > 3 && day < 21) return 'th';
    switch(day % 10)
    {
        case 1 : return 'st';
        case 2 : return 'nd';
        case 3 : return 'rd';
        default : return 'th';
    }
}

function fmtForecastDate(datestr)
{
    const date = new Date(datestr);
    if(isNaN(date))
    {
        return 'Invalid date';
    }

    const dayofWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const daynum = date.getDate();
    const monthname = date.toLocaleDateString('en-US', { month: 'long' });

    return `${dayofWeek}, ${daynum}${getOrdinalSuffix(daynum)} ${monthname}`;
}

function clearForecastItem(forecastItemElement) {
    if (!forecastItemElement) return; // Guard clause if element doesn't exist

    forecastItemElement.querySelector('.forecast-date').textContent = '--';
    const imgEl = forecastItemElement.querySelector('.forecast-img');
    if (imgEl) {
        imgEl.src = '';
        imgEl.alt = 'No weather data';
    }
    forecastItemElement.querySelector('.max-temp').textContent = 'Max: --';
    forecastItemElement.querySelector('.min-temp').textContent = 'Min: --';
}


function fetchWeatherFromBackend(location)
{
    if(!location)
    {
        description.innerText = `Location can't be empty`;
        locationElement.textContent = '--'; 
        temparatureElement.textContent = '--'; 
        return;   
    }

    const url = `${backend_api}?location=${encodeURIComponent(location)}`;
    fetch(url)
    .then(response =>
        {
            //  return response.json().then(errorData => {
            //         const serverMessage = errorData.error ? (errorData.error.message || JSON.stringify(errorData.error)) : 'Unknown server error';
            //         throw new Error(`HTTP error: ${response.status}. Message: ${serverMessage}`);
            //     }).catch(() => {
            //         // Fallback if response is not JSON or parsing fails
            //         throw new Error(`HTTP error: ${response.status}`);
            //     });

            console.log("DEBUG: Attempting to return response.json()...");
            return response.json(); 
        }
    )
    .then( data =>
        {
            console.log("Full data received from backend:", data);
            
            const currentData = data.current;
            const forecastData = data.forecast;

            // CURRENT WEATHER DATA

            const date = currentData.location?.localtime;
            const cityName = currentData.location?.name;
            const temparature = currentData.current?.temp_c;
            const humidity = currentData.current?.humidity;
            const windspeed = currentData.current?.wind_kph + 'kph';
            const uvamount = currentData.current?.uv;
            const conditionDetail = currentData.current?.condition?.text || 'No description available';
            
            dateElement.textContent = date;
            locationElement.textContent = cityName;
            humidityElement.textContent = humidity;
            windspeedElement.textContent = windspeed;
            uvamountElement.textContent = uvamount;
        
            const weatherImg = currentData.current?.condition?.icon;

            if(weatherImg) // Check if weatherImg actually has a value
            {
                weatherImgElement.src = `https:${weatherImg}`;
                weatherImgElement.alt = `${data.current?.condition?.code}`;
            }
            else 
            {
                weatherImgElement.src = ''; // Clear the src
                weatherImgElement.alt = 'No weather icon available';
            }

            if (typeof temparature === 'number') {
                temparatureElement.textContent = `${Math.round(temparature)}°C`;
            } else {
                temparatureElement.textContent = '--'; // Display if temperature is missing or NaN
            }
            
            description.textContent = conditionDetail;

            // FORECAST WEATHER DATA

            const forecastDayElements = [
                document.getElementById('forecast-day-1'),
                document.getElementById('forecast-day-2'),
                document.getElementById('forecast-day-3'),
                document.getElementById('forecast-day-4'),
                document.getElementById('forecast-day-5'),
                document.getElementById('forecast-day-6'),
                document.getElementById('forecast-day-7')
            ];

            // Get the forecastday array from the API response
            const forecastDaysData = forecastData.forecast?.forecastday;

            forecastDayElements.forEach((forecastItemEl, index) =>
                {
                    const dayData = forecastDaysData?.[index];
                    console.log('Heres forecast daysdata:\n' + dayData);

                    if(forecastItemEl && dayData)
                    {
                        // selecting respective html elements to push data
                        const dateElement = forecastItemEl.querySelector('.forecast-date');
                        const imgElement = forecastItemEl.querySelector('.forecast-img');
                        const maxTempElement = forecastItemEl.querySelector('.max-temp'); 
                        const minTempElement = forecastItemEl.querySelector('.min-temp'); 

                        // Extract data from the day's forecast object
                        const dateString = dayData.date;                // e.g., "2025-07-03"
                        const iconUrl = dayData.day?.condition?.icon;   // Icon URL (e.g., "//cdn.weatherapi.com/...")
                        const maxTempC = dayData.day?.maxtemp_c;
                        const minTempC = dayData.day?.mintemp_c;
                        const conditionText = dayData.day?.condition?.text;

                        if(dateElement)
                        {
                            dateElement.textContent = fmtForecastDate(dateString);
                        }

                        if(imgElement && iconUrl)
                        {
                            imgElement.src = `https:${iconUrl}`;
                            imgElement.alt = conditionText || 'Weather Icon';
                        }
                        else if(imgElement)
                        {
                            imgElement.src = `null`;
                            imgElement.alt = 'No icon found';
                        }

                        if (maxTempElement) {
                            if (typeof maxTempC === 'number') {
                                maxTempElement.textContent = `Max: ${Math.round(maxTempC)}°C`;
                            } else {
                                maxTempElement.textContent = `Max: --`;
                            }
                        }

                        if (minTempElement) {
                            if (typeof minTempC === 'number') {
                                minTempElement.textContent = `Min: ${Math.round(minTempC)}°C`;
                            } else {
                                minTempElement.textContent = `Min: --`;
                            }
                        }

                    }
                    else if(forecastItemEl)
                    {
                        // If the API did not provide data for this specific day (e.g., it only gives 3 days, but have 7 divs)
                        // Clear the content of those forecast items
                        clearForecastItem(forecastItemEl);
                    }
                }
            );
        }
    )
    .catch(error => 
    {
        console.error('Error fetching weather data from backend', error);
        locationElement.textContent = 'Error';
        temparatureElement.textContent = '--';
        description.textContent = 'Error fetching weather data';
    });
}


if(searchBtn)
{
    searchBtn.addEventListener('click',
        function()
        {
            const location = searchInput.value.trim();
            fetchWeatherFromBackend(location); 
        }
    );
}


// todo: add a way to collect user IP and make that the default location input
// document.addEventListener('DOMContentLoaded', 
//     function()
//     {
//         fetchWeatherFromBackend();
//     }
// )