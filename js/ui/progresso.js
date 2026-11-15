// Barra de progresso de leitura (topo da página): acompanha a rolagem.

export function iniciarBarraLeitura() {
  const barra = document.getElementById('barra-leitura');
  if (!barra) return;
  const trilho = barra.parentElement;
  let agendado = false;

  const atualizar = () => {
    agendado = false;
    const doc = document.documentElement;
    const total = doc.scrollHeight - doc.clientHeight;
    const fracao = total > 4 ? Math.min(1, Math.max(0, (window.scrollY || doc.scrollTop) / total)) : 0;
    barra.style.transform = `scaleX(${fracao})`;
    trilho?.setAttribute('aria-valuenow', String(Math.round(fracao * 100)));
  };

  const agendar = () => {
    if (agendado) return;
    agendado = true;
    requestAnimationFrame(atualizar);
  };

  window.addEventListener('scroll', agendar, { passive: true });
  window.addEventListener('resize', agendar, { passive: true });
  document.addEventListener('derivadas:conteudo', agendar);
  if (typeof ResizeObserver === 'function') new ResizeObserver(agendar).observe(document.body);
  atualizar();
}
