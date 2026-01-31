import React, { useState, useMemo } from 'react';
import Card from '../components/Card';
import { useData } from '../context/DataContext';
import { Search, Calendar, Filter, ArrowUpDown, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { customers } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [customerFilter, setCustomerFilter] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });

    // Aggregate all activities from all customers
    const allActivities = useMemo(() => {
        const activities = [];
        customers.forEach(customer => {
            if (customer.activityLog && Array.isArray(customer.activityLog)) {
                customer.activityLog.forEach(log => {
                    activities.push({
                        ...log,
                        companyName: customer.company,
                        customerId: customer.id
                    });
                });
            }
        });
        return activities;
    }, [customers]);

    // Enhanced filtering and sorting logic
    const filteredAndSortedActivities = useMemo(() => {
        let result = [...allActivities];

        // Text Search (Content or Company Name)
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            result = result.filter(act =>
                (act.content && act.content.toLowerCase().includes(lowerSearch)) ||
                (act.companyName && act.companyName.toLowerCase().includes(lowerSearch))
            );
        }

        // Customer Dropdown Filter
        if (customerFilter) {
            result = result.filter(act => act.companyName === customerFilter);
        }

        // Sorting
        result.sort((a, b) => {
            let valA = a[sortConfig.key];
            let valB = b[sortConfig.key];

            // Handle nulls for reminder date
            if (sortConfig.key === 'reminder') {
                if (!valA) return 1;
                if (!valB) return -1;
            }

            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [allActivities, searchTerm, customerFilter, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'No Reminder';
        return new Date(dateStr).toLocaleDateString();
    };

    const isOverdue = (dateStr) => {
        if (!dateStr) return false;
        return new Date(dateStr) < new Date().setHours(0, 0, 0, 0);
    };

    return (
        <div>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Activity Dashboard</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Monitor and manage cross-customer activities and reminders.</p>
            </header>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input
                        className="search-input"
                        placeholder="Search activity text or company..."
                        style={{ width: '100%', paddingLeft: '2.5rem' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div style={{ position: 'relative', minWidth: '200px' }}>
                    <Filter size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <select
                        className="search-input"
                        style={{ width: '100%', paddingLeft: '2.5rem' }}
                        value={customerFilter}
                        onChange={(e) => setCustomerFilter(e.target.value)}
                    >
                        <option value="">All Customers</option>
                        {customers.map(c => <option key={c.id} value={c.company}>{c.company}</option>)}
                    </select>
                </div>
            </div>

            <Card style={{ padding: 0, overflow: 'hidden' }}>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th onClick={() => requestSort('companyName')} style={{ cursor: 'pointer' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        Customer <ArrowUpDown size={14} />
                                    </div>
                                </th>
                                <th>Activity Details</th>
                                <th onClick={() => requestSort('timestamp')} style={{ cursor: 'pointer' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        Logged At <ArrowUpDown size={14} />
                                    </div>
                                </th>
                                <th onClick={() => requestSort('reminder')} style={{ cursor: 'pointer' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        Reminder Date <ArrowUpDown size={14} />
                                    </div>
                                </th>
                                <th style={{ textAlign: 'right' }}>Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedActivities.map((act) => (
                                <tr key={act.id}>
                                    <td style={{ fontWeight: '600' }}>{act.companyName}</td>
                                    <td style={{ maxWidth: '400px' }}>
                                        <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>{act.content}</div>
                                    </td>
                                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                                        {new Date(act.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                    </td>
                                    <td>
                                        {act.reminder ? (
                                            <div style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.4rem',
                                                padding: '0.2rem 0.6rem',
                                                borderRadius: '4px',
                                                fontSize: '0.85rem',
                                                background: isOverdue(act.reminder) ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                                color: isOverdue(act.reminder) ? 'var(--color-danger)' : 'var(--color-success)'
                                            }}>
                                                <Clock size={14} />
                                                {formatDate(act.reminder)}
                                            </div>
                                        ) : (
                                            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>-</span>
                                        )}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <Link to={`/customer/${act.customerId}`} style={{ color: 'var(--color-primary)' }}>
                                            <ExternalLink size={18} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {filteredAndSortedActivities.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                                        No activities found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Dashboard;
