import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <aside className="h-full w-64 fixed left-0 top-0 bg-surface-container-low flex flex-col p-md gap-sm shadow-md z-40 select-none border-r border-outline-variant/10">
      <div className="mb-md">
        <Link to="/" className="font-headline-sm text-headline-sm font-black text-primary hover:opacity-90 block">
          CulinShare
        </Link>
      </div>
      
      {/* Admin avatar */}
      <div className="flex items-center gap-sm p-sm mb-lg bg-surface-container-high rounded-xl border border-outline-variant/15 shadow-sm">
        <img
          alt="Admin Avatar"
          className="w-10 h-10 rounded-full object-cover border border-outline-variant"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBG9O1ZQKYHNuni1zWWdQqNlphxL9M8b43LiJ8F70YjsN5UnQzqwoB9pXT4-Ur1wyFPjdC3jFitoDDdZWPiLv0_83l-Y7BWXuY1CVZLJ_3kzl4x4_3e3JaaeATzHTSQcLnqzWfNfjy8skNNxF-hvpRri4fkPPQOzCSnXwAYSE2T29gWmLfIAQBA_BFndKtfJPcyTsweoIM__Whyvc6bpWaLoYwBL7diTpn3MgiugWB-t_nFKwjCmRMPSctRregPHQJVcjvrpEZ7IA"
        />
        <div>
          <p className="font-label-md text-label-md text-primary font-bold">Chef Admin</p>
          <p className="font-label-sm text-label-sm text-on-surface-variant font-medium">Premium Member</p>
        </div>
      </div>
      
      {/* Navigation menu */}
      <nav className="flex flex-col gap-xs flex-grow">
        <a className="flex items-center gap-sm p-sm bg-secondary-container text-on-secondary-container font-bold rounded-lg transition-all active:scale-95 shadow-sm" href="#">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-label-md text-label-md">Dashboard</span>
        </a>
        <a className="flex items-center gap-sm p-sm text-on-surface-variant hover:bg-surface-variant rounded-lg transition-colors" href="#">
          <span className="material-symbols-outlined">person</span>
          <span className="font-label-md text-label-md">Quản lý User</span>
        </a>
        <a className="flex items-center gap-sm p-sm text-on-surface-variant hover:bg-surface-variant rounded-lg transition-colors" href="#">
          <span className="material-symbols-outlined">menu_book</span>
          <span className="font-label-md text-label-md">Quản lý Công thức</span>
        </a>
        <a className="flex items-center gap-sm p-sm text-on-surface-variant hover:bg-surface-variant rounded-lg transition-colors" href="#">
          <span className="material-symbols-outlined">fact_check</span>
          <span className="font-label-md text-label-md">Duyệt bài</span>
        </a>
        <a className="flex items-center gap-sm p-sm text-on-surface-variant hover:bg-surface-variant rounded-lg transition-colors" href="#">
          <span className="material-symbols-outlined">category</span>
          <span className="font-label-md text-label-md">Danh mục</span>
        </a>
      </nav>
      
      <Link
        to="/submit-recipe"
        className="mt-auto bg-primary text-on-primary py-2.5 rounded-lg font-label-md text-label-md hover:opacity-90 transition-all flex items-center justify-center gap-xs font-bold active:scale-95 shadow-md"
      >
        <span className="material-symbols-outlined text-[20px] font-bold">add</span>
        Post New Recipe
      </Link>
    </aside>
  );
};

export default AdminSidebar;
