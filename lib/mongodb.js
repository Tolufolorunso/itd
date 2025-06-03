import mongoose from 'mongoose';

const connectMongoDB = async () => {
    let mongodb_uri;
    if (process.env.NEXT_ENV === 'development') {
        mongodb_uri = process.env.MONGODB_URI_LOCAL;
    } else {
        mongodb_uri = process.env.MONGODB_URI;
    }
    try {
        await mongoose.connect(mongodb_uri);
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

export default connectMongoDB; 