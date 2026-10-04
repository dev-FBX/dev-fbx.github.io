/* 04/10: chat do agente na vitrine estática (GitHub Pages). É o MESMO agente do site (Copilot Studio).
   A página pede um token temporário de Direct Line ao endpoint público do agente (nenhum segredo no navegador)
   e abre o Web Chat oficial da Microsoft, carregado só no primeiro clique.
   Visual: mesma marcação e mesmas classes do widget do Power Pages (.pva-floating-style …) para reaproveitar
   o CSS do site (fbx-chat.css, copiado do Header) e ficar igual ao chat de fbx.powerappsportals.com. */
(function () {
  var TOKEN_URL = 'https://0866bae38ef2e6d7aff7ae5e9f421d.e9.environment.api.powerplatform.com/powervirtualagents/botsbyschema/cra95_7722a5da-a696-430d-bf49-b46a6c00bb49/directline/token?api-version=2022-03-01-preview';
  var WEBCHAT = 'https://cdn.botframework.com/botframework-webchat/4.18.0/webchat.js';
  var me = (document.currentScript && document.currentScript.src) || '';
  var base = me.replace(/assets\/js\/fbx-chat\.js.*$/, '');
  var ver = me.split('?')[1] ? '?' + me.split('?')[1] : '';
  var lang = /\/en-US\//.test(location.pathname) ? 'en-US' : /\/es-ES\//.test(location.pathname) ? 'es-ES' : 'pt-BR';
  var TX = {
    'pt-BR': { abrir: 'Abrir a janela de chat', fechar: 'Fechar', nova: 'Nova conversa', erro: 'Não consegui abrir o chat agora. Tente de novo em instantes.', ph: 'Pergunte sobre projetos ou stack…', aviso: 'Conteúdo gerado por IA. Confira antes de usar.' },
    'en-US': { abrir: 'Open chat window', fechar: 'Close', nova: 'New chat', erro: 'Could not open the chat right now. Please try again shortly.', ph: 'Ask about projects or stack…', aviso: 'AI-generated content. Check it before using.' },
    'es-ES': { abrir: 'Abrir la ventana de chat', fechar: 'Cerrar', nova: 'Nueva conversación', erro: 'No pude abrir el chat ahora. Inténtalo de nuevo en un momento.', ph: 'Pregunta sobre proyectos o stack…', aviso: 'Contenido generado por IA. Revísalo antes de usarlo.' }
  }[lang];

  var lk = document.createElement('link'); lk.rel = 'stylesheet'; lk.href = base + 'assets/css/fbx-chat.css' + ver; document.head.appendChild(lk);
  /* só posição e esqueleto; cor, borda, bolhas e caixa de texto vêm do fbx-chat.css (o mesmo do Power Pages) */
  var css = '' +
    '.fbxc .fbxc-fab{position:fixed;right:26px;bottom:24px;z-index:2147483000;width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer}' +
    '.fbxc .fbxc-fab > button{width:100%;height:100%;border:0;border-radius:50%;background:transparent;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0}' +
    '.fbxc .fbxc-fab svg{width:24px;height:24px;color:var(--fbx-chat-text);fill:none;stroke:currentColor}' +
    '.fbxc .pva-embedded-web-chat-window-container.fbxc-box{position:fixed;right:16px;top:94px;bottom:16px;z-index:2147483001;width:min(500px,calc(100vw - 32px));display:none}' +
    '.fbxc .fbxc-box.is-open{display:block}' +
    '.fbxc .fbxc-box > div{display:flex;flex-direction:column;height:100%}' +
    '.fbxc .fbxc-head{display:flex;align-items:center;flex:0 0 57px;height:57px}' +
    '.fbxc .fbxc-head img{width:24px;height:24px;border-radius:50%;display:block}' +
    '.fbxc .fbxc-head .fbxc-t{flex:1 1 auto;display:flex;align-items:center;gap:14px;font-size:16px;font-weight:600}' +
    '.fbxc .fbxc-head button{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border:0;cursor:pointer;padding:0}' +
    '.fbxc .fbxc-head svg{width:20px;height:20px;fill:none !important;stroke:currentColor}' +
    '.fbxc .fbxc-body{flex:1 1 auto;min-height:0}' +
    '.fbxc .fbxc-msg{padding:16px;font-size:14px;color:var(--fbx-chat-text-2) !important}' +
    '.fbxc .fbxc-body .webchat__send-box{padding:6px 12px 4px}' +
    '.fbxc .fbxc-body .webchat__send-box__main{min-height:82px;align-items:flex-start}' +
    '.fbxc .fbxc-body .webchat__send-box-text-box{padding:10px 12px !important;align-self:flex-start}' +
    '.fbxc .fbxc-body .webchat__send-box__main > :last-child{align-self:flex-end}' +
    '.fbxc .fbxc-body .webchat__stacked-layout__avatar-gutter{display:none !important}' +
    '.fbxc .fbxc-body .webchat__stacked-layout__main{padding-left:0}' +
    '.fbxc .fbxc-body .webchat__bubble__content,.fbxc .fbxc-body .webchat__bubble__content p,.fbxc .fbxc-body .webchat__bubble__content li,.fbxc .fbxc-body .webchat__text-content{font-size:15px !important;line-height:1.6 !important;margin:0 !important}' +
    '.fbxc .fbxc-body .webchat__bubble__content p + p{margin-top:8px !important}' +
    '.fbxc .fbxc-body .webchat__send-box-text-box__input,.fbxc .fbxc-body .webchat__send-box-text-box__text-area{font-size:15px !important}' +
    '.pva-embedded-web-chat-window-container > div > div:first-child.fbxc-head svg,.pva-embedded-web-chat-window-container > div > div:first-child.fbxc-head svg *{fill:none !important;stroke:currentColor !important}' +
    '.fbxc .fbxc-fab svg,.fbxc .fbxc-fab svg *{fill:none !important;stroke:currentColor !important}' +
    '.fbxc .fbxc-body .webchat__send-box-text-box,.fbxc .fbxc-body .webchat__send-box-text-box *,.fbxc .fbxc-body .webchat__auto-resize-textarea{background:transparent !important;box-shadow:none !important;outline:none !important}' +
    '.fbxc .fbxc-foot{flex:0 0 auto;padding:4px 20px 12px;font-size:12px;line-height:1.4;color:var(--fbx-chat-text-2) !important;background:var(--fbx-chat-bg) !important}' +
    '@media (max-width:600px){.fbxc .pva-embedded-web-chat-window-container.fbxc-box{inset:0;width:100vw;height:100dvh;border-radius:0 !important}.fbxc .fbxc-fab{right:16px;bottom:16px}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var logo = base + 'assets/img/Logo-sm-64.png';
  var raiz = document.createElement('div'); raiz.className = 'pva-floating-style fbxc';
  raiz.innerHTML =
    '<div class="pva-embedded-web-chat-widget fbxc-fab"><button type="button" aria-label="' + TX.abrir + '" title="' + TX.abrir + '">' +
      '<svg viewBox="0 0 24 24" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg></button></div>' +
    '<div class="pva-embedded-web-chat-window-container fbxc-box" role="dialog" aria-label="Copilot FBX"><div>' +
      '<div class="fbxc-head"><div class="fbxc-t"><img src="' + logo + '" alt="">Copilot FBX</div>' +
        '<button type="button" class="fbxc-nova" aria-label="' + TX.nova + '" title="' + TX.nova + '"><svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v10a1.5 1.5 0 0 1-1.5 1.5H9l-5 4z"/><path d="M12 7.5v6M9 10.5h6"/></svg></button>' +
        '<button type="button" class="fbxc-x" aria-label="' + TX.fechar + '" title="' + TX.fechar + '"><svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      '<div class="fbxc-body"><div class="fbxc-msg">…</div></div>' +
      '<div class="fbxc-foot">' + TX.aviso + '</div>' +
    '</div></div>';
  document.body.appendChild(raiz);
  var fab = raiz.querySelector('.fbxc-fab'), box = raiz.querySelector('.fbxc-box'), corpo = raiz.querySelector('.fbxc-body');
  var aberto = false, iniciado = false;

  function carrega(src) { return new Promise(function (ok, erro) { if (window.WebChat) return ok(); var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = erro; document.head.appendChild(s); }); }
  function conversa() {
    iniciado = true;
    corpo.innerHTML = '<div class="fbxc-msg">…</div>';
    Promise.all([carrega(WEBCHAT), fetch(TOKEN_URL).then(function (r) { return r.json(); })]).then(function (res) {
      var token = res[1].token; if (!token) throw new Error('sem token');
      corpo.innerHTML = '';
      var dl = window.WebChat.createDirectLine({ token: token });
      var store = window.WebChat.createStore({}, function () { return function (next) { return function (action) {
        if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
          dl.postActivity({ type: 'event', name: 'startConversation', locale: lang, from: { id: 'visitante', role: 'user' } }).subscribe();
        }
        return next(action); }; }; });
      window.WebChat.renderWebChat({ directLine: dl, store: store, locale: lang,
        styleOptions: { hideUploadButton: true, botAvatarInitials: '', userAvatarInitials: '', bubbleBorderWidth: 0, bubbleFromUserBorderWidth: 0,
          bubbleBorderRadius: 8, bubbleFromUserBorderRadius: 8, bubbleMinHeight: 0, paddingRegular: 12, sendBoxHeight: 82, sendBoxTextWrap: true, primaryFont: "'Inter','Segoe UI',system-ui,sans-serif" },
        overrideLocalizedStrings: { TEXT_INPUT_PLACEHOLDER: TX.ph } }, corpo);
    }).catch(function () { iniciado = false; corpo.innerHTML = '<div class="fbxc-msg">' + TX.erro + '</div>'; });
  }
  function abre() { aberto = true; box.classList.add('is-open'); fab.style.display = 'none'; if (!iniciado) conversa(); }
  function fecha() { aberto = false; box.classList.remove('is-open'); fab.style.display = ''; }
  fab.querySelector('button').addEventListener('click', abre);
  raiz.querySelector('.fbxc-x').addEventListener('click', fecha);
  raiz.querySelector('.fbxc-nova').addEventListener('click', conversa);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && aberto) fecha(); });
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-fbx-open-chat]'); if (b) { e.preventDefault(); abre(); } });
})();
