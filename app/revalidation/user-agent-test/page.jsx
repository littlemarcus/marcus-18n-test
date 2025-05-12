import { revalidateTag } from 'next/cache';

// Function to get data with cache tag - using external API
async function getData() {
  const res = await fetch('https://httpbin.org/headers', {
    next: { tags: ['collection'] },
    cache: 'force-cache'
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  
  const data = await res.json();
  
  return {
    timestamp: new Date().toISOString(),
    userAgent: data.headers['User-Agent'] || 'No user-agent provided',
    headers: data.headers,
    random: Math.random()
  };
}

export default async function Page() {
  async function revalidate() {
    'use server';
    console.log('Revalidating with ISR...');
    revalidateTag('collection');
  }

  const data = await getData();

  return (
    <section>
      <h1>User-Agent in Next.js ISR (External API)</h1>
      
      <div style={{ margin: '20px 0', padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
        <h2>ISR Fetch Data from httpbin.org</h2>
        <p><strong>Timestamp:</strong> {data.timestamp}</p>
        <p><strong>Random:</strong> {data.random}</p>
        <p><strong>User-Agent:</strong></p>
        <div style={{ 
          background: '#d4f4dd', 
          padding: '10px', 
          margin: '10px 0',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '1.1em'
        }}>
          {data.userAgent}
        </div>
        
        <details style={{ marginTop: '20px' }}>
          <summary>All Headers Sent by ISR</summary>
          <pre style={{ background: '#ffffff', padding: '10px', overflow: 'auto' }}>
            {JSON.stringify(data.headers, null, 2)}
          </pre>
        </details>
      </div>

      <form action={revalidate}>
        <button 
          type="submit" 
          style={{ 
            padding: '12px 24px', 
            fontSize: '16px',
            background: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Revalidate with ISR
        </button>
      </form>
    </section>
  );
}