import React, { useState, useRef } from 'react';
import { Home, BookOpen, Cpu, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';

const SideNav = ({ lectures = [], activeId, onSelect, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const drawerToggleRef = useRef(null);

  const handleNavigation = (id) => {
    onSelect(id);
    if (drawerToggleRef.current) {
      drawerToggleRef.current.checked = false;
    }
  };

  return (
    <div className="drawer lg:drawer-open">
      <input
        id="os-course-drawer"
        ref={drawerToggleRef}
        type="checkbox"
        className="drawer-toggle"
      />

      {/* Main Content Area */}
      <div className="drawer-content flex min-h-screen flex-col bg-white text-gray-900">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-100 bg-white/90 px-4 py-3 backdrop-blur-md lg:hidden">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#111d4a] text-white">
              <Cpu className="h-4 w-4" />
            </div>
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

      {/* Sidebar Drawer */}
      <div className="drawer-side z-40 overflow-visible">
        <label
          htmlFor="os-course-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <aside
          className={`relative flex min-h-full flex-col border-r border-gray-100 bg-white transition-all duration-300 ${
            collapsed ? 'w-20' : 'w-68'
          }`}
        >
          {/* Floating Collapse Button (Desktop) */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
            className="absolute -right-3.5 top-7 z-50 hidden h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-colors hover:text-gray-900 lg:flex"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>

          {/* Brand Header */}
          <div
            className={`flex items-center px-5 py-6 ${
              collapsed ? 'justify-center' : 'justify-between'
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Minimal Deep Blue Brand Icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#111d4a] text-white shadow-xs">
                <Cpu className="h-5 w-5" />
              </div>

              {!collapsed && (
                <div className="overflow-hidden">
                  <h1 className="truncate text-sm font-bold text-gray-900">
                    Operating Systems
                  </h1>
                  <p className="truncate text-xs text-gray-400">
                    Interactive Notes
                  </p>
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

          {/* Navigation Menu */}
          <nav className="flex-1 space-y-1.5 px-3 py-2 text-sm">
            {/* Home Link */}
            <button
              type="button"
              onClick={() => handleNavigation('home')}
              title={collapsed ? 'Home' : undefined}
              className={`group flex w-full items-center rounded-xl py-2.5 transition-colors ${
                collapsed ? 'justify-center px-0' : 'gap-3 px-3.5'
              } ${
                activeId === 'home'
                  ? 'bg-gray-100 font-semibold text-gray-900'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Home
                className={`h-4 w-4 shrink-0 ${
                  activeId === 'home'
                    ? 'text-[#92140c]' /* Minimal Red Accent */
                    : 'text-gray-400 group-hover:text-gray-700'
                }`}
              />
              {!collapsed && <span>Home</span>}
            </button>

            {/* Subtle Divider */}
            <div className="my-3 border-t border-gray-100" />

            {/* Lectures List */}
            {lectures.map((lecture) => {
              const isActive = activeId === lecture.id;

              return (
                <button
                  key={lecture.id}
                  type="button"
                  onClick={() => handleNavigation(lecture.id)}
                  title={collapsed ? `${lecture.number}. ${lecture.title}` : undefined}
                  className={`group flex w-full items-center rounded-xl py-2.5 transition-colors ${
                    collapsed ? 'justify-center px-0' : 'justify-between px-3.5'
                  } ${
                    isActive
                      ? 'bg-gray-100 font-semibold text-gray-900'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <BookOpen
                      className={`h-4 w-4 shrink-0 ${
                        isActive
                          ? 'text-[#92140c]' /* Minimal Red Accent */
                          : 'text-gray-400 group-hover:text-gray-700'
                      }`}
                    />
                    {!collapsed && (
                      <span className="truncate">
                        <span className="mr-1.5 text-xs text-gray-400">
                          {lecture.number}
                        </span>
                        {lecture.title}
                      </span>
                    )}
                  </div>

                  {/* Subtle active dot when expanded */}
                  {!collapsed && isActive && (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#92140c]" />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>
      </div>
    </div>
  );
};

export default SideNav;