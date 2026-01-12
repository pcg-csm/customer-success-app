import React, { useState } from 'react';
import Card from '../components/Card';
import { useData } from '../context/DataContext';
import { Plus, Trash2, Save, User, Box, Check, X, Edit2, UserCircle } from 'lucide-react';

const Settings = () => {
    const {
        products, addProduct, removeProduct,
        employees, addEmployee, removeEmployee, updateEmployee,
        users, addUser, removeUser, currentUser
    } = useData();
    const [activeTab, setActiveTab] = useState('data');

    // Local state for new entries
    const [newProduct, setNewProduct] = useState('');
    const [newEmployee, setNewEmployee] = useState({ firstName: '', lastName: '', role: 'Support', email: '', title: '' });
    const [editingId, setEditingId] = useState(null);
    const [editValues, setEditValues] = useState({});

    const handleAddProduct = () => {
        if (newProduct.trim()) {
            addProduct(newProduct.trim());
            setNewProduct('');
        }
    };

    const handleAddEmployee = () => {
        if (newEmployee.firstName && newEmployee.lastName && newEmployee.email && newEmployee.title) {
            addEmployee(newEmployee);
            setNewEmployee({ firstName: '', lastName: '', email: '', title: '', role: 'Support' });
        }
    };

    const handleStartEdit = (employee) => {
        setEditingId(employee.id);
        setEditValues({ ...employee });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditValues({});
    };

    const handleSaveEdit = async () => {
        const result = await updateEmployee(editValues);
        if (result && !result.error) {
            setEditingId(null);
            setEditValues({});
        }
    };

    return (
        <div>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Settings</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Configure your workspace and user management.</p>
            </header>

            <div className="tabs">
                <button className={`tab ${activeTab === 'data' ? 'active' : ''} `} onClick={() => setActiveTab('data')}>Data Management</button>
                <button className={`tab ${activeTab === 'integrations' ? 'active' : ''} `} onClick={() => setActiveTab('integrations')}>Integrations</button>
            </div>

            <div className="tab-content">
                {activeTab === 'data' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                        {/* Products Management */}
                        <Card>
                            <h3 style={{ marginBottom: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Box size={20} /> Managed Products
                            </h3>

                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <input
                                    type="text"
                                    placeholder="New Product Name"
                                    className="search-input"
                                    style={{ flex: 1 }}
                                    value={newProduct}
                                    onChange={(e) => setNewProduct(e.target.value)}
                                />
                                <button className="btn-primary" onClick={handleAddProduct} style={{ padding: '0.5rem' }}>
                                    <Plus size={20} />
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {products.map((product, idx) => (
                                    <div key={idx} className="glass-panel" style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>{product}</span>
                                        <button onClick={() => removeProduct(product)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Employee Management */}
                        <Card>
                            <h3 style={{ marginBottom: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <User size={20} /> Team Directory
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        className="search-input"
                                        style={{ flex: '1 1 150px' }}
                                        value={newEmployee.firstName}
                                        onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        className="search-input"
                                        style={{ flex: '1 1 150px' }}
                                        value={newEmployee.lastName}
                                        onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                    <select
                                        className="search-input"
                                        style={{ flex: '1 1 150px' }}
                                        value={newEmployee.role}
                                        onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                                    >
                                        <option value="Support">Support</option>
                                        <option value="Implementation">Implementation</option>
                                        <option value="Sales">Sales</option>
                                        <option value="Project Manager">Project Manager</option>
                                    </select>
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        className="search-input"
                                        style={{ flex: '1 1 200px' }}
                                        value={newEmployee.email}
                                        onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Title (e.g. Senior CS)"
                                        className="search-input"
                                        style={{ flex: '1 1 200px' }}
                                        value={newEmployee.title}
                                        onChange={(e) => setNewEmployee({ ...newEmployee, title: e.target.value })}
                                    />
                                    <button
                                        className="btn-primary"
                                        onClick={handleAddEmployee}
                                        style={{ flex: '1 1 100px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                    >
                                        <Plus size={18} /> Add
                                    </button>
                                </div>
                            </div>

                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                            <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Name</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Email</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Title</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Role</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employees.map(employee => (
                                            <tr key={employee.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                {editingId === employee.id ? (
                                                    <>
                                                        <td style={{ padding: '0.75rem' }}>
                                                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                                <input
                                                                    className="search-input"
                                                                    style={{ padding: '0.4rem', fontSize: '0.85rem' }}
                                                                    value={editValues.firstName}
                                                                    onChange={e => setEditValues({ ...editValues, firstName: e.target.value })}
                                                                />
                                                                <input
                                                                    className="search-input"
                                                                    style={{ padding: '0.4rem', fontSize: '0.85rem' }}
                                                                    value={editValues.lastName}
                                                                    onChange={e => setEditValues({ ...editValues, lastName: e.target.value })}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '0.75rem' }}>
                                                            <input
                                                                className="search-input"
                                                                style={{ padding: '0.4rem', fontSize: '0.85rem', width: '100%' }}
                                                                value={editValues.email || ''}
                                                                onChange={e => setEditValues({ ...editValues, email: e.target.value })}
                                                            />
                                                        </td>
                                                        <td style={{ padding: '0.75rem' }}>
                                                            <input
                                                                className="search-input"
                                                                style={{ padding: '0.4rem', fontSize: '0.85rem', width: '100%' }}
                                                                value={editValues.title || ''}
                                                                onChange={e => setEditValues({ ...editValues, title: e.target.value })}
                                                            />
                                                        </td>
                                                        <td style={{ padding: '0.75rem' }}>
                                                            <select
                                                                className="search-input"
                                                                style={{ padding: '0.4rem', fontSize: '0.85rem', width: '100%' }}
                                                                value={editValues.role}
                                                                onChange={e => setEditValues({ ...editValues, role: e.target.value })}
                                                            >
                                                                <option value="Support">Support</option>
                                                                <option value="Implementation">Implementation</option>
                                                                <option value="Sales">Sales</option>
                                                                <option value="Project Manager">Project Manager</option>
                                                            </select>
                                                        </td>
                                                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                                <button onClick={handleSaveEdit} className="btn-primary" style={{ padding: '0.4rem', borderRadius: '6px' }}>
                                                                    <Check size={16} />
                                                                </button>
                                                                <button onClick={handleCancelEdit} variant="ghost" className="btn-secondary" style={{ padding: '0.4rem', borderRadius: '6px' }}>
                                                                    <X size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td style={{ padding: '1rem', color: 'var(--color-text-main)', fontSize: '0.9rem' }}>{employee.firstName} {employee.lastName}</td>
                                                        <td style={{ padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{employee.email || '—'}</td>
                                                        <td style={{ padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{employee.title || '—'}</td>
                                                        <td style={{ padding: '1rem' }}>
                                                            <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{employee.role}</span>
                                                        </td>
                                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                                <button onClick={() => handleStartEdit(employee)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '0.25rem' }}>
                                                                    <Edit2 size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => removeEmployee(employee.id)}
                                                                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem', opacity: 0.6 }}
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                        <Card>
                            <h3 style={{ marginBottom: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <User size={20} /> Add New User
                            </h3>
                            <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>First Name</label>
                                        <input className="search-input" style={{ width: '100%' }} value={newUser.firstName} onChange={e => setNewUser({ ...newUser, firstName: e.target.value })} required />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Last Name</label>
                                        <input className="search-input" style={{ width: '100%' }} value={newUser.lastName} onChange={e => setNewUser({ ...newUser, lastName: e.target.value })} required />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Email Address</label>
                                    <input className="search-input" style={{ width: '100%' }} type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Password</label>
                                    <input className="search-input" style={{ width: '100%' }} type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Role</label>
                                    <select className="search-input" style={{ width: '100%' }} value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                                        <option value="ADMIN">Admin (Full Access)</option>
                                        <option value="VIEWER">Viewer (Read Only)</option>
                                        <option value="LEAD_CREATOR">Lead Creator (Create Leads Only)</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>Create User Account</button>
                            </form>
                        </Card>

                        <Card>
                            <h3 style={{ marginBottom: '1.5rem', fontWeight: 'bold' }}>Active Users ({users.length})</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {users.map(user => (
                                    <div key={user.id} className="glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: user.id === currentUser.id ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)' }}>
                                        <div>
                                            <div style={{ fontWeight: '600' }}>{user.firstName} {user.lastName} {user.id === currentUser.id && <span style={{ fontSize: '0.7rem', color: 'var(--color-primary)', marginLeft: '0.5rem' }}>(You)</span>}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{user.email}</div>
                                            <div style={{ marginTop: '0.25rem' }}>
                                                <span className={`badge ${user.role === 'ADMIN' ? 'badge-success' : user.role === 'VIEWER' ? 'badge-neutral' : 'badge-warning'} `} style={{ fontSize: '0.65rem' }}>
                                                    {user.role}
                                                </span>
                                            </div>
                                        </div>
                                        {user.id !== currentUser.id && (
                                            <button onClick={() => removeUser(user.id)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '0.5rem' }}>
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;
