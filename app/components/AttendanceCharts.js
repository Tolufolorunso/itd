'use client';

import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AttendanceCharts = ({ stats }) => {
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Attendance Statistics',
            },
        },
    };

    const genderData = {
        labels: Object.keys(stats.byGender),
        datasets: [{
            label: 'Attendance by Gender',
            data: Object.values(stats.byGender),
            backgroundColor: ['#36A2EB', '#FF6384'],
        }],
    };

    const classData = {
        labels: Object.keys(stats.byClass),
        datasets: [{
            label: 'Attendance by Class',
            data: Object.values(stats.byClass),
            backgroundColor: ['#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
        }],
    };
    
    const memberData = {
        labels: Object.keys(stats.byMember),
        datasets: [{
            label: 'Attendance by Membership',
            data: Object.values(stats.byMember),
            backgroundColor: ['#FF6384', '#36A2EB'],
        }],
    };

    return (
        <div className="charts-container">
            <div className="chart">
                <h3 className="chart-title">By Gender</h3>
                <Pie data={genderData} options={{ ...chartOptions, title: { ...chartOptions.plugins.title, text: 'By Gender' } }} />
            </div>
            <div className="chart">
                <h3 className="chart-title">By Class</h3>
                <Bar data={classData} options={{ ...chartOptions, title: { ...chartOptions.plugins.title, text: 'By Class' } }} />
            </div>
             <div className="chart">
                <h3 className="chart-title">By Membership</h3>
                <Pie data={memberData} options={{ ...chartOptions, title: { ...chartOptions.plugins.title, text: 'By Membership' } }} />
            </div>
        </div>
    );
};

export default AttendanceCharts; 