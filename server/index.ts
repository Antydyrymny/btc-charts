import mongoose from 'mongoose';

export default async () => {
    const { mongodbUri } = useRuntimeConfig();

    try {
        await mongoose.connect(mongodbUri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error(error);
    }
};
