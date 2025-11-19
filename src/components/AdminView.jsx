import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { Plus, Edit2, Trash2, LogOut, Save, X, Car, ArrowLeft } from 'lucide-react';
import logo from '../assets/logo.jpg';

export default function AdminView() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [placements, setPlacements] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(initialFormState());
    const [isModalOpen, setIsModalOpen] = useState(false);

    function initialFormState() {
        return { name: '', description: '', day: '', time: '', capacity: 5, location: '' };
    }

    useEffect(() => {
        if (isAuthenticated) {
            loadPlacements();
        }
    }, [isAuthenticated]);

    const loadPlacements = () => {
        setPlacements(dataService.getPlacements());
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (dataService.checkBoardPassword(password)) {
            setIsAuthenticated(true);
        } else {
            alert('Incorrect password');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setPassword('');
    };

    const handleSave = (e) => {
        e.preventDefault();

        // Check for capacity reduction warning
        if (editingId) {
            const currentPlacement = placements.find(p => p.id === editingId);
            if (currentPlacement && formData.capacity < currentPlacement.signUps.length) {
                const confirmed = window.confirm(
                    `WARNING: You are reducing the capacity to ${formData.capacity}, but there are currently ${currentPlacement.signUps.length} students signed up.\n\nThis will trigger an automatic notification to ALL ${currentPlacement.signUps.length} students asking them to check their status.\n\nDo you want to proceed?`
                );
                if (!confirmed) return;
            }

            dataService.updatePlacement(editingId, formData);
        } else {
            dataService.addPlacement(formData);
        }
        loadPlacements();
        closeModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this placement?')) {
            dataService.deletePlacement(id);
            loadPlacements();
        }
    };

    const openModal = (placement = null) => {
        if (placement) {
            setEditingId(placement.id);
            setFormData({ ...placement });
        } else {
            setEditingId(null);
            setFormData(initialFormState());
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData(initialFormState());
    };

    if (!isAuthenticated) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--bg-body)',
                padding: '1rem'
            }}>
                <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                            <img src={logo} alt="Ignatians Logo" style={{ height: '60px', borderRadius: '50%' }} />
                        </div>
                        <h1 style={{ color: 'var(--color-maroon)', fontSize: '1.5rem' }}>Board Login</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Ignatians Service Board</p>
                    </div>
                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
                            <input
                                type="password"
                                className="input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter board password"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
                            Login
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline"
                            style={{ width: '100%' }}
                            onClick={() => navigate('/')}
                        >
                            <ArrowLeft size={18} /> Back to Home
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div>
            <header className="header">
                <div className="container header-content">
                    <div className="logo">
                        <img src={logo} alt="Ignatians Logo" style={{ height: '40px', borderRadius: '50%' }} />
                        <span style={{ color: 'var(--color-maroon)' }}>IGNATIANS</span>
                        <span style={{ color: 'var(--color-navy)', fontWeight: 400 }}>BOARD</span>
                    </div>
                    <button onClick={handleLogout} className="btn btn-outline" style={{ fontSize: '0.875rem' }}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </header>

            <main className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ color: 'var(--color-navy)', margin: 0 }}>Manage Placements</h1>
                    <button onClick={() => openModal()} className="btn btn-primary">
                        <Plus size={18} /> Add Placement
                    </button>
                </div>

                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: 'var(--color-gray-50)', borderBottom: '1px solid var(--color-gray-200)' }}>
                            <tr>
                                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-gray-800)' }}>Placement</th>
                                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-gray-800)' }}>Day/Time</th>
                                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-gray-800)' }}>Sign-ups</th>
                                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-gray-800)' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {placements.map(p => {
                                const signedUpCount = p.signUps ? p.signUps.length : 0;
                                return (
                                    <tr key={p.id} style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
                                        <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                                            <div style={{ fontWeight: 500, color: 'var(--color-maroon)' }}>{p.name}</div>
                                            <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>{p.location}</div>
                                        </td>
                                        <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                                            <div>{p.day}</div>
                                            <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>{p.time}</div>
                                        </td>
                                        <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                                            <div style={{ marginBottom: '0.5rem' }}>
                                                <span className={`badge ${signedUpCount >= p.capacity ? 'badge-gold' : ''}`} style={{ backgroundColor: signedUpCount >= p.capacity ? 'var(--color-maroon)' : 'var(--color-gray-200)', color: signedUpCount >= p.capacity ? 'white' : 'inherit' }}>
                                                    {signedUpCount} / {p.capacity}
                                                </span>
                                            </div>
                                            {p.signUps && p.signUps.length > 0 && (
                                                <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '0.875rem' }}>
                                                    {p.signUps.map((s, idx) => (
                                                        <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                            {s.isDriver && <Car size={14} color="var(--color-maroon)" />}
                                                            <span>{s.name}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => openModal(p)} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }}>
                                                    <Edit2 size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(p.id)} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', color: '#991b1b', borderColor: '#fecaca' }}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </main>

            {isModalOpen && (
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, color: 'var(--color-navy)' }}>
                                {editingId ? 'Edit Placement' : 'New Placement'}
                            </h2>
                            <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={24} color="var(--color-gray-500)" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="grid grid-cols-1" style={{ gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Name</label>
                                <input className="input" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Description</label>
                                <textarea className="input" rows="3" required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Day</label>
                                    <select className="input" required value={formData.day} onChange={e => setFormData({ ...formData, day: e.target.value })}>
                                        <option value="">Select Day</option>
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Time</label>
                                    <input className="input" required value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} placeholder="e.g. 3:00 PM - 5:00 PM" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Location</label>
                                    <input className="input" required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Capacity</label>
                                    <input type="number" min="1" className="input" required value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={closeModal} className="btn btn-outline">Cancel</button>
                                <button type="submit" className="btn btn-primary">
                                    <Save size={18} /> Save Placement
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
