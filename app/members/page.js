'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MembersPage() {
    const router = useRouter();
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        barcode: '',
        gender: '',
        class: '',
        member: '',
    });

    const [stats, setStats] = useState({
        total: 0,
        male: 0,
        female: 0,
        jss: 0,
        sss: 0,
        teacher: 0,
        principal: 0,
    });

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const response = await fetch('/api/members');

            if (!response.ok) {
                throw new Error('Failed to fetch members');
            }

            const data = await response.json();
            console.log(41, data);
            setMembers(data);
            setFilteredMembers(data);
            calculateStats(data);
        } catch (error) {
            console.error('Error fetching members:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateStats = (data) => {
        const stats = {
            total: data.length,
            male: data.filter(m => m.gender.toLowerCase() === 'male').length,
            female: data.filter(m => m.gender.toLowerCase() === 'female').length,
            jss: data.filter(m => m.class === 'JSS').length,
            sss: data.filter(m => m.class === 'SSS').length,
            teacher: data.filter(m => m.class === 'Teacher').length,
            principal: data.filter(m => m.class === 'Principal').length,
        };
        setStats(stats);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);

        let filtered = [...members];
        if (newFilters.barcode) {
            filtered = filtered.filter(m => m.barcode.includes(newFilters.barcode));
        }
        if (newFilters.gender) {
            filtered = filtered.filter(m => m.gender.toLowerCase() === newFilters.gender.toLowerCase());
        }
        if (newFilters.class) {
            filtered = filtered.filter(m => m.class === newFilters.class);
        }
        if (newFilters.member) {
            filtered = filtered.filter(m => m.member === newFilters.member);
        }
        setFilteredMembers(filtered);
    };

    const handleBack = () => {
        router.push('/register');
    };

    if (isLoading) {
        return (
            <div className="container">
                <div className="paper loading">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="paper">
                <div className="header">
                    <h1 className="title">Registered Members</h1>
                    <div className="navigation">
                        <button onClick={handleBack} className="btn btn-outline">
                            Back to Registration
                        </button>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-number">{stats.total}</div>
                        <div className="stat-label">Total Members</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{stats.male}</div>
                        <div className="stat-label">Male</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{stats.female}</div>
                        <div className="stat-label">Female</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{stats.jss + stats.sss}</div>
                        <div className="stat-label">Students</div>
                    </div>
                </div>

                <div className="filters">
                    <div className="form-group">
                        <input
                            type="text"
                            name="barcode"
                            placeholder="Filter by Barcode"
                            className="form-control"
                            value={filters.barcode}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className="form-group">
                        <select
                            name="gender"
                            className="form-select"
                            value={filters.gender}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Genders</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <select
                            name="class"
                            className="form-select"
                            value={filters.class}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Classes</option>
                            <option value="JSS">JSS</option>
                            <option value="SSS">SSS</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Principal">Principal</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <select
                            name="member"
                            className="form-select"
                            value={filters.member}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Members</option>
                            <option value="YES">YES</option>
                            <option value="NO">NO</option>
                        </select>
                    </div>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Barcode</th>
                                <th>Name</th>
                                <th>Gender</th>
                                <th>Class</th>
                                <th>Member</th>
                                <th>Date Registered</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMembers.map((member) => (
                                <tr key={member._id}>
                                    <td>{member.barcode}</td>
                                    <td>{member.name}</td>
                                    <td>{member.gender}</td>
                                    <td>{member.class}</td>
                                    <td>{member.member}</td>
                                    <td>{new Date(member.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {filteredMembers.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center' }}>
                                        No members found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
} 