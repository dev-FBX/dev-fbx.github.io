/* Protótipo navegável: telas reais + áreas clicáveis. Config em window.PROTO. */
(function () {
  const P = window.PROTO, st = { tela: P.inicio, tema: 'light', chat: false };
  const $ = (s) => document.querySelector(s);
  const mob = () => window.matchMedia('(max-width: 760px)').matches;
  function src() {
    const t = P.telas[st.tela], k = (mob() ? 'm' : 'd') + (st.tema === 'dark' ? 'd' : 'l') + (st.chat && t.chat ? 'c' : '');
    return P.base + t.img.replace('{k}', k);
  }
  function areas() {
    const t = P.telas[st.tela], lado = mob() ? 'm' : 'd';
    return (P.comuns[lado] || []).concat((t.areas && t.areas[lado]) || []);
  }
  function render() {
    const img = $('#tela'), box = $('#areas');
    img.src = src(); img.alt = P.telas[st.tela].nome + (st.tema === 'dark' ? ' (tema escuro)' : '');
    $('#nome').textContent = P.telas[st.tela].nome;
    box.innerHTML = '';
    areas().forEach((a) => {
      if (a.go === 'chat' && !P.telas[st.tela].chat) return;
      const b = document.createElement('button');
      b.className = 'hot'; b.type = 'button';
      b.style.left = a.x + '%'; b.style.top = a.y + '%'; b.style.width = a.w + '%'; b.style.height = a.h + '%';
      b.title = a.t || ''; b.setAttribute('aria-label', a.t || a.go);
      b.onclick = () => {
        if (a.go === 'tema') st.tema = st.tema === 'dark' ? 'light' : 'dark';
        else if (a.go === 'chat') st.chat = !st.chat;
        else { st.tela = a.go; st.chat = false; }
        render();
      };
      box.appendChild(b);
    });
    document.querySelectorAll('[data-ir]').forEach((x) => x.classList.toggle('on', x.dataset.ir === st.tela));
  }
  document.querySelectorAll('[data-ir]').forEach((x) => (x.onclick = () => { st.tela = x.dataset.ir; st.chat = false; render(); }));
  $('#mostrar').onchange = (e) => document.body.classList.toggle('ver-areas', e.target.checked);
  // pré-carrega as variações
  Object.values(P.telas).forEach((t) => (P.temas === false ? ['dl', 'ml'] : ['dl', 'dd', 'ml', 'md']).concat(t.chat ? ['dlc', 'ddc', 'mlc', 'mdc'] : []).forEach((k) => { const i = new Image(); i.src = P.base + t.img.replace('{k}', k); }));
  window.addEventListener('resize', render);
  render();
  setTimeout(() => document.body.classList.add('dica-off'), 6000);
})();
