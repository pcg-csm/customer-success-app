import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { useData } from '../context/DataContext';
import { Search, Filter, Plus, X, Download, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';

const CustomerList = () => {
    const navigate = useNavigate();
    const { customers, addCustomer, hasPermission } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newCustomer, setNewCustomer] = useState({
        company: '',
        name: '',
        email: '',
        arr: ''
    });
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterActive, setFilterActive] = useState('All');
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: 'company', direction: 'asc' });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleAddCustomer = async (e) => {
        e.preventDefault();
        if (!newCustomer.company || !newCustomer.name) return;

        const customer = await addCustomer({
            ...newCustomer,
            status: 'Onboarding',
            active: true,
            netsuite: { sandboxVersion: '2023.2', productionVersion: '2023.2', sandboxUrl: '', productionUrl: '' },
            tulip: { appVersion: 'v1.0', workstations: 0, accountUrl: '' },
            customerTeam: []
        });

        setIsAddModalOpen(false);
        setNewCustomer({ company: '', name: '', email: '', arr: '' });
        if (customer && customer.id) {
            navigate(`/customers/${customer.id}`);
        }
    };

    const filteredCustomers = customers.filter(customer =>
        (filterStatus === 'All' || customer.status === filterStatus) &&
        (filterActive === 'All' || (filterActive === 'Active' ? customer.active : !customer.active)) &&
        (customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.company.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const sortedCustomers = React.useMemo(() => {
        let sortableItems = [...filteredCustomers];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                let aValue, bValue;

                if (sortConfig.key === 'workstations') {
                    aValue = a.tulip?.workstations || 0;
                    bValue = b.tulip?.workstations || 0;
                } else if (sortConfig.key === 'satisfaction') {
                    aValue = a.satisfaction || 0;
                    bValue = b.satisfaction || 0;
                } else if (sortConfig.key === 'arr') {
                    const parseArr = (val) => {
                        if (!val) return 0;
                        return Number(String(val).replace(/[^0-9.-]+/g, ""));
                    };
                    aValue = parseArr(a.arr);
                    bValue = parseArr(b.arr);
                } else {
                    aValue = (a[sortConfig.key] || '').toString().toLowerCase();
                    bValue = (b[sortConfig.key] || '').toString().toLowerCase();
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredCustomers, sortConfig]);

    const handleExport = () => {
        if (filteredCustomers.length === 0) return;

        // Define headers
        const headers = [
            'ID', 'Company', 'POC Name', 'Email', 'Phone', 'Status', 'Active', 'ARR',
            'Signed Date', 'Terms', 'Satisfaction',
            'NetSuite Sandbox Version', 'NetSuite Production Version', 'NetSuite Sandbox URL', 'NetSuite Production URL',
            'Tulip App Version', 'Tulip Workstations', 'Tulip Account URL',
            'Licensed Products', 'Customer Team'
        ];

        // Map data to rows
        const rows = filteredCustomers.map(c => [
            c.id,
            `"${c.company || ''}"`,
            `"${c.name || ''}"`,
            c.email || '',
            c.phone || '',
            c.status || '',
            c.active ? 'Yes' : 'No',
            `"${c.arr || ''}"`,
            c.signedDate || '',
            `"${c.terms || ''}"`,
            c.satisfaction || '',
            c.netsuite?.sandboxVersion || '',
            c.netsuite?.productionVersion || '',
            c.netsuite?.sandboxUrl || '',
            c.netsuite?.productionUrl || '',
            c.tulip?.appVersion || '',
            c.tulip?.workstations || '',
            c.tulip?.accountUrl || '',
            `"${(c.licensedProducts || []).join('; ')}"`,
            `"${(c.customerTeam || []).map(m => `${m.firstName} ${m.lastName} (${m.role}) <${m.email}>`).join('; ')}"`
        ]);

        // Combine headers and rows
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `customers_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Live': return 'badge-success';
            case 'Onboarding': return 'badge-warning';
            default: return 'badge-neutral';
        }
    };

    const getSatisfactionColor = (score) => {
        if (score <= 3) return '#ef4444'; // Red
        if (score <= 7) return '#f59e0b'; // Amber
        return '#10b981'; // Green
    };

    const SatisfactionDots = ({ score }) => {
        const activeDots = Math.ceil((score || 0) / 2);
        const color = getSatisfactionColor(score);

        return (
            <div style={{ display: 'flex', gap: '3px' }}>
                {[1, 2, 3, 4, 5].map(i => (
                    <div
                        key={i}
                        style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: i <= activeDots ? color : 'rgba(255,255,255,0.1)',
                            border: i <= activeDots ? 'none' : '1px solid rgba(255,255,255,0.2)'
                        }}
                    />
                ))}
            </div>
        );
    };

    return (
        <div>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Customers</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Manage your client relationships.</p>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        className="glass-panel"
                        onClick={handleExport}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-muted)' }}
                        title="Export to CSV"
                    >
                        <Download size={18} /> Export
                    </button>
                    {hasPermission('MANAGE_CUSTOMERS') && (
                        <button className="glass-panel" onClick={() => setIsAddModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-muted)' }}>
                            <Plus size={18} /> New Customer
                        </button>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search customers..."
                            className="search-input"
                            style={{ paddingLeft: '2.5rem' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <button
                            className="glass-panel"
                            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', color: isFilterMenuOpen ? 'var(--color-primary)' : 'var(--color-text-muted)', cursor: 'pointer' }}
                        >
                            <Filter size={18} />
                            <span>{filterStatus === 'All' ? 'Filter' : filterStatus}</span>
                        </button>
                        {isFilterMenuOpen && (
                            <div className="glass-panel" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', minWidth: '200px', zIndex: 50, padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', marginTop: '0.5rem', fontWeight: 'bold' }}>BY STATUS</div>
                                {['All', 'Live', 'Onboarding', 'Churned'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => { setFilterStatus(status); }}
                                        style={{
                                            textAlign: 'left',
                                            padding: '0.5rem',
                                            borderRadius: '4px',
                                            background: filterStatus === status ? 'rgba(255,255,255,0.1)' : 'transparent',
                                            color: filterStatus === status ? 'white' : 'var(--color-text-muted)',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        {status}
                                        {filterStatus === status && <span style={{ color: 'var(--color-primary)' }}>•</span>}
                                    </button>
                                ))}

                                <div style={{ borderTop: '1px solid var(--glass-border)', margin: '0.5rem 0' }}></div>

                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', fontWeight: 'bold' }}>BY ACTIVITY</div>
                                {['All', 'Active', 'Inactive'].map(activeState => (
                                    <button
                                        key={activeState}
                                        onClick={() => { setFilterActive(activeState); }}
                                        style={{
                                            textAlign: 'left',
                                            padding: '0.5rem',
                                            borderRadius: '4px',
                                            background: filterActive === activeState ? 'rgba(255,255,255,0.1)' : 'transparent',
                                            color: filterActive === activeState ? 'white' : 'var(--color-text-muted)',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        {activeState}
                                        {filterActive === activeState && <span style={{ color: 'var(--color-primary)' }}>•</span>}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <Card className="table-container p-0" style={{ padding: 0, overflow: 'hidden' }}>
                <table>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('company')} style={{ cursor: 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Company {sortConfig.key === 'company' ? (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />) : <ArrowUpDown size={14} style={{ opacity: 0.3 }} />}
                                </div>
                            </th>
                            <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Name {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />) : <ArrowUpDown size={14} style={{ opacity: 0.3 }} />}
                                </div>
                            </th>
                            <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Status {sortConfig.key === 'status' ? (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />) : <ArrowUpDown size={14} style={{ opacity: 0.3 }} />}
                                </div>
                            </th>
                            <th>Active</th>
                            <th onClick={() => handleSort('workstations')} style={{ cursor: 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Work Stations {sortConfig.key === 'workstations' ? (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />) : <ArrowUpDown size={14} style={{ opacity: 0.3 }} />}
                                </div>
                            </th>
                            <th onClick={() => handleSort('satisfaction')} style={{ cursor: 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Satisfaction {sortConfig.key === 'satisfaction' ? (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />) : <ArrowUpDown size={14} style={{ opacity: 0.3 }} />}
                                </div>
                            </th>
                            <th onClick={() => handleSort('arr')} style={{ cursor: 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    ARR {sortConfig.key === 'arr' ? (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />) : <ArrowUpDown size={14} style={{ opacity: 0.3 }} />}
                                </div>
                            </th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedCustomers.map((customer) => (
                            <tr key={customer.id}>
                                <td style={{ color: 'var(--color-text-muted)' }}>{customer.company}</td>
                                <td>
                                    <div style={{ fontWeight: '500' }}>{customer.name}</div>
                                </td>
                                <td>
                                    <span className={`badge ${getStatusBadge(customer.status)}`}>
                                        {customer.status}
                                    </span>
                                </td>
                                <td>
                                    <span className={`badge ${customer.active ? 'badge-success' : 'badge-neutral'}`}>
                                        {customer.active ? 'Yes' : 'No'}
                                    </span>
                                </td>
                                <td style={{ color: 'var(--color-text-muted)' }}>{customer.tulip?.workstations || 0}</td>
                                <td>
                                    <SatisfactionDots score={customer.satisfaction} />
                                </td>
                                <td style={{ fontWeight: '500' }}>
                                    {customer.arr ? `$${Number(String(customer.arr).replace(/[^0-9.-]+/g, "")).toLocaleString()}` : 'N/A'}
                                </td>
                                <td>
                                    <button
                                        onClick={() => navigate(`/customers/${customer.id}`)}
                                        style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.875rem' }}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {sortedCustomers.length === 0 && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        No customers found.
                    </div>
                )}
            </Card>

            {isAddModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <Card style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
                        <button
                            onClick={() => setIsAddModalOpen(false)}
                            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                        >
                            <X size={24} />
                        </button>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Add New Customer</h2>
                        <form onSubmit={handleAddCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Company Name</label>
                                <input
                                    className="search-input"
                                    style={{ width: '100%' }}
                                    value={newCustomer.company}
                                    onChange={e => setNewCustomer({ ...newCustomer, company: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>POC Name (Primary Contact)</label>
                                <input
                                    className="search-input"
                                    style={{ width: '100%' }}
                                    value={newCustomer.name}
                                    onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Email</label>
                                <input
                                    type="email"
                                    className="search-input"
                                    style={{ width: '100%' }}
                                    value={newCustomer.email}
                                    onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Projected ARR</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>$</span>
                                    <input
                                        type="number"
                                        className="search-input"
                                        style={{ width: '100%', paddingLeft: '1.5rem' }}
                                        placeholder="0.00"
                                        value={newCustomer.arr}
                                        onChange={e => setNewCustomer({ ...newCustomer, arr: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" className="glass-panel" onClick={() => setIsAddModalOpen(false)} style={{ padding: '0.75rem 1.5rem' }}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>Create Customer</button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default CustomerList;
