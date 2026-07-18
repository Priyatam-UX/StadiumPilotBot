const url = 'https://stadiumpilot-bot.vercel.app/api/ai/recommendation';

async function test() {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        snapshot: { 
          visitorsCount: 45000, 
          weather: { condition: 'Sunny', temperature: '31°C' },
          zones: [{ name: 'Gate A', load: 85, status: 'red' }],
          volunteers: 132,
          incidents: []
        },
        demoMode: false
      })
    });
    const data = await res.json();
    console.log('Recommendation Status:', res.status);
    console.log('Recommendation Response:', JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Recommendation Fetch error:', e);
  }
}
test();
