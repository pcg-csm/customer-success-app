import React, { useState, useEffect } from 'react';
import { X, Save, Calendar } from 'lucide-react';

const EditActivityModal = ({ isOpen, onClose, activity, onSave }) => {
    const [content, setContent] = useState('');
    const [nextActionDate, setNextActionDate] = useState('');

    useEffect(() => {
        if (activity) {
            setContent(activity.content || activity.description || '');
            setNextActionDate(activity.nextActionDate || activity.next_action_date || '');
        }
    }, [activity]);

    if (!isOpen || !activity) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(activity.id, activity.type, content, nextActionDate);
        onClose();
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }}>
            <div className="glass-panel" style={{
                width: '90%',
                maxWidth: '500px',
                padding: '2rem',
                position: 'relative',
                background: '#ffffff', // Solid white background
                borderRadius: '16px',
                border: '1px solid var(--glass-border)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'none',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer'
                    }}
                >
                    <X size={20} />
                </button>

                <h2 style={{ marginBottom: '1.5rem', fontWeight: 'bold', color: '#0f172a' }}>Edit Activity</h2>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                            Activity Content
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            style={{
                                width: '100%',
                                minHeight: '150px',
                                padding: '1rem',
                                borderRadius: '8px',
                                background: '#f8fafc', // Light background
                                border: '1px solid #e2e8f0',
                                color: '#000000', // Black text
                                resize: 'vertical',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                            autoFocus
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                            Next Action Date
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Calendar size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                            <input
                                type="date"
                                value={nextActionDate}
                                onChange={(e) => setNextActionDate(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem 0.75rem 2.75rem',
                                    borderRadius: '8px',
                                    background: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    color: '#000000',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            className="glass-panel"
                            onClick={onClose}
                            style={{ padding: '0.75rem 1.5rem', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditActivityModal;
