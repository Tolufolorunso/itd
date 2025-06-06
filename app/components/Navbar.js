'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const pathname = usePathname();

    const navLinks = [
        { href: '/register', label: 'Register' },
        { href: '/members', label: 'Members' },
        { href: '/attendance', label: 'Attendance' },
    ];

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link href="/" className="navbar-brand">
                    ITD{new Date().getFullYear()}
                </Link>
                <div className="navbar-links">
                    {navLinks.map(link => (
                        <Link key={link.href} href={link.href} className={`navbar-link ${pathname === link.href ? 'active' : ''}`}>
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 