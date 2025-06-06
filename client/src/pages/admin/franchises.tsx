import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Header } from "@/components/layout/header";

export default function AdminFranchises() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Overlay para fechar o menu mobile */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden sidebar-overlay hidden"
        onClick={() => {
          const sidebar = document.querySelector('.sidebar');
          const overlay = document.querySelector('.sidebar-overlay');
          if (sidebar && overlay) {
            sidebar.classList.remove('sidebar-open', 'flex', 'translate-x-0');
            sidebar.classList.add('hidden', '-translate-x-full');
            overlay.classList.add('hidden');
          }
        }}
      ></div>
      
      <Sidebar userType="admin" />
      
      <div className="lg:pl-72">
        <Header />
        
        <main className="p-6 pb-20">
          <h1 className="text-2xl font-bold mb-6">Gestão de Franquias</h1>
          
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500">Aqui você pode gerenciar todas as franquias da rede.</p>
          </div>
        </main>
        
        <MobileNav activeItem="franchises" />
      </div>
    </div>
  );
}