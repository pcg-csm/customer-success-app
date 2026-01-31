import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Card from '../components/Card';
import { ArrowLeft, Save, MessageSquare } from 'lucide-react';

const CreateActivity = () => {
    const { customers, leads, products, addActivity, isLoading } = useData();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        type: 'customer',
        entityId: '',
        date: new Date().toISOString().split('T')[0],
        details: '',
        nextActionDate: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error } = await addActivity(formData);
        if (!error) {
            navigate('/activity');
        } else {
            alert('Error saving activity: ' + (error.message || error));
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <button
                onClick={() => navigate('/activity')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', background: 'none', border: 'none', marginBottom: '1rem', cursor: 'pointer' }}
            >
                <ArrowLeft size={18} />
                Back to Activity Feed
            </button>

            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <MessageSquare size={32} style={{ color: 'var(--color-primary)' }} />
                    Log New Activity
                </h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Record interactions, updates, and next steps.</p>
            </header>

            <form onSubmit={handleSubmit}>
                <Card>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Activity Type</label>
                            <select
                                className="search-input w-full"
                                value={formData.type}
                                onChange={e => handleChange('type', e.target.value)}
                                required
                            >
                                <option value="customer">Customer</option>
                                <option value="presales">Presales</option>
                                <option value="documentation">Documentation</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                {formData.type === 'customer' ? 'Select Customer' :
                                    formData.type === 'presales' ? 'Select Lead' : 'Select Product'}
                            </label>
                            <select
                                className="search-input w-full"
                                value={formData.entityId}
                                onChange={e => handleChange('entityId', e.target.value)}
                                required
                            >
                                <option value="">-- Select --</option>
                                {formData.type === 'customer' && customers.map(c => (
                                    <option key={c.id} value={c.id}>{c.company}</option>
                                ))}
                                {formData.type === 'presales' && leads.map(l => (
                                    <option key={l.id} value={l.id}>{l.companyName}</option>
                                ))}
                                {formData.type === 'documentation' && [
                                    'SmartFactory for NetSuite',
                                    'SmartFactory for Infor',
                                    'SmartFactory for CSI',
                                    'Scheduler'
                                ].map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Date Entered</label>
                            <input
                                type="date"
                                className="search-input w-full"
                                value={formData.date}
                                onChange={e => handleChange('date', e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Next Action Date</label>
                            <input
                                type="date"
                                className="search-input w-full"
                                value={formData.nextActionDate}
                                onChange={e => handleChange('nextActionDate', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Activity Details</label>
                        <textarea
                            className="glass-panel w-full"
                            rows="8"
                            placeholder="Describe the interaction or update..."
                            value={formData.details}
                            onChange={e => handleChange('details', e.target.value)}
                            required
                            style={{ background: 'rgba(255,255,255,0.05)', color: 'black', padding: '1rem', border: '1px solid var(--glass-border)', borderRadius: '8px', width: '100%', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button
                            type="button"
                            className="glass-panel"
                            onClick={() => navigate('/activity')}
                            style={{ padding: '0.75rem 1.5rem', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isLoading}
                            style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Save size={18} />
                            Log Activity
                        </button>
                    </div>
                </Card>
            </form>

            <style>{`
                .w-full { width: 100%; }
                .form-group label { color: var(--color-text-main); }
            `}</style>
        </div>
    );
};

export default CreateActivity;
