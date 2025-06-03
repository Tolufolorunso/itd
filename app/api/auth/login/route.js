import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { pin } = await request.json();
        const staffPin = process.env.ITD_STAFF_PIN;

        console.log('Login attempt:', {
            receivedPin: pin,
            expectedPin: staffPin,
            hasStaffPin: !!staffPin,
            env: process.env.NODE_ENV
        });

        if (!staffPin) {
            console.error('ITD_STAFF_PIN environment variable is not set');
            return NextResponse.json(
                { message: 'Server configuration error' },
                { status: 500 }
            );
        }

        if (pin === staffPin) {
            // Generate a simple token (in a real app, you'd want to use JWT)
            const token = Buffer.from(Date.now().toString()).toString('base64');
            return NextResponse.json({
                success: true,
                token: token
            });
        }

        return NextResponse.json(
            { message: 'Invalid PIN' },
            { status: 401 }
        );
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'Server error', error: error.message },
            { status: 500 }
        );
    }
} 