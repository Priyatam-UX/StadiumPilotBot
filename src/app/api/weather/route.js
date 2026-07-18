import { NextResponse } from 'next/server';

// Force dynamic rendering — this route reads request.url at runtime
export const dynamic = 'force-dynamic';


const FIFA_CITIES = {
  dallas: { city: 'Dallas', country: 'US' },
  newyork: { city: 'New York', country: 'US' },
  losangeles: { city: 'Los Angeles', country: 'US' },
  toronto: { city: 'Toronto', country: 'CA' },
  miami: { city: 'Miami', country: 'US' },
  houston: { city: 'Houston', country: 'US' },
};

const DEFAULT_CITY = FIFA_CITIES.dallas;

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const cityKey = searchParams.get('city') || 'dallas';
    const cityConfig = FIFA_CITIES[cityKey] || DEFAULT_CITY;

    const apiKey = process.env.OPENWEATHER_API_KEY;

    // --- No API Key: return realistic fallback data ---
    if (!apiKey) {
      return NextResponse.json({
        condition: 'Clear skies',
        temperature: '31°C',
        humidity: '46%',
        wind: '12 km/h NE',
        city: cityConfig.city,
        advisory: 'Heat load is manageable. Keep hydration stations visible on all spectator routes.',
        isLive: false,
      });
    }

    // --- Live OpenWeatherMap API call ---
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityConfig.city)},${cityConfig.country}&appid=${apiKey}&units=metric`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`OpenWeatherMap error: ${res.status}`);
    }

    const data = await res.json();

    const tempC = Math.round(data.main.temp);
    const humidity = data.main.humidity;
    const windSpeedKmh = Math.round(data.wind.speed * 3.6);
    const windDeg = data.wind.deg;
    const condition = data.weather[0].description;
    const conditionId = data.weather[0].id;

    // Convert wind degree to compass direction
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const windDir = directions[Math.round(windDeg / 45) % 8];

    // Generate smart advisory based on conditions
    let advisory = '';
    if (tempC >= 35) {
      advisory = `Extreme heat at ${tempC}°C. Mandatory hydration stations and shade structures required on all spectator routes. Medical teams on standby.`;
    } else if (tempC >= 30) {
      advisory = `High heat load at ${tempC}°C with ${humidity}% humidity. Keep hydration support visible. Monitor crowd dwell times.`;
    } else if (conditionId >= 200 && conditionId < 600) {
      advisory = `Adverse weather conditions detected (${condition}). Review shelter plans and ensure emergency exits are accessible.`;
    } else if (conditionId >= 600 && conditionId < 700) {
      advisory = `Cold or snowy conditions at ${tempC}°C. Monitor crowd comfort and ensure adequate warming zones.`;
    } else {
      advisory = `Conditions are favorable at ${tempC}°C with ${humidity}% humidity. Maintain standard operational posture.`;
    }

    return NextResponse.json({
      condition: condition.charAt(0).toUpperCase() + condition.slice(1),
      temperature: `${tempC}°C`,
      humidity: `${humidity}%`,
      wind: `${windSpeedKmh} km/h ${windDir}`,
      city: cityConfig.city,
      advisory,
      isLive: true,
    });

  } catch (e) {
    console.error('Weather API error:', e);
    // Graceful fallback on any error
    return NextResponse.json({
      condition: 'Clear skies',
      temperature: '31°C',
      humidity: '46%',
      wind: '12 km/h NE',
      city: 'Dallas',
      advisory: 'Weather feed temporarily unavailable. Maintain standard operations.',
      isLive: false,
    });
  }
}
