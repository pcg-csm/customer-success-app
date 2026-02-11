import React, { useState } from 'react';
import Card from '../components/Card';
import { useData } from '../context/DataContext';
import { GraduationCap, Mail, UserCircle, Check, Edit2, Eye, MessageSquare, Calendar, Trash2 } from 'lucide-react';
import EditActivityModal from '../components/EditActivityModal';

const Training = () => {
    const { employees, trainingActivities, updateEmployee, deleteActivity, updateActivityContent, isLoading } = useData();
    const [isEditing, setIsEditing] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [error, setError] = useState(null);
    const [filterCertified, setFilterCertified] = useState(false);

    const [selectedActivity, setSelectedActivity] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const certifications = [
        { key: 'certTulipCertified', label: 'Tulip Certified' },
        { key: 'certBasicAppBuilder', label: 'Basic App Builder' },
        { key: 'certAdvancedAppBuilder', label: 'Advanced App Builder' },
        { key: 'certSolutionLead', label: 'Solution Lead' },
        { key: 'certAdoptionManager', label: 'Adoption Manager' },
        { key: 'certSales', label: 'Sales' },
        { key: 'certGxP', label: 'GxP' },
        { key: 'certAiOps', label: 'AI for Operations' }
    ];

    const filteredEmployees = filterCertified
        ? employees.filter(e => e.certTulipCertified)
        : employees;

    const handleToggleCert = async (employee, certKey) => {
        setUpdatingId(`${employee.id}-${certKey}`);
        setError(null);

        const updatedEmployee = {
            ...employee,
            [certKey]: !employee[certKey]
        };

        const result = await updateEmployee(updatedEmployee);

        if (result && result.error) {
            console.error('Update failed:', result.error);
            setError(`Update failed: ${result.error.message || 'Unknown error'}. Please ensure the latest SQL migration has been applied.`);
        }

        setUpdatingId(null);
    };

    const handleDeleteActivity = async (id) => {
        if (window.confirm('Are you sure you want to delete this activity?')) {
            const { error } = await deleteActivity(id, 'training');
            if (error) alert('Error: ' + error.message);
        }
    };

    const handleEditActivity = (activity) => {
        setSelectedActivity({ ...activity, type: 'training' });
        setIsEditModalOpen(true);
    };

    const handleSaveActivityEdit = async (id, type, content) => {
        const { error } = await updateActivityContent(id, type, content);
        if (error) alert('Error: ' + error.message);
    };

    if (isLoading) {
        return <div className="p-8 text-center text-muted">Loading Training Data...</div>;
    }

    return (
        <div className="page-container" style={{ padding: '2rem' }}>
            {error && (
                <div style={{
                    padding: '1rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    borderRadius: '8px',
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.9rem'
                }}>
                    <span style={{ fontWeight: 'bold' }}>!</span> {error}
                </div>
            )}

            <header style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="glass-panel" style={{ padding: '0.75rem', borderRadius: '12px', background: 'var(--color-primary-transparent)' }}>
                        <GraduationCap size={32} className="text-primary" />
                    </div>
                    <div>
                        <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 'bold' }}>Training & Certifications</h1>
                        <p style={{ color: 'var(--color-text-muted)' }}>Monitor employee certification status across core competencies</p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        cursor: 'pointer',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        background: filterCertified ? 'rgba(52, 211, 153, 0.1)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${filterCertified ? 'rgba(52, 211, 153, 0.2)' : 'var(--glass-border)'}`,
                        transition: 'all 0.2s',
                        color: filterCertified ? '#34d399' : 'var(--color-text-muted)',
                        fontSize: '0.9rem'
                    }}>
                        <input
                            type="checkbox"
                            checked={filterCertified}
                            onChange={() => setFilterCertified(!filterCertified)}
                            style={{ accentColor: '#34d399', width: '16px', height: '16px' }}
                        />
                        Tulip Certified Only
                    </label>

                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={isEditing ? 'btn-primary' : 'btn-secondary'}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem' }}
                    >
                        {isEditing ? (
                            <>
                                <Eye size={18} /> Exit Edit Mode
                            </>
                        ) : (
                            <>
                                <Edit2 size={18} /> Edit Certifications
                            </>
                        )}
                    </button>
                </div>
            </header>

            <Card style={{ padding: '0', overflowX: 'auto', marginBottom: '3rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1000px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.03)' }}>
                            <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', minWidth: '180px' }}>Name</th>
                            <th style={{ padding: '1.25rem 1rem', fontWeight: '600', color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', minWidth: '200px' }}>Email</th>
                            <th style={{ padding: '1.25rem 1rem', fontWeight: '600', color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', minWidth: '150px' }}>Title</th>
                            {certifications.map(cert => (
                                <th key={cert.key} style={{ padding: '1.25rem 0.5rem', fontWeight: '600', color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'center', minWidth: '100px' }}>
                                    {cert.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map((employee, index) => (
                            <tr key={employee.id} style={{
                                borderBottom: index === filteredEmployees.length - 1 ? 'none' : '1px solid var(--glass-border)',
                                transition: 'background 0.2s',
                                opacity: updatingId?.startsWith(employee.id) ? 0.7 : 1
                            }} className="hover-row">
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '50%',
                                            background: 'var(--color-primary-transparent)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            <UserCircle size={18} className="text-primary" />
                                        </div>
                                        <div style={{ fontWeight: '500', color: 'var(--color-text-main)', whiteSpace: 'nowrap' }}>
                                            {employee.firstName} {employee.lastName}
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem 1rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Mail size={14} style={{ opacity: 0.6 }} />
                                        {employee.email}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem 1rem', fontSize: '0.85rem' }}>
                                    <span style={{
                                        padding: '0.3rem 0.75rem',
                                        borderRadius: '8px',
                                        background: 'rgba(255,255,255,0.04)',
                                        color: 'var(--color-text-main)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        whiteSpace: 'nowrap',
                                        fontSize: '0.8rem'
                                    }}>
                                        {employee.title || employee.role || 'Unspecified'}
                                    </span>
                                </td>
                                {certifications.map(cert => (
                                    <td key={cert.key} style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                                        {isEditing ? (
                                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                                <input
                                                    type="checkbox"
                                                    disabled={updatingId === `${employee.id}-${cert.key}`}
                                                    checked={!!employee[cert.key]}
                                                    onChange={() => handleToggleCert(employee, cert.key)}
                                                    style={{
                                                        cursor: updatingId ? 'not-allowed' : 'pointer',
                                                        accentColor: 'var(--color-primary)',
                                                        transform: 'scale(1.2)',
                                                        opacity: updatingId === `${employee.id}-${cert.key}` ? 0.5 : 1
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            employee[cert.key] ? (
                                                <div style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: '24px',
                                                    height: '24px',
                                                    borderRadius: '50%',
                                                    background: 'rgba(52, 211, 153, 0.1)',
                                                    color: '#34d399'
                                                }}>
                                                    <Check size={16} strokeWidth={3} />
                                                </div>
                                            ) : (
                                                <span style={{ color: 'rgba(255,255,255,0.1)' }}>—</span>
                                            )
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            <header style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <MessageSquare size={24} style={{ color: 'var(--color-primary)' }} />
                    Training Activity Log
                </h2>
                <p style={{ color: 'var(--color-text-muted)' }}>Latest updates and session notes</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
                {trainingActivities.length > 0 ? (
                    trainingActivities.map(activity => (
                        <Card key={activity.id} style={{ position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
                                        <GraduationCap size={18} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{activity.employeeName}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Calendar size={12} /> {new Date(activity.timestamp).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => handleEditActivity(activity)}
                                        style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteActivity(`train-${activity.id}`)}
                                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <p style={{ lineHeight: '1.6', fontSize: '0.9rem', color: '#000000', background: '#f8fafc', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                                {activity.content}
                            </p>
                        </Card>
                    ))
                ) : (
                    <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        No training activities logged yet.
                    </div>
                )}
            </div>

            {isEditModalOpen && (
                <EditActivityModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    activity={selectedActivity}
                    onSave={handleSaveActivityEdit}
                />
            )}


            <style>
                {`
                    .hover-row:hover { background: rgba(255,255,255,0.02); }
                    .btn-secondary {
                        background: rgba(255,255,255,0.05);
                        border: 1px solid var(--glass-border);
                        color: var(--color-text-main);
                        border-radius: 8px;
                        cursor: pointer;
                        transition: all 0.2s;
                    }
                    .btn-secondary:hover {
                        background: rgba(255,255,255,0.1);
                    }
                `}
            </style>
        </div>
    );
};

export default Training;
