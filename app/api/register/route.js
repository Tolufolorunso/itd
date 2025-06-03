import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import ITDRegistration from '@/app/models/Registration';

export async function POST(request) {
    try {
        const { name, barcode, gender, class: className, member } = await request.json();



        if (!name || !barcode) {
            return NextResponse.json(
                { message: 'Name, Barcode are required' },
                { status: 400 }
            );
        }

        if (!barcode || barcode.length !== 3) {
            return NextResponse.json(
                { message: 'Barcode must be exactly 3 characters' },
                { status: 400 }
            );
        }

        const isBarcodeExists = await ITDRegistration.findOne({ barcode: '20256' + barcode });

        if (isBarcodeExists) {
            return NextResponse.json(
                { message: 'Barcode already exists' },
                { status: 400 }
            );
        }



        await connectMongoDB();

        const registration = await ITDRegistration.create({
            name,
            barcode: '20256' + barcode,
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