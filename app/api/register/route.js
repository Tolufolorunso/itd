import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Registration from '@/app/models/Registration';

export async function POST(request) {
    try {
        const { name, barcode, gender, class: className, member } = await request.json();

        if (!name) {
            return NextResponse.json(
                { message: 'Name is required' },
                { status: 400 }
            );
        }

        if (!barcode || barcode.length !== 8) {
            return NextResponse.json(
                { message: 'Barcode must be exactly 8 characters' },
                { status: 400 }
            );
        }

        await connectMongoDB();

        const registration = await Registration.create({
            name,
            barcode,
            gender,
            class: className,
            member,
        });

        return NextResponse.json(
            { message: 'Registration successful', registration },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { message: 'Failed to register' },
            { status: 500 }
        );
    }
} 