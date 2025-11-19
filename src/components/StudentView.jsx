import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { Calendar, MapPin, Users, Car, CheckCircle, AlertCircle, Bell, X, Lock } from 'lucide-react';
import logo from '../assets/logo.jpg';

export default function StudentView() {
    const navigate = useNavigate();
    const [placements, setPlacements] = useState([]);
    const [notification, setNotification] = useState(null);
    const [selectedPlacement, setSelectedPlacement] = useState(null);
    const [studentName, setStudentName] = useState('');
    const [isDriver, setIsDriver] = useState(false);
    const [latestGlobalNotif, setLatestGlobalNotif] = useState(null);

    useEffect(() => {
        loadPlacements();
        loadLatestNotification();
    }, []);

    const loadPlacements = () => {
        setPlacements(dataService.getPlacements());
    };

    const loadLatestNotification = () => {
        const notif = dataService.getLatestNotification();
        setLatestGlobalNotif(notif);
    };

    const handleSignUpClick = (placement) => {
        setSelectedPlacement(placement);
        setStudentName('');
        setIsDriver(false);
    };

    const handleConfirmSignUp = (e) => {
        e.preventDefault();
        if (!studentName.trim()) return;

        const result = dataService.signUp(selectedPlacement.id, studentName, isDriver);

        if (result.success) {
            showNotification('success', result.message);
            loadPlacements();
            setSelectedPlacement(null);
        } else {
            showNotification('error', result.message);
        }
    };

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <div>
            {latestGlobalNotif && (
                <div style={{
                    backgroundColor: 'var(--color-gold)',
                    color: 'var(--color-navy)',
                    padding: '0.75rem',
                    textAlign: 'center',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    borderBottom: '1px solid var(--color-gold-dim)'
                }}>
                    <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <AlertCircle size={18} />
                        <span>{latestGlobalNotif.message}</span>
                    </div>
                </div>
            )}

            <header className="header">
            </header>

            <main className="container">
                <div className="hero">
                    <h1>Weekly Service Sign-ups</h1>
                    <p>Select a placement below to sign up. Thank you for your service!</p>
                </div>

                <div className="grid">
                    {placements.map(placement => {
                        const signedUpCount = placement.signUps ? placement.signUps.length : 0;
                        const isFull = signedUpCount >= placement.capacity;
                        const driverFound = placement.signUps && placement.signUps.some(s => s.isDriver);

                        return (
                            <div key={placement.id} className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <h3 style={{ margin: 0, color: 'var(--color-maroon)' }}>{placement.name}</h3>
                                    <span className={`badge ${isFull ? 'badge-gold' : ''}`} style={{ backgroundColor: isFull ? 'var(--color-gray-200)' : 'var(--color-navy)', color: isFull ? 'var(--color-gray-600)' : 'white' }}>
                                        {isFull ? 'FULL' : `${placement.capacity - signedUpCount} spots left`}
                                    </span>
                                </div>

                                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{placement.description}</p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                                        <Calendar size={18} style={{ color: 'var(--color-maroon)' }} />
                                        <span>{placement.day} • {placement.time}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                                        <MapPin size={18} style={{ color: 'var(--color-maroon)' }} />
                                        <span>{placement.location}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                                        <Car size={18} className={driverFound ? "" : ""} style={{ color: driverFound ? 'var(--color-gold)' : 'var(--color-maroon)' }} />
                                        <span style={{ color: driverFound ? 'var(--color-gold)' : 'inherit', fontWeight: driverFound ? 600 : 400 }}>
                                            {driverFound ? 'Driver Found' : 'Driver Needed'}
                                        </span>
                                    </div>
                                </div>

                                {/* Sign-up List (Code Block Style) */}
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                                        Who's Going:
                                    </div>
                                    <div className="code-block">
                                        {placement.signUps && placement.signUps.length > 0 ? (
                                            placement.signUps.map((s, idx) => (
                                                <span key={idx} className="code-line">
                                                    <span style={{ color: 'var(--color-maroon)' }}>{idx + 1}.</span> {s.name}
                                                    {s.isDriver && <span style={{ color: 'var(--color-gold)', marginLeft: '0.5rem' }}>[DRIVER]</span>}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-light" style={{ fontStyle: 'italic' }}>// No sign-ups yet</span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    className={`btn ${isFull ? 'btn-outline' : 'btn-primary'}`}
                                    style={{ width: '100%', marginTop: 'auto' }}
                                    disabled={isFull}
                                    onClick={() => handleSignUpClick(placement)}
                                >
                                    {isFull ? 'Placement Full' : 'Sign Up'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </main >

            {selectedPlacement && (
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, color: 'var(--color-navy)' }}>Sign Up</h2>
                            <button onClick={() => setSelectedPlacement(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={24} color="var(--color-gray-500)" />
                            </button>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <strong>{selectedPlacement.name}</strong>
                            <div style={{ fontSize: '0.9rem', color: 'var(--color-gray-600)' }}>
                                {selectedPlacement.day} • {selectedPlacement.time}
                            </div>
                        </div>

                        <form onSubmit={handleConfirmSignUp}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Your Name</label>
                                <input
                                    className="input"
                                    value={studentName}
                                    onChange={(e) => setStudentName(e.target.value)}
                                    placeholder="Enter your full name"
                                    required
                                    autoFocus
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={isDriver}
                                        onChange={(e) => setIsDriver(e.target.checked)}
                                        disabled={selectedPlacement.signUps.some(s => s.isDriver)}
                                    />
                                    <span>I can drive others to this placement</span>
                                </label>
                                {selectedPlacement.signUps.some(s => s.isDriver) && (
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-gold)', marginTop: '0.25rem', marginLeft: '1.5rem' }}>
                                        A driver has already signed up.
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                Confirm Sign Up
                            </button>
                        </form>
                    </div>
                </div>
            )
            }

            {
                notification && (
                    <div style={{
                        position: 'fixed',
                        bottom: '2rem',
                        right: '2rem',
                        backgroundColor: notification.type === 'success' ? 'var(--color-navy)' : '#ef4444',
                        color: 'white',
                        padding: '1rem 2rem',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        animation: 'slideIn 0.3s ease-out',
                        zIndex: 1000
                    }}>
                        {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        {notification.message}
                    </div>
                )
            }
        </div >
    );
}
