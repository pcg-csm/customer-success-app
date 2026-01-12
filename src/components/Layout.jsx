import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

import { useState } from 'react';

const Layout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="app-layout">
            <Sidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
            <main className="main-content" style={{
                marginLeft: isCollapsed ? '80px' : '280px',
                transition: 'margin-left 0.3s ease',
                width: isCollapsed ? 'calc(100vw - 80px)' : 'calc(100vw - 280px)'
            }}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
