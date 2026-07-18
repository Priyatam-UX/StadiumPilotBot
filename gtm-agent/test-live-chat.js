const url = 'https://stadiumpilot-bot.vercel.app/api/ai/chat';

async function test() {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Hi, list the status of Gates',
        history: [],
        snapshot: { 
          visitorsCount: 45000, 
          weather: { condition: 'Sunny' },
          zones: [{ name: 'Gate A', crowdPercent: 45, status: 'green' }]
        },
        demoMode: false
      })
    });
    const data = await res.json();
    console.log('Chat Status:', res.status);
    console.log('Chat Response:', JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Chat Fetch error:', e);
  }
}
test();
