/**
 * Board management view component.
 *
 * This component provides the interface for board members to manage service placements.
 * It allows authenticated users to:
 * - View all placements and their current sign-ups.
 * - Add new placements.
 * - Edit existing placements (including capacity management).
 * - Delete placements.
 * - Authenticate via Email/Password or Google Sign-In.
 *
 * @module BoardView
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { auth, googleProvider } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { Plus, Edit2, Trash2, LogOut, Save, X, Car, ArrowLeft, Loader, MoreVertical } from 'lucide-react';
import logo from '../assets/logo.jpg';

/**
 * The main BoardView component.
 *
 * @component
 * @returns {JSX.Element} The rendered BoardView component.
 */
export default function BoardView() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [placements, setPlacements] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(initialFormState());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeMenu, setActiveMenu] = useState(null);

    /**
     * returns the initial state for the placement form.
     *
     * @returns {Object} The initial form state object.
     */
    function initialFormState() {
        return { name: '', description: '', day: '', time: '', capacity: 5, location: '' };
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            let mounted = true;

            const unsubscribe = dataService.subscribeToPlacements((data) => {
                if (mounted) {
                    setPlacements(data);
                    setIsLoading(false);
                }
            });

            return () => {
                mounted = false;
                unsubscribe();
            };
        }
    }, [user]);

    /**
     * Handles email/password login form submission.
     *
     * @param {Event} e - The form submission event.
     */
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    };

    /**
     * Handles Google Sign-In.
     */
    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            alert('Google Login failed: ' + error.message);
        }
    };

    /**
     * Handles user logout.
     */
    const handleLogout = async () => {
        try {
            await signOut(auth);
            setPlacements([]);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    /**
     * Handles saving a placement (create or update).
     * Checks for capacity reduction warnings before saving updates.
     *
     * @param {Event} e - The form submission event.
     */
    const handleSave = async (e) => {
        e.preventDefault();

        try {
            // Check for capacity reduction warning
            if (editingId) {
                const currentPlacement = placements.find(p => p.id === editingId);
                if (currentPlacement && formData.capacity < currentPlacement.signUps.length) {
                    const confirmed = window.confirm(
                        `WARNING: You are reducing the capacity to ${formData.capacity}, but there are currently ${currentPlacement.signUps.length} students signed up.\n\nThis will trigger an automatic notification to ALL ${currentPlacement.signUps.length} students asking them to check their status.\n\nDo you want to proceed?`
                    );
                    if (!confirmed) return;
                }

                await dataService.updatePlacement(editingId, formData);
            } else {
                await dataService.addPlacement(formData);
            }
            closeModal();
        } catch (error) {
            console.error("Error saving placement:", error);
            alert(`Failed to save placement: ${error.message}`);
        }
    };

    /**
     * Handles deleting a placement.
     * Asks for confirmation before deletion.
     *
     * @param {string} id - The ID of the placement to delete.
     */
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this placement?')) {
            await dataService.deletePlacement(id);
        }
    };

    /**
     * Opens the placement modal for adding or editing.
     *
     * @param {Object|null} [placement=null] - The placement object to edit, or null to add a new one.
     */
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

    /**
     * Closes the placement modal and resets the form state.
     */
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData(initialFormState());
    };

    if (authLoading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader className="spin" size={48} color="var(--color-maroon)" />
            </div>
        );
    }

    if (!user) {
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
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email</label>
                            <input
                                type="email"
                                className="input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email"
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
                            <input
                                type="password"
                                className="input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
                            Login with Email
                        </button>
                    </form>

                    <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0' }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-gray-200)' }}></div>
                        <span style={{ padding: '0 0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>OR</span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-gray-200)' }}></div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className="btn btn-outline"
                        style={{ width: '100%', marginBottom: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fillRule="evenodd" fillOpacity="1" fill="#4285F4" stroke="none"></path>
                            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.715H.957v2.332A8.997 8.997 0 0 0 9 18z" fillRule="evenodd" fillOpacity="1" fill="#34A853" stroke="none"></path>
                            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fillRule="evenodd" fillOpacity="1" fill="#FBBC05" stroke="none"></path>
                            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fillRule="evenodd" fillOpacity="1" fill="#EA4335" stroke="none"></path>
                        </svg>
                        Sign in with Google
                    </button>

                    <button
                        type="button"
                        className="btn btn-outline"
                        style={{ width: '100%' }}
                        onClick={() => navigate('/')}
                    >
                        <ArrowLeft size={18} /> Back to Home
                    </button>
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

                <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                    {isLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                            <Loader className="spin" size={48} color="var(--color-maroon)" />
                        </div>
                    ) : (
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
                                                    <span className={`badge ${signedUpCount >= p.capacity ? 'badge-gold' : ''}`} style={{ backgroundColor: signedUpCount >= p.capacity ? 'var(--color-maroon)' : 'var(--color-gray-200)', color: signedUpCount >= p.capacity ? 'white' : 'var(--color-gray-800)' }}>
                                                        {signedUpCount} / {p.capacity}
                                                    </span>
                                                </div>
                                                {p.signUps && p.signUps.length > 0 && (
                                                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '0.875rem' }}>
                                                        {p.signUps.map((s, idx) => (
                                                            <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                                {s.isDriver && <Car size={14} color="var(--color-maroon)" />}
                                                                <span>
                                                                    {s.name}
                                                                    {s.isDriver && s.passengerCapacity && (
                                                                        <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginLeft: '0.25rem' }}>
                                                                            ({s.passengerCapacity} seats)
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </td>
                                            <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                                                {/* Desktop View */}
                                                <div className="desktop-only actions-group">
                                                    <button onClick={() => openModal(p)} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }}>
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button onClick={() => handleDelete(p.id)} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', color: 'var(--color-danger)', borderColor: 'var(--color-danger-light)' }}>
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>

                                                {/* Mobile View */}
                                                <div className="mobile-only" style={{ position: 'relative' }}>
                                                    <button
                                                        onClick={() => setActiveMenu(activeMenu === p.id ? null : p.id)}
                                                        className="btn btn-outline"
                                                        style={{ padding: '0.25rem' }}
                                                    >
                                                        <MoreVertical size={16} />
                                                    </button>
                                                    {activeMenu === p.id && (
                                                        <div style={{
                                                            position: 'absolute',
                                                            right: 0,
                                                            top: '100%',
                                                            backgroundColor: 'var(--bg-card)',
                                                            border: '1px solid var(--border-color)',
                                                            borderRadius: '0.375rem',
                                                            boxShadow: 'var(--shadow-lg)',
                                                            zIndex: 10,
                                                            minWidth: '120px'
                                                        }}>
                                                            <button
                                                                onClick={() => { openModal(p); setActiveMenu(null); }}
                                                                className="btn"
                                                                style={{ display: 'flex', width: '100%', textAlign: 'left', padding: '0.5rem 1rem', background: 'none', color: 'var(--text-main)' }}
                                                            >
                                                                <Edit2 size={14} /> Edit
                                                            </button>
                                                            <button
                                                                onClick={() => { handleDelete(p.id); setActiveMenu(null); }}
                                                                className="btn"
                                                                style={{ display: 'flex', width: '100%', textAlign: 'left', padding: '0.5rem 1rem', background: 'none', color: 'var(--color-danger)', gap: '0.5rem' }}
                                                            >
                                                                <Trash2 size={14} /> Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
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
