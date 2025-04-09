// app/chat/layout.tsx
import React from 'react';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* 顶部导航栏：使用重复背景图 */}
      <header
        className="text-white px-6 py-4 shadow flex items-center gap-4"
        style={{
          backgroundImage: "url('/assets/aboriginal/header-background.png')",
          backgroundRepeat: 'repeat-x',          // 横向平铺
          backgroundSize: 'auto 100%',           // 高度撑满，高度固定，宽度重复
          backgroundPosition: 'center',
        }}
      >
        <img //logo 图片
          src="/assets/aboriginal/logo.png"
          alt="Logo"
          className="h-16 w-16 rounded-full border border-white shadow"
        />
        <h1 className="text-2xl font-bold drop-shadow">Travel Planner</h1>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}

