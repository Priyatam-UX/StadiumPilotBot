const url = 'https://stadiumpilot-bot.vercel.app/api/ai/chat';

async function test() {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Hiii',
        history: [],
        snapshot: { visitorsCount: 45000, weather: { condition: 'Sunny' } },
        demoMode: false
      })
    });
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Fetch error:', e);
  }
}
test();
