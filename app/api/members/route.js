import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Registration from '@/app/models/Registration';

export async function GET(request) {
    try {
        const authToken = request.headers.get('Authorization');
        if (!authToken) {
            return NextResponse.json(
                { message: 'Authentication required' },
                { status: 401 }
            );
        }

        await connectMongoDB();

        const registrations = await Registration.find({})
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(registrations);
    } catch (error) {
        console.error('Error fetching registrations:', error);
        return NextResponse.json(
            { message: 'Failed to fetch registrations' },
            { status: 500 }
        );
    }
} 