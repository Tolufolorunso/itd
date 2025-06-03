import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { pin } = await request.json();

        const staffPin = process.env.ITD_STAFF_PIN;

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
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        );
    }
} 