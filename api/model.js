export default async function handler(req, res) {
  const fileId = '18VTjIpCPQs2cF61tVc-NA3Wo-I3_KJiV';
  const url = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`;
  try {
    const upstream = await fetch(url, { redirect: 'follow' });
    if (!upstream.ok) {
      res.status(502).send('Model upstream failed');
      return;
    }
    const data = Buffer.from(await upstream.arrayBuffer());
    res.setHeader('Content-Type', 'model/gltf-binary');
    res.setHeader('Content-Length', String(data.length));
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Model proxy error');
  }
}
