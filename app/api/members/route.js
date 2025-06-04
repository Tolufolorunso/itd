import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Registration from '@/app/models/Registration';

export async function GET() {
    try {
        await connectMongoDB();
        const registrations = await Registration.find().sort({ createdAt: -1 });

        // console.log(registrations);


        const response = NextResponse.json(registrations);
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
        return response;
    } catch (error) {
        // console.error('Error fetching registrations:', error);
        return NextResponse.json(
            { message: 'Failed to fetch registrations' },
            { status: 500 }
        );
    }
} 