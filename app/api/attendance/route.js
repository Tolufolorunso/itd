import connectMongoDB from "@/lib/mongodb";
import ITDRegistration from "@/app/models/Registration";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectMongoDB();
        const { barcode } = await request.json();

        if (!barcode) {
            return NextResponse.json({ message: "Barcode is required." }, { status: 400 });
        }

        const registration = await ITDRegistration.findOne({ barcode });

        if (!registration) {
            return NextResponse.json({ message: "Participant not found." }, { status: 404 });
        }

        if (registration.isAttended) {
            return NextResponse.json({ message: `Participant ${registration.name} has already been marked as attended.` }, { status: 200 });
        }

        registration.isAttended = true;
        await registration.save();

        return NextResponse.json({ message: `Attendance marked for ${registration.name}.` }, { status: 200 });
    } catch (error) {
        console.error("Error updating attendance:", error);
        return NextResponse.json({ message: "An error occurred while updating attendance." }, { status: 500 });
    }
} 