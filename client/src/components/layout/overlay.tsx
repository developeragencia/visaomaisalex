export function Overlay() {
  // Função para fechar o menu quando clicar no overlay
  const closeMenu = () => {
    // Remove todas as classes relevantes
    document.body.classList.remove('menu-open');
    document.querySelector('.sidebar')?.classList.remove('sidebar-open');
    document.querySelector('.overlay')?.classList.remove('overlay-visible');
  };

  return (
    <div 
      className="overlay"
      onClick={closeMenu}
      aria-hidden="true"
    />
  );
}