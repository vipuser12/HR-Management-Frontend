import { Menu } from 'lucide-react';

export default function Header({ toggleSidebar, user }) {
  
  const initial = user?.username ? user.username[0].toUpperCase() : 'U';

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
      <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">
        <Menu size={24} />
      </button>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          
          <p className="text-sm font-bold text-gray-800">{user?.username || 'Guest'}</p>
          
          <p className="text-xs text-gray-500 capitalize">{user?.role || 'User'}</p>
        </div>

        <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">
          {initial}
        </div>
      </div>
    </header>
  );
}
