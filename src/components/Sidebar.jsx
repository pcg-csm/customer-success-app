import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, User, Settings, Activity, ClipboardCheck, GraduationCap, BookOpen, ChevronLeft, ChevronRight, LogOut, ChevronUp, ChevronDown, Sun, Moon } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
    const { currentUser, users, setCurrentUser, hasPermission } = useData();
    const { theme, toggleTheme } = useTheme();
    const [showUserSwitcher, setShowUserSwitcher] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState({
        '/customers': true,
        '/documentation': true,
        '/settings': true
    });

    const toggleGroup = (e, path) => {
        e.preventDefault();
        e.stopPropagation();
        setExpandedGroups(prev => ({
            ...prev,
            [path]: !prev[path]
        }));
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        {
            icon: Users,
            label: 'Customers',
            path: '/customers',
            subItems: [
                { icon: Activity, label: 'Activity', path: '/activity' }
            ]
        },
        {
            icon: ClipboardCheck,
            label: 'Presales',
            path: '/presales',
            subItems: [
                { icon: Activity, label: 'Activity', path: '/activity' }
            ]
        },
        { icon: GraduationCap, label: 'Training', path: '/training' },
        {
            icon: BookOpen,
            label: 'Documentation',
            path: '/documentation',
            subItems: [
                { icon: Activity, label: 'Activity', path: '/activity' }
            ]
        },
        {
            icon: Settings,
            label: 'Settings',
            path: '/settings',
            subItems: [
                { icon: User, label: 'Users', path: '/users', permission: 'MANAGE_USERS' }
            ]
        },
    ];

    const renderNavItem = (item, isSubItem = false) => {
        const itemHasPermission = !item.permission || (typeof item.permission === 'string' ? currentUser.role === 'ADMIN' : true);
        if (!itemHasPermission) return null;

        const isExpanded = expandedGroups[item.path];
        const hasSubItems = item.subItems && item.subItems.length > 0;

        return (
            <React.Fragment key={item.path}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <NavLink
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => {
                            if (hasSubItems && !isExpanded) {
                                setExpandedGroups(prev => ({ ...prev, [item.path]: true }));
                            }
                        }}
                        style={{
                            display: 'flex',
                            flex: 1,
                            justifyContent: isCollapsed ? 'center' : 'flex-start',
                            padding: isCollapsed ? '0.75rem' : '0.75rem 1rem',
                            paddingLeft: !isCollapsed && isSubItem ? '2.5rem' : undefined,
                            paddingRight: !isCollapsed && hasSubItems ? '2.5rem' : undefined,
                            opacity: isSubItem ? 0.8 : 1,
                            fontSize: isSubItem ? '0.85rem' : '1rem'
                        }}
                    >
                        <item.icon size={isSubItem ? 16 : 20} />
                        {!isCollapsed && <span style={{ marginLeft: '0.75rem', whiteSpace: 'nowrap' }}>{item.label}</span>}
                    </NavLink>

                    {!isCollapsed && hasSubItems && (
                        <button
                            onClick={(e) => toggleGroup(e, item.path)}
                            style={{
                                position: 'absolute',
                                right: '0.75rem',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--color-text-muted)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '0.25rem',
                                borderRadius: '4px',
                                transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                        >
                            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                    )}
                </div>
                {!isCollapsed && hasSubItems && isExpanded && item.subItems.map(subItem => renderNavItem(subItem, true))}
            </React.Fragment>
        );
    };

    if (!currentUser) return null;

    return (
        <aside className="sidebar glass-panel" style={{
            borderRadius: '0', borderLeft: 'none', borderTop: 'none', borderBottom: 'none',
            width: isCollapsed ? '80px' : '280px',
            transition: 'width 0.3s ease',
            padding: '1.5rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'visible', // Keep it visible for the switcher popover
            zIndex: 100
        }}>
            <div style={{ paddingBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {!isCollapsed && (
                    <div>
                        <h2 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                            PCG
                        </h2>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>Customer Success</p>
                    </div>
                )}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                        onClick={toggleTheme}
                        className="glass-panel"
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        style={{
                            padding: '0.5rem',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'var(--color-text-main)'
                        }}
                    >
                        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                    <button
                        onClick={toggleSidebar}
                        className="glass-panel"
                        style={{
                            padding: '0.5rem',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'var(--color-text-main)'
                        }}
                    >
                        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>
                </div>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {navItems.map(item => renderNavItem(item))}

                <button
                    onClick={() => setCurrentUser(null)}
                    className="nav-item"
                    style={{
                        display: 'flex',
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        padding: isCollapsed ? '0.75rem' : '0.75rem 1rem',
                        marginTop: '0.5rem',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        width: '100%',
                        color: '#f87171' // Red color for logout
                    }}
                >
                    <LogOut size={20} />
                    {!isCollapsed && <span style={{ marginLeft: '0.75rem', whiteSpace: 'nowrap' }}>Sign Out</span>}
                </button>
            </nav>

            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', position: 'relative' }}>
                <div
                    onClick={() => setShowUserSwitcher(!showUserSwitcher)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        borderRadius: '8px',
                        background: showUserSwitcher ? 'rgba(255,255,255,0.05)' : 'transparent'
                    }}
                >
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: currentUser.role === 'ADMIN' ? 'var(--color-success)' : 'var(--color-primary)',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        color: 'white'
                    }}>
                        {currentUser.firstName[0]}
                    </div>
                    {!isCollapsed && (
                        <div style={{ overflow: 'hidden', flex: 1 }}>
                            <p style={{ fontSize: '0.875rem', fontWeight: '500', whiteSpace: 'nowrap' }}>{currentUser.firstName} {currentUser.lastName}</p>
                            <p style={{ fontSize: '0.7rem', color: 'var(--color-primary)', whiteSpace: 'nowrap' }}>{currentUser.role}</p>
                        </div>
                    )}
                    {!isCollapsed && <ChevronUp size={16} style={{ color: 'var(--color-text-muted)', transform: showUserSwitcher ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s' }} />}
                </div>

                {showUserSwitcher && (
                    <div className="glass-panel" style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: '0',
                        width: '100%',
                        marginBottom: '0.5rem',
                        zIndex: 200,
                        padding: '0.5rem',
                        maxHeight: '250px',
                        overflowY: 'auto',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                    }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--color-text-muted)', padding: '0.5rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '0.5rem' }}>SWITCH ACCOUNT</p>
                        {users.map(user => (
                            <div
                                key={user.id}
                                onClick={() => { setCurrentUser(user); setShowUserSwitcher(false); }}
                                style={{
                                    padding: '0.5rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    background: user.id === currentUser.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                                    fontSize: '0.8rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    marginBottom: '0.25rem'
                                }}
                            >
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: user.role === 'ADMIN' ? 'var(--color-success)' : 'var(--color-primary)' }}></div>
                                <div style={{ flex: 1 }}>
                                    <div>{user.firstName} {user.lastName}</div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>{user.role}</div>
                                </div>
                            </div>
                        ))}
                        <div
                            onClick={() => { setCurrentUser(null); setShowUserSwitcher(false); }}
                            style={{
                                marginTop: '0.5rem',
                                padding: '0.5rem',
                                borderTop: '1px solid var(--glass-border)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: '#f87171',
                                fontSize: '0.8rem'
                            }}
                        >
                            <LogOut size={14} />
                            <span>Sign Out</span>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
