import React, { useState } from 'react';
import Card from '../components/Card';
import { useData } from '../context/DataContext';
import { Plus, Trash2, Save, User, Box, Check, X, Edit2, UserCircle, ShieldCheck, Eye, EyeOff, Key } from 'lucide-react';

const Settings = () => {
    const {
        products, addProduct, removeProduct,
        employees, addEmployee, removeEmployee, updateEmployee,
        users, addUser, removeUser, currentUser, changePassword
    } = useData();
    const [activeTab, setActiveTab] = useState('data');

    // Local state for new entries
    const [newProduct, setNewProduct] = useState('');
    const [newEmployee, setNewEmployee] = useState({ firstName: '', lastName: '', role: 'Support', email: '', title: '' });
    const [editingId, setEditingId] = useState(null);
    const [editValues, setEditValues] = useState({});

    // Password state
    const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });
    const [showPasswords, setShowPasswords] = useState(false);
    const [passwordStatus, setPasswordStatus] = useState({ loading: false, message: '', type: '' });

    const handleAddProduct = () => {
        if (newProduct.trim()) {
            addProduct(newProduct.trim());
            setNewProduct('');
        }
    };

    const handleAddEmployee = () => {
        if (newEmployee.firstName && newEmployee.lastName) {
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

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordStatus({ loading: false, message: 'Passwords do not match.', type: 'error' });
            return;
        }
        if (passwordData.newPassword.length < 6) {
            setPasswordStatus({ loading: false, message: 'Password must be at least 6 characters.', type: 'error' });
            return;
        }

        setPasswordStatus({ loading: true, message: '', type: '' });
        const result = await changePassword(passwordData.newPassword);

        if (result.success) {
            setPasswordStatus({ loading: false, message: 'Password updated successfully!', type: 'success' });
            setPasswordData({ newPassword: '', confirmPassword: '' });
        } else {
            setPasswordStatus({ loading: false, message: result.error, type: 'error' });
        }
    };

    return (
        <div>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Settings</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Configure your workspace and user management.</p>
            </header>

            <div className="tabs">
                <button className={`tab ${activeTab === 'data' ? 'active' : ''}`} onClick={() => setActiveTab('data')}>Data Management</button>
                <button className={`tab ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>Account Security</button>
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
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddProduct()}
                                />
                                <button className="btn-primary" onClick={handleAddProduct} style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Plus size={20} /> <span>Save Product</span>
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
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddEmployee()}
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

                {activeTab === 'security' && (
                    <div style={{ maxWidth: '600px' }}>
                        <Card>
                            <h3 style={{ marginBottom: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <ShieldCheck size={20} /> Update Password
                            </h3>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                                Ensure your account is using a long, random password to stay secure.
                            </p>

                            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>NEW PASSWORD</label>
                                    <div style={{ position: 'relative' }}>
                                        <Key size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                        <input
                                            className="search-input"
                                            style={{ width: '100%', paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                                            type={showPasswords ? "text" : "password"}
                                            value={passwordData.newPassword}
                                            onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>CONFIRM NEW PASSWORD</label>
                                    <div style={{ position: 'relative' }}>
                                        <Key size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                        <input
                                            className="search-input"
                                            style={{ width: '100%', paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                                            type={showPasswords ? "text" : "password"}
                                            value={passwordData.confirmPassword}
                                            onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords(!showPasswords)}
                                            style={{
                                                position: 'absolute',
                                                right: '10px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--color-text-muted)',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '4px'
                                            }}
                                        >
                                            {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                {passwordStatus.message && (
                                    <div style={{
                                        padding: '0.75rem',
                                        borderRadius: '6px',
                                        fontSize: '0.85rem',
                                        background: passwordStatus.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: passwordStatus.type === 'success' ? '#4ade80' : '#f87171',
                                        border: passwordStatus.type === 'success' ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)'
                                    }}>
                                        {passwordStatus.message}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={passwordStatus.loading}
                                    style={{ marginTop: '0.5rem', height: '3rem', fontWeight: 'bold' }}
                                >
                                    {passwordStatus.loading ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        </Card>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Settings;
