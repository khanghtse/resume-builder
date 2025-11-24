import mongoose from "mongoose";

const connectDB = async () => {
  try {
    let mongodbURI = process.env.MONGODB_URI;
    const projectName = "resume-builder";

    if (!mongodbURI) {
      throw new Error("MongoDB URI is not defined in environment variables");
    }

    // Nếu URI đã có database (ví dụ: mongodb+srv://.../myDB?...) thì giữ nguyên,
    // ngược lại thêm projectName vào cuối (loại bỏ slash thừa).
    const cleaned = mongodbURI.replace(/\/+$/, ""); // remove trailing slashes
    const hasDatabase = /\/[^/?]+/.test(cleaned.replace(/^mongodb(\+srv)?:\/\//, ""));

    const uri = hasDatabase ? mongodbURI : `${cleaned}/${projectName}`;

    // Lắng nghe trên mongoose.connection (không phải mongoose.connect)
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });
    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    // Kết nối (await promise)
    await mongoose.connect(uri);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    // Tuỳ app bạn có thể process.exit(1) nếu muốn dừng server khi không kết nối được
    // process.exit(1);
  }
};

export default connectDB;
