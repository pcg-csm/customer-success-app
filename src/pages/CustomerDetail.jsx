import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Card from '../components/Card';
import { ArrowLeft, Building, Calendar, CheckCircle, XCircle, Shield, Server, Monitor, Upload, Users, MessageSquare, Send, Plus, Trash2, Clock, FileText, Paperclip, Download, Eye, Smile, Save } from 'lucide-react';

const SatisfactionGauge = ({ score }) => {
    // Basic gauge calculation
    const percentage = (score / 10) * 100;
    const strokeDasharray = 157; // Half circle circumference (approx)
    const strokeDashoffset = strokeDasharray - (strokeDasharray * (percentage / 100));

    const getColor = (s) => {
        if (s <= 4) return '#ef4444'; // Red
        if (s <= 7) return '#f59e0b'; // Amber
        return '#10b981'; // Green
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ position: 'relative', width: '120px', height: '70px', overflow: 'hidden' }}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                    {/* Background track */}
                    <path
                        d="M 10 60 A 50 50 0 0 1 110 60"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="12"
                        strokeLinecap="round"
                    />
                    {/* Progress track */}
                    <path
                        d="M 10 60 A 50 50 0 0 1 110 60"
                        fill="none"
                        stroke={getColor(score)}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={strokeDasharray}
                        style={{
                            strokeDashoffset: strokeDashoffset,
                            transition: 'stroke-dashoffset 1s ease-in-out, stroke 0.5s ease'
                        }}
                    />
                </svg>
                <div style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{score}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Score / 10</div>
                </div>
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: '500', color: getColor(score) }}>
                {score <= 4 ? 'At Risk' : score <= 7 ? 'Stable' : 'Exceptional'}
            </div>
        </div>
    );
};

const CustomerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { customers, updateCustomer, hasPermission, products, employees } = useData();
    const customer = customers.find(c => String(c.id) === String(id));
    const [activeTab, setActiveTab] = useState('overview');
    const [activities, setActivities] = useState(customer?.activityLog || []);
    const [newActivity, setNewActivity] = useState('');
    const [reminderDate, setReminderDate] = useState('');

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    // Initialize formData when customer loads or edit mode starts
    React.useEffect(() => {
        if (customer) {
            setFormData(customer);
            setActivities(customer.activityLog || []);
        }
    }, [customer]);

    const handleSave = () => {
        updateCustomer(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData(customer);
        setIsEditing(false);
    };

    const handleAddActivity = () => {
        if (!newActivity.trim()) return;
        const activity = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            content: newActivity,
            reminder: reminderDate || null
        };
        const updatedActivities = [activity, ...activities];
        setActivities(updatedActivities);
        updateCustomer({ ...customer, activityLog: updatedActivities });
        setNewActivity('');
        setReminderDate('');
    };

    if (!customer) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
                <h2>Customer not found</h2>
                <button onClick={() => navigate('/customers')} className="btn-primary" style={{ marginTop: '1rem' }}>
                    Back to List
                </button>
            </div>
        );
    }

    // Helpers
    const getEmployee = (id) => employees.find(e => e.id === id);
    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString();
    };

    const calculateRenewal = (signedDate, termsInMonths) => {
        if (!signedDate || !termsInMonths) return 'N/A';
        const d = new Date(signedDate);
        if (isNaN(d.getTime())) return 'N/A';
        d.setMonth(d.getMonth() + termsInMonths);
        return d.toLocaleDateString();
    };

    const renewalDate = calculateRenewal(
        isEditing ? formData.signedDate : customer.signedDate,
        isEditing ? formData.terms : customer.terms
    );

    return (
        <div>
            <button
                onClick={() => navigate('/customers')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', background: 'none', border: 'none', marginBottom: '1rem' }}
            >
                <ArrowLeft size={18} />
                Back to Customers
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
                <div>
                    {isEditing ? (
                        <>
                            <input
                                className="search-input"
                                style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', width: '100%' }}
                                value={formData.company || ''}
                                onChange={e => setFormData({ ...formData, company: e.target.value })}
                            />
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                                <input
                                    className="search-input"
                                    placeholder="POC Name"
                                    value={formData.name || ''}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <input
                                    className="search-input"
                                    placeholder="Email"
                                    value={formData.email || ''}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                                <input
                                    className="search-input"
                                    placeholder="Phone"
                                    value={formData.phone || ''}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{customer.company}</h1>
                            <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--color-text-muted)' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Building size={16} /> {customer.name} (POC)</span>
                            </div>
                            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                {customer.email} • {customer.phone}
                            </div>
                        </>
                    )}
                </div>
                <div style={{ textAlign: 'right' }}>
                    {isEditing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                                <button
                                    className="btn-primary"
                                    onClick={handleSave}
                                    style={{
                                        background: 'var(--color-success)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.6rem 1.25rem'
                                    }}
                                >
                                    <Save size={18} />
                                    Save Changes
                                </button>
                                <button
                                    className="glass-panel"
                                    onClick={handleCancel}
                                    style={{
                                        padding: '0.6rem 1.25rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        background: 'rgba(255,255,255,0.05)'
                                    }}
                                >
                                    <XCircle size={18} />
                                    Cancel
                                </button>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <select
                                        className="search-input"
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        style={{ padding: '0.25rem 0.5rem' }}
                                    >
                                        <option value="Live">Live</option>
                                        <option value="Onboarding">Onboarding</option>
                                        <option value="Risk">Risk</option>
                                        <option value="Warning">Warning</option>
                                        <option value="Churned">Churned</option>
                                    </select>
                                    <select
                                        className="search-input"
                                        value={formData.active ? 'true' : 'false'}
                                        onChange={e => setFormData({ ...formData, active: e.target.value === 'true' })}
                                        style={{ padding: '0.25rem 0.5rem' }}
                                    >
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Satisf:</div>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        className="search-input"
                                        value={formData.satisfaction || 7}
                                        onChange={e => setFormData({ ...formData, satisfaction: parseInt(e.target.value) })}
                                        style={{ width: '60px', textAlign: 'center' }}
                                    />
                                    <input
                                        className="search-input"
                                        value={formData.arr}
                                        onChange={e => setFormData({ ...formData, arr: e.target.value })}
                                        style={{ textAlign: 'right', width: '120px' }}
                                        placeholder="$ARR"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                                {hasPermission('MANAGE_CUSTOMERS') && (
                                    <button className="glass-panel" onClick={() => setIsEditing(true)} style={{ padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.875rem' }}>Edit Customer</button>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                                <div className={`badge ${customer.status === 'Live' ? 'badge-success' : 'badge-warning'}`}>
                                    {customer.status}
                                </div>
                                <div className={`badge ${customer.active ? 'badge-success' : 'badge-neutral'}`}>
                                    {customer.active ? 'Active' : 'Inactive'}
                                </div>
                            </div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{customer.arr} <span style={{ fontSize: '0.875rem', fontWeight: 'normal', color: 'var(--color-text-muted)' }}>ARR</span></div>
                        </>
                    )}
                </div>
            </div>

            <div className="tabs">
                {['overview', 'systems', 'team', 'activity', 'personalizations', 'documents'].map((tab) => (
                    <button
                        key={tab}
                        className={`tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            <div className="tab-content">
                {activeTab === 'overview' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <Card>
                            <h3 style={{ marginBottom: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Shield size={20} /> Contract Details
                            </h3>
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <td style={{ padding: '0.75rem 0', color: 'var(--color-text-muted)', borderBottom: '1px solid var(--glass-border)' }}>Signed Date</td>
                                        <td style={{ padding: '0.75rem 0', textAlign: 'right', fontWeight: '500', borderBottom: '1px solid var(--glass-border)' }}>
                                            {isEditing ? (
                                                <input type="date" className="search-input" value={formData.signedDate} onChange={e => setFormData({ ...formData, signedDate: e.target.value })} />
                                            ) : formatDate(customer.signedDate)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.75rem 0', color: 'var(--color-text-muted)', borderBottom: '1px solid var(--glass-border)' }}>Terms</td>
                                        <td style={{ padding: '0.75rem 0', textAlign: 'right', fontWeight: '500', borderBottom: '1px solid var(--glass-border)' }}>
                                            {isEditing ? (
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                    <input type="number" className="search-input" style={{ width: '60px', textAlign: 'right' }} value={formData.terms} onChange={e => setFormData({ ...formData, terms: parseInt(e.target.value) })} />
                                                    <span>Months</span>
                                                </div>
                                            ) : `${customer.terms} Months`}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.75rem 0', color: 'var(--color-text-muted)', borderBottom: 'none' }}>Renewal Date</td>
                                        <td style={{ padding: '0.75rem 0', textAlign: 'right', fontWeight: 'bold', color: 'var(--color-primary)', borderBottom: 'none' }}>{renewalDate}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </Card>

                        <Card>
                            <h3 style={{ marginBottom: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Smile size={20} /> Satisfaction Score
                            </h3>
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0' }}>
                                <SatisfactionGauge score={(isEditing ? formData.satisfaction : customer.satisfaction) || 7} />
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '1rem' }}>
                                Health score based on recent activity logs.
                            </p>
                        </Card>

                        <Card>
                            <h3 style={{ marginBottom: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <CheckCircle size={20} /> Licensed Products
                            </h3>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                {isEditing ? (
                                    products.map(prod => (
                                        <label key={prod} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '4px' }}>
                                            <input
                                                type="checkbox"
                                                checked={formData.licensedProducts?.includes(prod)}
                                                onChange={(e) => {
                                                    const newProducts = e.target.checked
                                                        ? [...(formData.licensedProducts || []), prod]
                                                        : formData.licensedProducts.filter(p => p !== prod);
                                                    setFormData({ ...formData, licensedProducts: newProducts });
                                                }}
                                            />
                                            {prod}
                                        </label>
                                    ))
                                ) : (
                                    customer.licensedProducts?.map(prod => (
                                        <span key={prod} className="badge badge-neutral" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                                            {prod}
                                        </span>
                                    )) || null
                                )}
                            </div>
                        </Card>

                        <Card style={{ gridColumn: 'span 2' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Users size={20} /> Customer Team
                                </h3>
                                {isEditing && (
                                    <button
                                        className="btn-primary"
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                        onClick={() => {
                                            const newMember = { firstName: '', lastName: '', email: '', role: '' };
                                            setFormData({ ...formData, customerTeam: [...(formData.customerTeam || []), newMember] });
                                        }}
                                    >
                                        <Plus size={14} /> Add Member
                                    </button>
                                )}
                            </div>

                            {(isEditing ? (formData.customerTeam || []) : (customer.customerTeam || [])) ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                                    {(isEditing ? (formData.customerTeam || []) : (customer.customerTeam || [])).map((contact, idx) => (
                                        <div key={idx} className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.03)', position: 'relative' }}>
                                            {isEditing ? (
                                                <div style={{ width: '100%' }}>
                                                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                        <input
                                                            className="search-input"
                                                            placeholder="First Name"
                                                            value={contact.firstName}
                                                            style={{ flex: 1 }}
                                                            onChange={(e) => {
                                                                const updatedTeam = [...formData.customerTeam];
                                                                updatedTeam[idx] = { ...contact, firstName: e.target.value };
                                                                setFormData({ ...formData, customerTeam: updatedTeam });
                                                            }}
                                                        />
                                                        <input
                                                            className="search-input"
                                                            placeholder="Last Name"
                                                            value={contact.lastName}
                                                            style={{ flex: 1 }}
                                                            onChange={(e) => {
                                                                const updatedTeam = [...formData.customerTeam];
                                                                updatedTeam[idx] = { ...contact, lastName: e.target.value };
                                                                setFormData({ ...formData, customerTeam: updatedTeam });
                                                            }}
                                                        />
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <input
                                                            className="search-input"
                                                            placeholder="Role"
                                                            value={contact.role}
                                                            style={{ flex: 1 }}
                                                            onChange={(e) => {
                                                                const updatedTeam = [...formData.customerTeam];
                                                                updatedTeam[idx] = { ...contact, role: e.target.value };
                                                                setFormData({ ...formData, customerTeam: updatedTeam });
                                                            }}
                                                        />
                                                        <input
                                                            className="search-input"
                                                            placeholder="Email"
                                                            value={contact.email}
                                                            style={{ flex: 1 }}
                                                            onChange={(e) => {
                                                                const updatedTeam = [...formData.customerTeam];
                                                                updatedTeam[idx] = { ...contact, email: e.target.value };
                                                                setFormData({ ...formData, customerTeam: updatedTeam });
                                                            }}
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            const updatedTeam = formData.customerTeam.filter((_, i) => i !== idx);
                                                            setFormData({ ...formData, customerTeam: updatedTeam });
                                                        }}
                                                        style={{ position: 'absolute', top: '5px', right: '5px', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
                                                        {contact.firstName && contact.firstName[0]}{contact.lastName && contact.lastName[0]}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '500' }}>{contact.firstName} {contact.lastName}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{contact.role}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>{contact.email}</div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: 'var(--color-text-muted)' }}>No team members listed.</p>
                            )}
                        </Card>
                    </div>
                )}

                {activeTab === 'systems' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <Card>
                            <h3 style={{ marginBottom: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Server size={20} /> NetSuite Configuration
                            </h3>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Sandbox</h4>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ color: 'var(--color-text-muted)' }}>Version</span>
                                    {isEditing ? (
                                        <input className="search-input" value={formData.netsuite?.sandboxVersion || ''} onChange={e => setFormData({ ...formData, netsuite: { ...formData.netsuite, sandboxVersion: e.target.value } })} />
                                    ) : <span>{customer.netsuite?.sandboxVersion || 'N/A'}</span>}
                                </div>
                                {isEditing ? (
                                    <input className="search-input" style={{ width: '100%' }} placeholder="Sandbox URL" value={formData.netsuite?.sandboxUrl || ''} onChange={e => setFormData({ ...formData, netsuite: { ...formData.netsuite, sandboxUrl: e.target.value } })} />
                                ) : (
                                    <a href={customer.netsuite.sandboxUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', fontSize: '0.875rem' }}>Open Sandbox</a>
                                )}
                            </div>
                            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                                <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Production</h4>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ color: 'var(--color-text-muted)' }}>Version</span>
                                    {isEditing ? (
                                        <input className="search-input" value={formData.netsuite?.productionVersion || ''} onChange={e => setFormData({ ...formData, netsuite: { ...formData.netsuite, productionVersion: e.target.value } })} />
                                    ) : <span>{customer.netsuite?.productionVersion || 'N/A'}</span>}
                                </div>
                                {isEditing ? (
                                    <input className="search-input" style={{ width: '100%' }} placeholder="Production URL" value={formData.netsuite?.productionUrl || ''} onChange={e => setFormData({ ...formData, netsuite: { ...formData.netsuite, productionUrl: e.target.value } })} />
                                ) : (
                                    <a href={customer.netsuite.productionUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', fontSize: '0.875rem' }}>Open Production</a>
                                )}
                            </div>
                        </Card>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <Card>
                                <h3 style={{ marginBottom: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Monitor size={20} /> Tulip Configuration
                                </h3>
                                <table className="w-full">
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: '0.75rem 0', color: 'var(--color-text-muted)', borderBottom: '1px solid var(--glass-border)' }}>App Version</td>
                                            <td style={{ padding: '0.75rem 0', textAlign: 'right', fontWeight: '500', borderBottom: '1px solid var(--glass-border)' }}>
                                                {isEditing ? (
                                                    <input className="search-input" value={formData.tulip?.appVersion || ''} onChange={e => setFormData({ ...formData, tulip: { ...formData.tulip, appVersion: e.target.value } })} />
                                                ) : customer.tulip?.appVersion || 'N/A'}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.75rem 0', color: 'var(--color-text-muted)', borderBottom: '1px solid var(--glass-border)' }}>Workstations</td>
                                            <td style={{ padding: '0.75rem 0', textAlign: 'right', fontWeight: '500', borderBottom: '1px solid var(--glass-border)' }}>
                                                {isEditing ? (
                                                    <input type="number" className="search-input" style={{ width: '80px' }} value={formData.tulip?.workstations || 0} onChange={e => setFormData({ ...formData, tulip: { ...formData.tulip, workstations: parseInt(e.target.value) } })} />
                                                ) : customer.tulip.workstations}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.75rem 0', color: 'var(--color-text-muted)', borderBottom: 'none' }}>Account URL</td>
                                            <td style={{ padding: '0.75rem 0', textAlign: 'right', borderBottom: 'none' }}>
                                                {isEditing ? (
                                                    <input className="search-input" style={{ width: '100%' }} value={formData.tulip?.accountUrl || ''} onChange={e => setFormData({ ...formData, tulip: { ...formData.tulip, accountUrl: e.target.value } })} />
                                                ) : (
                                                    <a href={customer.tulip.accountUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)' }}>Launch Tulip</a>
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Card>

                            <Card>
                                <h3 style={{ marginBottom: '1rem', fontWeight: 'bold', fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Key and Secrets</h3>
                                <label
                                    className="glass-panel"
                                    style={{
                                        border: '1px dashed var(--color-border)',
                                        cursor: isEditing ? 'pointer' : 'default',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '2rem',
                                        transition: 'background 0.2s',
                                        width: '100%'
                                    }}
                                >
                                    <Upload size={32} style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }} />
                                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{isEditing ? 'Upload File' : 'No secrets uploaded'}</span>
                                    {isEditing && (
                                        <input
                                            type="file"
                                            style={{ display: 'none' }}
                                            onClick={(e) => { e.target.value = null; }}
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const newSecret = { name: file.name, size: (file.size / 1024).toFixed(0) + ' KB', date: new Date().toLocaleDateString() };
                                                    setFormData({ ...formData, attachments: [...(formData.attachments || []), { ...newSecret, isSecret: true }] });
                                                }
                                            }}
                                        />
                                    )}
                                </label>
                                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {(formData.attachments || customer.attachments || []).filter(a => a.isSecret).map((secret, idx) => (
                                        <div key={idx} className="glass-panel" style={{ padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.03)' }}>
                                            <Shield size={14} style={{ color: 'var(--color-primary)' }} />
                                            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{secret.name}</span>
                                            {isEditing && (
                                                <button
                                                    onClick={() => {
                                                        const newAttachments = formData.attachments.filter(a => a !== secret);
                                                        setFormData({ ...formData, attachments: newAttachments });
                                                    }}
                                                    style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                                                >
                                                    <X size={14} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'team' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {[
                            { title: 'Support POC', idField: 'pcgSupportPocId', role: 'Support' },
                            { title: 'Implementation Lead', idField: 'pcgImplementationLeadId', role: 'Implementation' },
                            { title: 'Sales POC', idField: 'pcgSalesPocId', role: 'Sales' },
                            { title: 'Project POC', idField: 'pcgProjectPocId', role: 'Project Manager' },
                        ].map((section) => {
                            const currentId = formData[section.idField];
                            const emp = getEmployee(currentId);

                            return (
                                <Card key={section.title}>
                                    <h4 style={{ marginBottom: '1rem', fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>{section.title}</h4>
                                    {isEditing ? (
                                        <select
                                            className="search-input"
                                            style={{ width: '100%' }}
                                            value={currentId || ''}
                                            onChange={(e) => {
                                                const val = e.target.value === '' ? null : parseInt(e.target.value);
                                                setFormData({ ...formData, [section.idField]: val });
                                            }}
                                        >
                                            <option value="">Select Employee</option>
                                            {employees.map(e => (
                                                <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.role})</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                {emp ? emp.firstName[0] + emp.lastName[0] : '?'}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '500' }}>{emp ? `${emp.firstName} ${emp.lastName}` : 'Unassigned'}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{emp ? emp.role : 'N/A'}</div>
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                )}
                {activeTab === 'activity' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <Card>
                                <h3 style={{ marginBottom: '1rem', fontWeight: 'bold' }}>New Activity</h3>
                                <textarea
                                    className="glass-panel"
                                    rows="4"
                                    placeholder="Log a call, email, or meeting note..."
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-main)', padding: '1rem', border: '1px solid var(--glass-border)', borderRadius: '8px', resize: 'vertical', marginBottom: '1rem' }}
                                    value={newActivity}
                                    onChange={(e) => setNewActivity(e.target.value)}
                                ></textarea>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                        <Clock size={16} />
                                        <span>Set Reminder:</span>
                                        <input
                                            type="date"
                                            className="search-input"
                                            style={{ padding: '0.25rem 0.5rem' }}
                                            value={reminderDate}
                                            onChange={(e) => setReminderDate(e.target.value)}
                                        />
                                    </div>
                                    <button className="btn-primary" onClick={handleAddActivity} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Send size={16} /> Log Activity
                                    </button>
                                </div>
                            </Card>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {activities.map((log) => (
                                    <Card key={log.id} style={{ padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                            <Calendar size={14} /> {new Date(log.timestamp).toLocaleString()}
                                            {log.reminder && (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-warning)', marginLeft: '1rem', background: 'rgba(255,165,0,0.1)', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>
                                                    <Clock size={12} /> Reminder: {new Date(log.reminder).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                        <p style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{log.content}</p>
                                    </Card>
                                ))}
                                {activities.length === 0 && (
                                    <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>No activity logged yet.</div>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <Card>
                                <h3 style={{ marginBottom: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <MessageSquare size={20} /> Quick Stats
                                </h3>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{activities.length}</div>
                                <p style={{ color: 'var(--color-text-muted)' }}>Total Interaction Logs</p>
                            </Card>
                        </div>
                    </div>
                )}
                {activeTab === 'personalizations' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                        <Card>
                            <h3 style={{ marginBottom: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FileText size={20} /> Personalization Details
                            </h3>
                            {isEditing ? (
                                <textarea
                                    className="glass-panel"
                                    rows="15"
                                    placeholder="Describe any custom personalizations, overrides, or special handling instructions for this customer..."
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-main)', padding: '1rem', border: '1px solid var(--glass-border)', borderRadius: '8px', resize: 'vertical', lineHeight: '1.6' }}
                                    value={formData.personalizations || ''}
                                    onChange={(e) => setFormData({ ...formData, personalizations: e.target.value })}
                                ></textarea>
                            ) : (
                                <div className="glass-panel" style={{ padding: '1.5rem', minHeight: '300px', lineHeight: '1.6', whiteSpace: 'pre-wrap', color: formData.personalizations ? 'inherit' : 'var(--color-text-muted)' }}>
                                    {formData.personalizations || 'No personalization details recorded.'}
                                </div>
                            )}
                        </Card>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <Card>
                                <h3 style={{ marginBottom: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Paperclip size={20} /> Attachments
                                </h3>

                                {isEditing && (
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', width: '100%' }}>
                                            <Upload size={16} /> Upload Document
                                            <input
                                                type="file"
                                                style={{ display: 'none' }}
                                                onClick={(e) => { e.target.value = null; }}
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const newDoc = { name: file.name, size: (file.size / 1024).toFixed(0) + ' KB', date: new Date().toLocaleDateString() };
                                                        setFormData({ ...formData, attachments: [...(formData.attachments || []), newDoc] });
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                )}

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {(formData.attachments || customer.attachments || []).length > 0 ? (
                                        (isEditing ? formData.attachments : (customer.attachments || [])).map((doc, idx) => (
                                            <div key={idx} className="glass-panel" style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                                                    <FileText size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                                                    <div style={{ overflow: 'hidden' }}>
                                                        <div style={{ fontSize: '0.875rem', fontWeight: '500', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{doc.name}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{doc.size} • {doc.date}</div>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    {isEditing ? (
                                                        <button
                                                            onClick={() => {
                                                                const newAttachments = formData.attachments.filter((_, i) => i !== idx);
                                                                setFormData({ ...formData, attachments: newAttachments });
                                                            }}
                                                            style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                                                        >
                                                            <XCircle size={16} />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => alert(`Simulating download for: ${doc.name}\n\n(In a real app, this would trigger a file download)`)}
                                                            style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer' }}
                                                            title="Download"
                                                        >
                                                            <Download size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                            No documents attached.
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                )}
                {activeTab === 'documents' && (
                    <Card>
                        <h3 style={{ marginBottom: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileText size={20} /> Contract Documents
                        </h3>

                        {isEditing && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label
                                    className={`btn-primary ${((formData.documents || []).length >= 3) ? 'disabled' : ''}`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        cursor: ((formData.documents || []).length >= 3) ? 'not-allowed' : 'pointer',
                                        width: '100%',
                                        opacity: ((formData.documents || []).length >= 3) ? 0.5 : 1
                                    }}
                                >
                                    <Upload size={16} />
                                    {((formData.documents || []).length >= 3) ? 'Upload Limit Reached (3)' : 'Upload Contract'}
                                    <input
                                        type="file"
                                        style={{ display: 'none' }}
                                        disabled={(formData.documents || []).length >= 3}
                                        onClick={(e) => { e.target.value = null; }}
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const newDoc = { name: file.name, size: (file.size / 1024).toFixed(0) + ' KB', date: new Date().toLocaleDateString() };
                                                setFormData({ ...formData, documents: [...(formData.documents || []), newDoc] });
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {(formData.documents || customer.documents || []).length > 0 ? (
                                (isEditing ? (formData.documents || []) : (customer.documents || [])).map((doc, idx) => (
                                    <div key={idx} className="glass-panel" style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                                            <FileText size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                                            <div style={{ overflow: 'hidden' }}>
                                                <div style={{ fontSize: '0.875rem', fontWeight: '500', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{doc.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{doc.size} • {doc.date}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {isEditing ? (
                                                <button
                                                    onClick={() => {
                                                        const newDocs = formData.documents.filter((_, i) => i !== idx);
                                                        setFormData({ ...formData, documents: newDocs });
                                                    }}
                                                    style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => alert(`Simulating VIEW for: ${doc.name}\n\n(In a real app, this would open a preview)`)}
                                                        style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                                                        title="View"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => alert(`Simulating download for: ${doc.name}\n\n(In a real app, this would trigger a file download)`)}
                                                        style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer' }}
                                                        title="Download"
                                                    >
                                                        <Download size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                    No contract documents uploaded.
                                </div>
                            )}
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default CustomerDetail;
