const mongoose = require("mongoose");
const seedAdmin = require("./seedAdmin");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Auto-create the admin account if it doesn't exist yet
        await seedAdmin();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
