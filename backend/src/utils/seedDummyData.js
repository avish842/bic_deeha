import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns";
import path from "path";
import { fileURLToPath } from "url";
import Student from "../models/Student.model.js";
import Staff from "../models/Staff.model.js";
import Notice from "../models/Notice.model.js";
import Achievement from "../models/Achievement.model.js";
import GalleryCategory from "../models/GalleryCategory.model.js";
import Gallery from "../models/Gallery.model.js";
import { PRIORITY, ACHIEVEMENT_TYPE } from "../constants/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const seedDB = async () => {
  try {
    console.log("Connecting to Database: ", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Seed script connected to MongoDB");

    // Clear existing dummy targeted models
    console.log("Clearing old data...");
    await Student.deleteMany({});
    await Notice.deleteMany({});
    await Achievement.deleteMany({});
    await Gallery.deleteMany({});
    await GalleryCategory.deleteMany({});
    await Staff.deleteMany({});

    // 1. Seed Notices
    console.log("Seeding Notices...");
    const notices = [
      {
        title: "Welcome to Balbhadra Inter College",
        description: "Welcome to our new digital presence! Established in 1965, we continue our commitment to education in Prayagraj Division.",
        priority: PRIORITY.HIGH,
        isActive: true,
      },
      {
        title: "Admissions Open",
        description: "Admissions are now open for all classes. Please visit the college office during working hours for more details.",
        priority: PRIORITY.NORMAL,
        isActive: true,
      }
    ];
    await Notice.insertMany(notices);

    // 2. Seed Staff
    console.log("Seeding Staff from College Records (Images)...");
    const staffRecords = [
      { name: "RAM KUMAR", designation: "Head clerk", experience: 228, subjects: [], qualification: "12th" },
      { name: "BRIJESH BAHADUR SINGH", designation: "Assistant Teacher(LT)", experience: 456, subjects: ["English", "Social Science", "Sanskrit"], qualification: "Post Graduate" },
      { name: "RAMESH CHANDRA", designation: "Fourth class", experience: 180, subjects: [], qualification: "Others" },
      { name: "PARAS NATH YADAV", designation: "Fourth class", experience: 113, subjects: [], qualification: "10th" },
      { name: "SHIV KUMAR SINGH", designation: "Fourth class", experience: 99, subjects: [], qualification: "Graduate" },
      { name: "BHARAT SINGH", designation: "Fourth class", experience: 216, subjects: [], qualification: "12th" },
      { name: "PAWAN KUMAR SINGH", designation: "Fourth class", experience: 113, subjects: [], qualification: "Others" },
      { name: "SANJAY KUMAR SINGH", designation: "Assistant Teacher(LT)", experience: 192, subjects: ["Games", "Hindi", "Home Science"], qualification: "Post Graduate" },
      { name: "NEERAJ KUMAR SINGH", designation: "Assistant Teacher(LT)", experience: 31, subjects: ["Painting", "Maths", "Hindi"], qualification: "Diploma" },
      { name: "NEELIMA SINGH", designation: "Assistant Teacher(LT)", experience: 53, subjects: ["Painting", "English", "Home Science"], qualification: "Diploma" }
    ];
    await Staff.insertMany(staffRecords);

    // 3. Seed Achievements
    console.log("Seeding Achievements...");
    const achievements = [
      {
        title: "Established in 1965",
        description: "Balbhadra Inter College was founded in Deeha, Kunda, Pratapgarh to serve the local community.",
        type: ACHIEVEMENT_TYPE.COLLEGE,
        date: new Date("1965-01-01")
      },
      {
        title: "Officially Recognized",
        description: "The college was officially recognized in 1972 and operates as an aided institution.",
        type: ACHIEVEMENT_TYPE.COLLEGE,
        date: new Date("1972-01-01")
      }
    ];
    await Achievement.insertMany(achievements);

    console.log("🎉 College real data seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDB();
