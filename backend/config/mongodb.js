import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB Connected");
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1); // quitte le process si la connexion échoue
  }

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected!");
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB error:", err);
  });
};

export default connectDB;
