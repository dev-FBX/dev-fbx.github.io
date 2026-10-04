/* 04/10: chat do agente na vitrine estática (GitHub Pages). É o MESMO agente do site (Copilot Studio).
   A página pede um token temporário de Direct Line ao endpoint público do agente (nenhum segredo no navegador)
   e abre o Web Chat oficial da Microsoft, carregado só no primeiro clique. */
(function () {
  var TOKEN_URL = 'https://0866bae38ef2e6d7aff7ae5e9f421d.e9.environment.api.powerplatform.com/powervirtualagents/botsbyschema/cra95_7722a5da-a696-430d-bf49-b46a6c00bb49/directline/token?api-version=2022-03-01-preview';
  var WEBCHAT = 'https://cdn.botframework.com/botframework-webchat/4.18.0/webchat.js';
  var lang = (document.documentElement.getAttribute('lang') || location.pathname.split('/')[1] || 'pt-BR');
  if (!/^(pt-BR|en-US|es-ES)$/.test(lang)) lang = /\/en-US\//.test(location.pathname) ? 'en-US' : /\/es-ES\//.test(location.pathname) ? 'es-ES' : 'pt-BR';
  var TX = {
    'pt-BR': { abrir: 'Conversar com o agente', titulo: 'Copilot FBX', sub: 'Agente do Copilot Studio', fechar: 'Fechar', erro: 'Não consegui abrir o chat agora. Tente de novo em instantes.', ph: 'Pergunte sobre projetos, stack ou contato…' },
    'en-US': { abrir: 'Chat with the agent', titulo: 'Copilot FBX', sub: 'Copilot Studio agent', fechar: 'Close', erro: 'Could not open the chat right now. Please try again shortly.', ph: 'Ask about projects, stack or contact…' },
    'es-ES': { abrir: 'Hablar con el agente', titulo: 'Copilot FBX', sub: 'Agente de Copilot Studio', fechar: 'Cerrar', erro: 'No pude abrir el chat ahora. Inténtalo de nuevo en un momento.', ph: 'Pregunta sobre proyectos, stack o contacto…' }
  }[lang] || {};
  var css = '' +
    '.fbxc-fab{position:fixed;right:20px;bottom:20px;z-index:2147483000;width:56px;height:56px;border-radius:50%;border:1px solid var(--border-strong,#444);background:var(--bg-elev-1,#1c1c1c);color:var(--text,#f2f2f2);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.35)}' +
    '.fbxc-fab:hover{transform:translateY(-1px)}.fbxc-fab svg{width:26px;height:26px}' +
    '.fbxc-box{position:fixed;right:20px;bottom:88px;z-index:2147483001;width:min(400px,calc(100vw - 32px));height:min(600px,calc(100vh - 120px));display:none;flex-direction:column;border:1px solid var(--border,#333);border-radius:16px;overflow:hidden;background:var(--bg-elev-1,#161616);box-shadow:0 18px 50px rgba(0,0,0,.45)}' +
    '.fbxc-box.is-open{display:flex}' +
    '.fbxc-top{display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid var(--border,#333)}' +
    '.fbxc-top b{display:block;font-size:14px;color:var(--text,#f2f2f2)}.fbxc-top span{display:block;font-size:12px;color:var(--text-muted,#a1a1aa)}' +
    '.fbxc-x{margin-left:auto;width:36px;height:36px;border:0;border-radius:8px;background:transparent;color:var(--text,#f2f2f2);font-size:18px;cursor:pointer}' +
    '.fbxc-x:hover{background:var(--surface-hover,rgba(255,255,255,.08))}' +
    '.fbxc-body{flex:1 1 auto;min-height:0}.fbxc-msg{padding:16px;font-size:14px;color:var(--text-muted,#a1a1aa)}' +
    '@media (max-width:600px){.fbxc-box{right:8px;left:8px;width:auto;bottom:80px;height:calc(100vh - 100px)}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01"/></svg>';
  var fab = document.createElement('button'); fab.type = 'button'; fab.className = 'fbxc-fab'; fab.setAttribute('aria-label', TX.abrir); fab.title = TX.abrir; fab.innerHTML = ICON;
  var box = document.createElement('div'); box.className = 'fbxc-box'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', TX.titulo);
  box.innerHTML = '<div class="fbxc-top"><div><b>' + TX.titulo + '</b><span>' + TX.sub + '</span></div><button type="button" class="fbxc-x" aria-label="' + TX.fechar + '">✕</button></div><div class="fbxc-body"><div class="fbxc-msg">…</div></div>';
  document.body.appendChild(fab); document.body.appendChild(box);
  var iniciado = false;
  function tema() { var t = document.documentElement.getAttribute('data-theme'); return t ? t : (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'); }
  function carrega(src) { return new Promise(function (ok, erro) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = erro; document.head.appendChild(s); }); }
  function inicia() {
    if (iniciado) return; iniciado = true;
    var corpo = box.querySelector('.fbxc-body');
    Promise.all([carrega(WEBCHAT), fetch(TOKEN_URL).then(function (r) { return r.json(); })]).then(function (res) {
      var token = res[1].token; if (!token) throw new Error('sem token');
      corpo.innerHTML = '';
      var claro = tema() === 'light';
      var dl = window.WebChat.createDirectLine({ token: token });
      var store = window.WebChat.createStore({}, function () { return function (next) { return function (action) {
        if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
          dl.postActivity({ type: 'event', name: 'startConversation', locale: lang, from: { id: 'visitante', role: 'user' } }).subscribe();
        }
        return next(action); }; }; });
      window.WebChat.renderWebChat({
        directLine: dl, store: store, locale: lang,
        styleOptions: {
          backgroundColor: claro ? '#ffffff' : '#161616', primaryFont: 'Inter, system-ui, sans-serif', bubbleBackground: claro ? '#f0f0f3' : '#232323',
          bubbleTextColor: claro ? '#111113' : '#f2f2f2', bubbleBorderRadius: 12, bubbleFromUserBackground: claro ? '#111113' : '#f2f2f2',
          bubbleFromUserTextColor: claro ? '#ffffff' : '#111113', bubbleFromUserBorderRadius: 12, sendBoxBackground: claro ? '#ffffff' : '#1c1c1c',
          sendBoxTextColor: claro ? '#111113' : '#f2f2f2', sendBoxButtonColor: claro ? '#111113' : '#f2f2f2', hideUploadButton: true,
          suggestedActionLayout: 'stacked', accent: claro ? '#111113' : '#f2f2f2', subtle: claro ? '#5a5a63' : '#a1a1aa', timestampColor: claro ? '#5a5a63' : '#8a8a92'
        },
        strings: { TEXT_INPUT_PLACEHOLDER: TX.ph }
      }, corpo);
    }).catch(function () { iniciado = false; corpo.innerHTML = '<div class="fbxc-msg">' + TX.erro + '</div>'; });
  }
  function abre() { box.classList.add('is-open'); inicia(); }
  function fecha() { box.classList.remove('is-open'); }
  fab.addEventListener('click', function () { box.classList.contains('is-open') ? fecha() : abre(); });
  box.querySelector('.fbxc-x').addEventListener('click', fecha);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fecha(); });
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-fbx-open-chat]'); if (b) { e.preventDefault(); abre(); } });
})();
