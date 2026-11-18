import React, { useState, useRef } from 'react';
import { Home, BookOpen, Cpu, ChevronLeft, ChevronRight, Menu, X, FolderDown } from 'lucide-react';

const Brand = ({ className }) => (
  <div className={`flex shrink-0 items-center justify-center bg-[#111d4a] text-white ${className}`}>
    <Cpu className="h-1/2 w-1/2" />
  </div>
);

// One row used for Home, lectures, and resources.
const NavItem = ({ icon: Icon, label, prefix, active, collapsed, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    title={collapsed ? `${prefix ? `${prefix}. ` : ''}${label}` : undefined}
    className={`group flex w-full items-center rounded-xl py-2.5 transition-colors ${
      collapsed ? 'justify-center' : 'justify-between px-3.5'
    } ${
      active
        ? 'bg-gray-100 font-semibold text-gray-900'
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    <span className="flex items-center gap-3 overflow-hidden">
      <Icon
        className={`h-4 w-4 shrink-0 ${
          active ? 'text-[#92140c]' : 'text-gray-400 group-hover:text-gray-700'
        }`}
      />
      {!collapsed && (
        <span className="truncate">
          {prefix && <span className="mr-1.5 text-xs text-gray-400">{prefix}</span>}
          {label}
        </span>
      )}
    </span>
    {!collapsed && active && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#92140c]" />}
  </button>
);

const SideNav = ({ lectures = [], activeId, onSelect, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const drawerRef = useRef(null);
  const CollapseIcon = collapsed ? ChevronRight : ChevronLeft;

  const go = (id) => {
    onSelect(id);
    if (drawerRef.current) drawerRef.current.checked = false; // close mobile drawer
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="os-course-drawer" ref={drawerRef} type="checkbox" className="drawer-toggle" />

      {/* Main content + mobile header */}
      <div className="drawer-content flex min-h-screen flex-col bg-white text-gray-900">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-100 bg-white/90 px-4 py-3 backdrop-blur-md lg:hidden">
          <div className="flex items-center gap-2.5">
            <Brand className="h-8 w-8 rounded-xl" />
            <span className="font-semibold text-gray-900">OS Course</span>
          </div>
          <label
            htmlFor="os-course-drawer"
            aria-label="open sidebar"
            className="btn btn-ghost btn-sm btn-square text-gray-600 hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </label>
        </header>

        <main className="flex-1">{children}</main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-40 overflow-visible">
        <label htmlFor="os-course-drawer" aria-label="close sidebar" className="drawer-overlay" />

        <aside
          className={`relative flex min-h-full flex-col border-r border-gray-100 bg-white transition-all duration-300 ${
            collapsed ? 'w-20' : 'w-68'
          }`}
        >
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
            className="absolute -right-3.5 top-7 z-50 hidden h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-colors hover:text-gray-900 lg:flex"
          >
            <CollapseIcon className="h-4 w-4" />
          </button>

          <div className={`flex items-center px-5 py-6 ${collapsed ? 'justify-center' : 'justify-between'}`}>
            <div className="flex items-center gap-3">
              <Brand className="h-10 w-10 rounded-2xl shadow-xs" />
              {!collapsed && (
                <div className="overflow-hidden">
                  <h1 className="truncate text-sm font-bold text-gray-900">Operating Systems</h1>
                  <p className="truncate text-xs text-gray-400">Interactive Notes</p>
                </div>
              )}
            </div>
            <label
              htmlFor="os-course-drawer"
              aria-label="close sidebar"
              className="btn btn-ghost btn-xs btn-square text-gray-400 hover:bg-gray-100 hover:text-gray-900 lg:hidden"
            >
              <X className="h-4 w-4" />
            </label>
          </div>

          <nav className="flex-1 space-y-1.5 px-3 py-2 text-sm">
            <NavItem icon={Home} label="Home" active={activeId === 'home'} collapsed={collapsed} onClick={() => go('home')} />
            
            <div className="my-3 border-t border-gray-100" />
            
            {!collapsed && (
              <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wider text-gray-400">Lectures</p>
            )}
            {lectures.map((l) => (
              <NavItem
                key={l.id}
                icon={BookOpen}
                label={l.title}
                prefix={l.number}
                active={activeId === l.id}
                collapsed={collapsed}
                onClick={() => go(l.id)}
              />
            ))}

            <div className="my-3 border-t border-gray-100" />

            {!collapsed && (
              <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wider text-gray-400">Hub</p>
            )}
            <NavItem
              icon={FolderDown}
              label="Resources"
              active={activeId === 'resources'}
              collapsed={collapsed}
              onClick={() => go('resources')}
            />
          </nav>
        </aside>
      </div>
    </div>
  );
};

export default SideNav;