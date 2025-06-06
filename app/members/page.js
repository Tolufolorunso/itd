'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useReactToPrint } from 'react-to-print';
import AttendanceCharts from '../components/AttendanceCharts';

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
        year: new Date().getFullYear().toString(),
        attended: '',
    });
    const [years, setYears] = useState([]);

    const [stats, setStats] = useState({
        total: 0,
        male: 0,
        female: 0,
        jss: 0,
        sss: 0,
        teacher: 0,
        principal: 0,
    });

    const [attendanceStats, setAttendanceStats] = useState({
        total: 0,
        byGender: {},
        byClass: {},
        byMember: {},
    });

    const statsRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => statsRef.current,
        documentTitle: `ITD-${filters.year}-Attendance-Stats`,
    });

    useEffect(() => {
        fetchMembers();
        const interval = setInterval(fetchMembers, 5000); // Refresh every 5 seconds
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, members]);

    const fetchMembers = async () => {
        try {
            const response = await fetch('/api/members', {
                cache: 'no-store'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch members');
            }

            const data = await response.json();
            setMembers(data);

            const uniqueYears = [...new Set(data.map(item => item.year))].sort((a, b) => b - a);
            setYears(uniqueYears);
            if (!filters.year && uniqueYears.length > 0) {
                setFilters(prev => ({ ...prev, year: uniqueYears[0].toString() }));
            }

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

    const calculateAttendanceStats = (data) => {
        const attendedMembers = data.filter(m => m.isAttended);

        const byGender = attendedMembers.reduce((acc, m) => {
            acc[m.gender] = (acc[m.gender] || 0) + 1;
            return acc;
        }, {});

        const byClass = attendedMembers.reduce((acc, m) => {
            acc[m.class] = (acc[m.class] || 0) + 1;
            return acc;
        }, {});

        const byMember = attendedMembers.reduce((acc, m) => {
            acc[m.member] = (acc[m.member] || 0) + 1;
            return acc;
        }, {});

        setAttendanceStats({
            total: attendedMembers.length,
            byGender,
            byClass,
            byMember,
        });
    }

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        let filtered = [...members];

        if (filters.year) {
            filtered = filtered.filter(m => m.year.toString() === filters.year);
        }
        if (filters.barcode) {
            filtered = filtered.filter(m => m.barcode.includes(filters.barcode));
        }
        if (filters.gender) {
            filtered = filtered.filter(m => m.gender.toLowerCase() === filters.gender.toLowerCase());
        }
        if (filters.class) {
            filtered = filtered.filter(m => m.class === filters.class);
        }
        if (filters.member) {
            filtered = filtered.filter(m => m.member === filters.member);
        }
        if (filters.attended) {
            const attendedBool = filters.attended === 'true';
            filtered = filtered.filter(m => m.isAttended === attendedBool);
        }
        setFilteredMembers(filtered);
        calculateAttendanceStats(filtered)
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
        <div className="container mx-auto p-4">
            <div className="paper">
                <div className="header">
                    <h1 className="title">Registered Members</h1>
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

                <div className="my-8" ref={statsRef}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">ITD {filters.year} Attendance Stats</h2>
                        <button onClick={handlePrint} className="btn btn-primary">Print/Download Stats</button>
                    </div>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-number">{attendanceStats.total}</div>
                            <div className="stat-label">Total Attended</div>
                        </div>
                        {Object.entries(attendanceStats.byGender).map(([gender, count]) => (
                            <div className="stat-card" key={gender}>
                                <div className="stat-number">{count}</div>
                                <div className="stat-label">{gender}</div>
                            </div>
                        ))}
                         {Object.entries(attendanceStats.byClass).map(([className, count]) => (
                            <div className="stat-card" key={className}>
                                <div className="stat-number">{count}</div>
                                <div className="stat-label">{className}</div>
                            </div>
                        ))}
                         {Object.entries(attendanceStats.byMember).map(([member, count]) => (
                            <div className="stat-card" key={member}>
                                <div className="stat-number">{count}</div>
                                <div className="stat-label">Member: {member}</div>
                            </div>
                        ))}
                    </div>
                    {attendanceStats.total > 0 && <AttendanceCharts stats={attendanceStats} />}
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
                     <div className="form-group">
                        <select
                            name="year"
                            className="form-select"
                            value={filters.year}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Years</option>
                            {years.map(y => <option key={y} value={y}>{`ITD ${y}`}</option>)}
                        </select>
                    </div>
                     <div className="form-group">
                        <select
                            name="attended"
                            className="form-select"
                            value={filters.attended}
                            onChange={handleFilterChange}
                        >
                            <option value="">All</option>
                            <option value="true">Attended</option>
                            <option value="false">Not Attended</option>
                        </select>
                    </div>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>NO</th>
                                <th>Barcode</th>
                                <th>Name</th>
                                <th>Gender</th>
                                <th>Class</th>
                                <th>Member</th>
                                <th>Attended</th>
                                <th>Date Registered</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMembers.map((member, index) => (
                                <tr key={member._id}>
                                    <td>{index + 1}</td>
                                    <td>{member.barcode}</td>
                                    <td>{member.name}</td>
                                    <td>{member.gender}</td>
                                    <td>{member.class}</td>
                                    <td>{member.member}</td>
                                    <td>{member.isAttended ? 'Yes' : 'No'}</td>
                                    <td>{new Date(member.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {filteredMembers.length === 0 && (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center' }}>
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