/* Instalar como app (PWA) - Evrix Financeiro */
(function () {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
    }

    const botoes = () => document.querySelectorAll('.pwa-install');
    const instalado = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
    let evento = null;

    const mostrar = () => botoes().forEach(b => b.classList.add('show'));
    const esconder = () => botoes().forEach(b => b.classList.remove('show'));
    const aviso = (msg) => {
        const t = document.getElementById('toast');
        if (!t) return alert(msg);
        t.textContent = msg; t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 6000);
    };

    if (instalado()) return;

    window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); evento = e; mostrar(); });
    window.addEventListener('appinstalled', () => { evento = null; esconder(); });

    // iPhone/iPad não tem prompt automático: mostra o botão com instrução
    if (ios) document.addEventListener('DOMContentLoaded', mostrar);

    document.addEventListener('click', async e => {
        if (!e.target.closest('.pwa-install')) return;
        if (evento) {
            evento.prompt();
            await evento.userChoice;
            evento = null; esconder();
        } else if (ios) {
            aviso('No Safari: toque em Compartilhar (□↑) e depois em "Adicionar à Tela de Início".');
        } else {
            aviso('Use o menu do navegador (⋮) e toque em "Instalar app" ou "Adicionar à tela inicial".');
        }
    });
})();
