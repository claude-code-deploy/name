// 카쿠요무 전용 중계 서버 (Vercel). 주소: https://<이름>.vercel.app/api/proxy?url=<카쿠요무 주소>
module.exports = async (req, res) => {
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-headers', '*');
  if (req.method === 'OPTIONS') return res.status(204).end();
  let u;
  try { u = new URL(String(req.query.url || '')); } catch { return res.status(400).send('url 필요'); }
  if (!/(^|\.)kakuyomu\.jp$/.test(u.hostname)) return res.status(403).send('허용되지 않은 도메인');
  try {
    const r = await fetch(u.href, {
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        'accept': 'text/html,application/xhtml+xml',
        'accept-language': 'ja,en;q=0.8',
      },
    });
    const buf = Buffer.from(await r.arrayBuffer());
    res.setHeader('content-type', r.headers.get('content-type') || 'text/html; charset=utf-8');
    res.status(r.status).send(buf);
  } catch (e) {
    res.status(502).send('가져오기 실패: ' + e.message);
  }
};
