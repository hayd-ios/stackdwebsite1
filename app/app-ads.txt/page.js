export const dynamic = 'force-static'

export async function generateMetadata() {
  return {
    other: {
      'content-type': 'text/plain',
    },
  }
}

export default function AppAds() {
  return (
    <pre style={{ margin: 0, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>google.com, pub-1574070800789955, DIRECT, f08c47fec0942fa0</pre>
  )
}