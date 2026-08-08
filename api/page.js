export default async function handler(req, res) {
  try {
    const upstream = await fetch('https://raw.githubusercontent.com/kava-studia/gastrobar-audit/main/index.html', {
      headers: { 'user-agent': 'gastrobar-audit-vercel' }
    });

    if (!upstream.ok) {
      res.status(502).send('Не удалось загрузить страницу');
      return;
    }

    let html = await upstream.text();

    html = html.replace(
      '<h1>Цифровой аудит<br><em>и план роста</em></h1>',
      '<h1 class="heroTitleFixed"><span class="heroTitleLine">Цифровой</span><span class="heroTitleLine heroTitleMiddle"><span>аудит</span><em>и план</em></span><span class="heroTitleLine"><em>роста</em></span></h1>'
    );

    const patch = `
<style id="hero-title-hotfix-v10">
.heroTitleFixed{display:flex!important;flex-direction:column!important;align-items:flex-start!important}
.heroTitleFixed .heroTitleLine{display:block!important;white-space:nowrap!important}
.heroTitleFixed .heroTitleMiddle{display:flex!important;align-items:baseline!important;gap:.18em!important;white-space:nowrap!important}
.heroTitleFixed .heroTitleMiddle em{margin:0!important;padding:0!important}
@media(max-width:700px){
  .heroTitleFixed{font-size:clamp(43px,13.2vw,56px)!important;line-height:.92!important;letter-spacing:-.045em!important}
  .heroTitleFixed .heroTitleMiddle{gap:.20em!important}
}
@media(max-width:390px){
  .heroTitleFixed{font-size:43px!important}
  .heroTitleFixed .heroTitleMiddle{gap:.22em!important}
}
</style>`;

    html = html.replace('</head>', patch + '</head>');

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=86400');
    res.status(200).send(html);
  } catch (error) {
    res.status(500).send('Ошибка загрузки страницы');
  }
}
