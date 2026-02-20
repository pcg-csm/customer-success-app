import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Card from '../components/Card';
import { User, Plus, Trash2, Mail, Shield, Key } from 'lucide-react';

const Users = () => {
    const { users, addUser, removeUser, currentUser, hasPermission } = useData();
    const [newUser, setNewUser] = useState({ firstName: '', lastName: '', email: '', password: '', roles: [] });

    const roleOptions = [
        { value: 'ADMIN', label: 'Admin (Full System Access)' },
        { value: 'VIEWER', label: 'Viewer (Read-Only Access)' },
        { value: 'LEAD_CREATOR', label: 'Lead Creator (Discovery Creation Only)' },
        { value: 'SCHEDULER', label: 'Scheduler (Scheduler Activities Only)' },
        { value: 'DOCUMENTATION', label: 'Documentation (Documentation Updates Only)' },
        { value: 'TRAINING', label: 'Training (Training Updates Only)' }
    ];

    const toggleRole = (roleValue) => {
        setNewUser(prev => {
            const currentRoles = prev.roles || [];
            if (currentRoles.includes(roleValue)) {
                return { ...prev, roles: currentRoles.filter(r => r !== roleValue) };
            } else {
                return { ...prev, roles: [...currentRoles, roleValue] };
            }
        });
    };

    const handleAddUser = (e) => {
        e.preventDefault();
        if (newUser.firstName && newUser.lastName && newUser.email && newUser.password && newUser.roles.length > 0) {
            addUser(newUser);
            setNewUser({ firstName: '', lastName: '', email: '', password: '', roles: [] });
        } else if (newUser.roles.length === 0) {
            alert('Please select at least one role.');
        }
    };

    if (!hasPermission('MANAGE_USERS')) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
                <Shield size={64} style={{ color: 'var(--color-danger)', marginBottom: '1.5rem', opacity: 0.5 }} />
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Access Denied</h2>
                <p style={{ color: 'var(--color-text-muted)', marginTop: '1rem' }}>You do not have permission to manage users.</p>
            </div>
        );
    }

    return (
        <div>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <User size={32} style={{ color: 'var(--color-primary)' }} />
                    User Management
                </h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Define and manage application users and their access levels.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                {/* Add User Form */}
                <Card>
                    <h3 style={{ marginBottom: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={20} /> Define New User
                    </h3>
                    <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>FIRST NAME</label>
                                <input
                                    className="search-input"
                                    style={{ width: '100%' }}
                                    value={newUser.firstName}
                                    onChange={e => setNewUser({ ...newUser, firstName: e.target.value })}
                                    placeholder="e.g. Jane"
                                    required
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>LAST NAME</label>
                                <input
                                    className="search-input"
                                    style={{ width: '100%' }}
                                    value={newUser.lastName}
                                    onChange={e => setNewUser({ ...newUser, lastName: e.target.value })}
                                    placeholder="e.g. Doe"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>EMAIL ADDRESS</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                <input
                                    className="search-input"
                                    style={{ width: '100%', paddingLeft: '2.5rem' }}
                                    type="email"
                                    value={newUser.email}
                                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                    placeholder="jane.doe@pcg.com"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>PASSWORD</label>
                            <div style={{ position: 'relative' }}>
                                <Key size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                <input
                                    className="search-input"
                                    style={{ width: '100%', paddingLeft: '2.5rem' }}
                                    type="password"
                                    value={newUser.password}
                                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>ASSIGNED ROLES (SELECT ALL THAT APPLY)</label>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '0.75rem',
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '8px'
                            }}>
                                {roleOptions.map(option => (
                                    <label key={option.value} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        color: newUser.roles.includes(option.value) ? 'var(--color-text-main)' : 'var(--color-text-muted)',
                                        transition: 'color 0.2s'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={newUser.roles.includes(option.value)}
                                            onChange={() => toggleRole(option.value)}
                                            style={{ accentColor: 'var(--color-primary)' }}
                                        />
                                        {option.label.split(' (')[0]}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', height: '3rem', fontWeight: 'bold' }}>
                            Create User Account
                        </button>
                    </form>
                </Card>

                {/* Users List */}
                <Card>
                    <h3 style={{ marginBottom: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Active Users ({users.length})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {users.map(user => (
                            <div key={user.id} className="glass-panel" style={{
                                padding: '1rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                border: user.id === currentUser.id ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)',
                                background: user.id === currentUser.id ? 'rgba(var(--color-primary-rgb), 0.05)' : 'rgba(255,255,255,0.02)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: user.role === 'ADMIN' ? 'var(--color-success)' : 'var(--color-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold',
                                        fontSize: '1.1rem'
                                    }}>
                                        {user.firstName[0]}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {user.firstName} {user.lastName}
                                            {user.id === currentUser.id && <span className="badge badge-success" style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem' }}>ME</span>}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{user.email}</div>
                                        <div style={{ marginTop: '0.4rem', display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                            {(Array.isArray(user.roles) ? user.roles : [user.role]).map(role => (
                                                <span key={role} className={`badge ${role === 'ADMIN' ? 'badge-success' : role === 'VIEWER' ? 'badge-neutral' : 'badge-warning'}`} style={{ fontSize: '0.6rem' }}>
                                                    {role}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {user.id !== currentUser.id && (
                                    <button
                                        onClick={() => removeUser(user.id)}
                                        style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '0.5rem', transition: 'transform 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Users;
