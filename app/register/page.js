'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        barcode: '',
        gender: '',
        class: 'JSS',
        member: 'YES',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigateToMembers = () => {
        router.push('/members');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'barcode' && value.length > 8) {
            return;
        }
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.barcode.length !== 3) {
            setError('Barcode must be exactly 3 characters');
            return;
        }
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setFormData({
                    name: '',
                    barcode: '',
                    gender: '',
                    class: 'JSS',
                    member: 'YES',
                });
                alert('Registration successful!');
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="paper">
                <div className="header">
                    <h1 className="title">IJERO Tech 2025 Event Registration</h1>
                    <div className="navigation">
                        <button onClick={navigateToMembers} className="btn btn-outline">
                            View Members
                        </button>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className={isLoading ? 'loading' : ''}>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label required">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="form-control"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={isLoading}

                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="barcode" className="form-label required">Barcode</label>
                        <input
                            type="number"
                            id="barcode"
                            name="barcode"
                            className={`form-control ${formData.barcode.length > 0 && formData.barcode.length !== 3 ? 'error' : ''}`}
                            value={formData.barcode}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                            maxLength={3}
                            minLength={3}
                        />
                        {formData.barcode.length > 0 && formData.barcode.length !== 3 && (
                            <div className="error-text">Barcode must be exactly 3 characters</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="gender" className="form-label">Gender</label>
                        <select
                            id="gender"
                            name="gender"
                            className="form-select"
                            value={formData.gender}
                            onChange={handleChange}
                            disabled={isLoading}
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="class" className="form-label">Class</label>
                        <select
                            id="class"
                            name="class"
                            className="form-select"
                            value={formData.class}
                            onChange={handleChange}
                            disabled={isLoading}
                        >
                            <option value="JSS">JSS</option>
                            <option value="SSS">SSS</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Principal">Principal</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="member" className="form-label">Member</label>
                        <select
                            id="member"
                            name="member"
                            className="form-select"
                            value={formData.member}
                            onChange={handleChange}
                            disabled={isLoading}
                        >
                            <option value="YES">YES</option>
                            <option value="NO">NO</option>
                        </select>
                    </div>

                    {error && <div className="error-text">{error}</div>}

                    <button
                        type="submit"
                        className="btn btn-primary btn-full"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <div className="spinner"></div>
                                Registering...
                            </>
                        ) : (
                            'Register'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
} 