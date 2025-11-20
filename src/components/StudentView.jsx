/**
 * Student view component.
 *
 * This component provides the interface for students to view and sign up for service placements.
 * It features:
 * - A list of available placements.
 * - Real-time updates of sign-ups.
 * - Detailed view of each placement.
 * - Sign-up functionality with driver and passenger capacity options.
 * - Display of global notifications.
 *
 * @module StudentView
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { Calendar, MapPin, Users, Car, CheckCircle, AlertCircle, Bell, X, Lock, Camera, ExternalLink, Loader } from 'lucide-react';
import logo from '../assets/logo.jpg';

/**
 * The main StudentView component.
 *
 * @component
 * @returns {JSX.Element} The rendered StudentView component.
 */
export default function StudentView() {
    const navigate = useNavigate();
    const [placements, setPlacements] = useState([]);
    const [notification, setNotification] = useState(null);
    const [selectedPlacement, setSelectedPlacement] = useState(null);
    const [expandedPlacement, setExpandedPlacement] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [studentName, setStudentName] = useState('');
    const [isDriver, setIsDriver] = useState(false);
    const [passengerCapacity, setPassengerCapacity] = useState(4);
    const [latestGlobalNotif, setLatestGlobalNotif] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const openTimerRef = useRef(null);
    const closeTimerRef = useRef(null);

    /**
     * Fetches the latest notification from the data service.
     */
    const loadLatestNotification = async () => {
        const notif = await dataService.getLatestNotification();
        setLatestGlobalNotif(notif);
    };

    useEffect(() => {
        const unsubscribe = dataService.subscribeToPlacements((data) => {
            setPlacements(data);
            setIsLoading(false);
        });

        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadLatestNotification();

        return () => {
            unsubscribe();
            clearTimeout(openTimerRef.current);
            clearTimeout(closeTimerRef.current);
        };
    }, []);

    /**
     * Handles the click event on a placement card.
     * Opens the detailed view for the selected placement.
     *
     * @param {Object} placement - The placement object that was clicked.
     */
    const handleCardClick = (placement) => {
        clearTimeout(closeTimerRef.current);
        setExpandedPlacement(placement);
        openTimerRef.current = setTimeout(() => setIsVisible(true), 10);
    };

    /**
     * Closes the expanded placement modal with an animation.
     */
    const handleCloseModal = () => {
        clearTimeout(openTimerRef.current);
        setIsVisible(false);
        closeTimerRef.current = setTimeout(() => {
            setExpandedPlacement(null);
        }, 300); // Match the fadeOut animation duration
    };

    /**
     * Prepares the sign-up modal for a specific placement.
     * Resets the form fields.
     *
     * @param {Object} placement - The placement to sign up for.
     */
    const handleSignUpClick = (placement) => {
        setSelectedPlacement(placement);
        setStudentName('');
        setStudentName('');
        setIsDriver(false);
        setPassengerCapacity(4);
    };

    /**
     * Submits the sign-up form.
     * Calls the data service to register the student.
     * Shows a success or error notification based on the result.
     *
     * @param {Event} e - The form submission event.
     */
    const handleConfirmSignUp = async (e) => {
        e.preventDefault();
        if (!studentName.trim()) return;

        const result = await dataService.signUp(selectedPlacement.id, studentName, isDriver, passengerCapacity);

        if (result.success) {
            showNotification('success', result.message);
            // loadPlacements(); // No longer needed, subscription handles it
            setSelectedPlacement(null);
            setExpandedPlacement(null);
        } else {
            showNotification('error', result.message);
        }
    };

    /**
     * Displays a temporary notification message.
     *
     * @param {string} type - The type of notification ('success' or 'error').
     * @param {string} message - The message to display.
     */
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
                <div className="container header-content">
                    <div className="logo">
                        <img src={logo} alt="Ignatians Logo" style={{ height: '40px', borderRadius: '50%' }} />
                        <span style={{ color: 'var(--color-maroon)' }}>IGNATIANS</span>
                        <span style={{ color: 'var(--color-navy)', fontWeight: 400 }}>SERVICE</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <a
                            href="https://join.photocircleapp.com/XBFVGAGWVV"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', padding: '0.5rem 1rem', textDecoration: 'none' }}
                        >
                            <Camera size={16} />
                            <span>PhotoCircle</span>
                        </a>
                        <button
                            onClick={() => navigate('/board')}
                            className="btn btn-outline"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                        >
                            <Lock size={16} />
                            <span>Board</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="container">
                <div className="hero">
                    <h1>Weekly Service Sign-ups</h1>
                    <p>Click on a placement to learn more and sign up. Thank you for your service!</p>
                </div>

                {/* Grid Layout */}
                <div className="placement-grid">
                    {isLoading ? (
                        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                            <Loader className="spin" size={48} color="var(--color-maroon)" />
                        </div>
                    ) : placements.length === 0 ? (
                        <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 2rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                <AlertCircle size={48} style={{ color: 'var(--color-maroon)' }} />
                                <h3 style={{ margin: 0, color: 'var(--color-navy)' }}>No Placements Available</h3>
                                <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: 0 }}>
                                    There are currently no placements available for signup this week.
                                    Please check back later or contact the board if you have any questions.
                                </p>
                            </div>
                        </div>
                    ) : (
                        placements.map(placement => {
                            const signedUpCount = placement.signUps ? placement.signUps.length : 0;
                            const isFull = signedUpCount >= placement.capacity;

                            return (
                                <div
                                    key={placement.id}
                                    className="placement-card-compact"
                                    onClick={() => handleCardClick(placement)}
                                >
                                    <div className="placement-card-image">
                                        <img src={placement.image} alt={placement.name} />
                                        <div className="placement-card-overlay">
                                            <span className="placement-learn-more">Click to Learn More</span>
                                        </div>
                                    </div>
                                    <div className="placement-card-content">
                                        <h3>{placement.name}</h3>
                                        <div className="placement-card-meta">
                                            <span className="placement-card-day">{placement.day}</span>
                                            <span className={`placement-card-badge ${isFull ? 'full' : ''}`}>
                                                {isFull ? 'FULL' : `${placement.capacity - signedUpCount} spots`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>

            {/* Expanded Modal */}
            {expandedPlacement && (
                <div className={`placement-modal-overlay ${isVisible ? 'visible' : ''}`} onClick={handleCloseModal}>
                    <div className={`placement-modal-content ${isVisible ? 'visible' : ''}`} onClick={(e) => e.stopPropagation()}>
                        <button className="placement-modal-close" onClick={handleCloseModal}>
                            <X size={24} />
                        </button>

                        <div className="placement-modal-image">
                            <img src={expandedPlacement.image} alt={expandedPlacement.name} />
                        </div>

                        <div className="placement-modal-body">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                <h2 style={{ margin: 0, color: 'var(--color-maroon)' }}>{expandedPlacement.name}</h2>
                                <span className={`badge ${expandedPlacement.signUps?.length >= expandedPlacement.capacity ? 'badge-gray' : ''}`}
                                    style={{
                                        backgroundColor: expandedPlacement.signUps?.length >= expandedPlacement.capacity ? 'var(--color-gray-200)' : 'var(--color-navy)',
                                        color: expandedPlacement.signUps?.length >= expandedPlacement.capacity ? 'var(--color-gray-600)' : 'white'
                                    }}>
                                    {expandedPlacement.signUps?.length >= expandedPlacement.capacity
                                        ? 'FULL'
                                        : `${expandedPlacement.capacity - (expandedPlacement.signUps?.length || 0)} spots left`}
                                </span>
                            </div>

                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                                {expandedPlacement.detailedDescription}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                                    <Calendar size={18} style={{ color: 'var(--color-maroon)' }} />
                                    <span>{expandedPlacement.day} • {expandedPlacement.time}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'start', gap: '0.5rem', color: 'var(--text-muted)' }}>
                                    <MapPin size={18} style={{ color: 'var(--color-maroon)', marginTop: '2px', flexShrink: 0 }} />
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
                                        <span>{expandedPlacement.address || expandedPlacement.location}</span>
                                        {expandedPlacement.mapLink && (
                                            <a
                                                href={expandedPlacement.mapLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    color: 'var(--color-maroon)',
                                                    textDecoration: 'none',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 600,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem'
                                                }}
                                            >
                                                <span>Get Directions</span>
                                                <ExternalLink size={14} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                                    <Car size={18} style={{ color: expandedPlacement.signUps?.some(s => s.isDriver) ? 'var(--color-gold)' : 'var(--color-maroon)' }} />
                                    <span style={{ color: expandedPlacement.signUps?.some(s => s.isDriver) ? 'var(--color-gold)' : 'inherit', fontWeight: expandedPlacement.signUps?.some(s => s.isDriver) ? 600 : 400 }}>
                                        {expandedPlacement.signUps?.some(s => s.isDriver) ? 'Driver Found' : 'Driver Needed'}
                                    </span>
                                </div>
                            </div>

                            {/* Sign-up List */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                                    Who's Going:
                                </div>
                                <div className="code-block">
                                    {expandedPlacement.signUps && expandedPlacement.signUps.length > 0 ? (
                                        expandedPlacement.signUps.map((s, idx) => (
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
                                className={`btn ${expandedPlacement.signUps?.length >= expandedPlacement.capacity ? 'btn-outline' : 'btn-primary'}`}
                                style={{ width: '100%' }}
                                disabled={expandedPlacement.signUps?.length >= expandedPlacement.capacity}
                                onClick={() => handleSignUpClick(expandedPlacement)}
                            >
                                {expandedPlacement.signUps?.length >= expandedPlacement.capacity ? 'Placement Full' : 'Sign Up'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedPlacement && (
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200
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
                                {isDriver && (
                                    <div style={{ marginTop: '0.75rem', marginLeft: '1.5rem' }}>
                                        <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: 'var(--color-gray-700)' }}>
                                            Passenger Capacity (excluding you)
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            className="input"
                                            value={passengerCapacity}
                                            onChange={(e) => setPassengerCapacity(parseInt(e.target.value) || 0)}
                                            style={{ width: '100px' }}
                                            required={isDriver}
                                        />
                                    </div>
                                )}
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
            )}

            {notification && (
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
            )}
        </div>
    );
}
