
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import {
  CreateProperty,
  GetAllProperties,
  UpdateProperty,
  DeleteProperty,
  GetPropertyById,
} from "./controllers/Property.js";

import {
  CreateRoom,
  GetAllRooms,
  UpdateRoom,
  DeleteRoom,
  GetRoomById,
} from "./controllers/Room.js";

import {
  RegisterUser,
  VerifyAccount,
  LoginUser,
  LogoutUser,
  GetAllUsers,
  DeleteUnverifiedUsers,
} from "./controllers/User.js";

import {
  CreateTenant,
  GetTenants,
  DeleteTenant,
  UpdateTenant,
} from "./controllers/Tenant.js";

import { verifyToken } from "./middleware/verifyToken.js";
import { CreateRent, GetAllRent } from "./controllers/Rent.js";

import {
  otpLimiter,
  RegisterLimiter,
  LoginLimiter,
} from "./middleware/rateLimit.js";

import {
  createTenantMember,
  updateTenantMember,
  GetTenantMemberById,
  GetTenantsMember,
  DeleteTenantMember,
} from "./controllers/TenantMember.js";

dotenv.config();

const app = express();

// --------------------------------------------------
// CORS CONFIGURATION
// --------------------------------------------------

const allowedOrigins = [
  "http://localhost",
  "https://localhost",
  "http://localhost:8100",
  "http://localhost:4200",
  "capacitor://localhost",
  "http://10.0.2.2",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header, such as native clients.
      // Keep authentication and authorization enforced by the API.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// --------------------------------------------------
// MIDDLEWARE
// --------------------------------------------------

app.use(express.json());
app.use(cookieParser());

// --------------------------------------------------
// HEALTH CHECK
// --------------------------------------------------

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Rent Management API is running",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend connection successful",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

// --------------------------------------------------
// PROPERTY ROUTES
// --------------------------------------------------

app.post("/CreateProperty", CreateProperty);
app.get("/GetAllProperties", GetAllProperties);
app.get("/GetPropertyById", GetPropertyById);
app.put("/UpdateProperty", UpdateProperty);
app.delete("/DeleteProperty", DeleteProperty);

// --------------------------------------------------
// ROOM ROUTES
// --------------------------------------------------

app.post("/CreateRoom", CreateRoom);
app.put("/UpdateRoom", UpdateRoom);
app.delete("/DeleteRoom", DeleteRoom);
app.get("/GetAllRooms", GetAllRooms);
app.get("/GetRoomById", GetRoomById);

// --------------------------------------------------
// RENT ROUTES
// --------------------------------------------------

app.post("/CreateRent", verifyToken, CreateRent);
app.get("/GetAllRent", verifyToken, GetAllRent);

// --------------------------------------------------
// TENANT MEMBER ROUTES
// --------------------------------------------------

app.post("/CreateTenantMember", createTenantMember);
app.put("/UpdateTenantMember", updateTenantMember);
app.get("/GetTenantMemberById", GetTenantMemberById);
app.get("/GetTenantMember", GetTenantsMember);
app.delete("/DeleteTenantMember", DeleteTenantMember);

// --------------------------------------------------
// TENANT ROUTES
// --------------------------------------------------

app.post("/CreateTenant", CreateTenant);
app.put("/UpdateTenant", UpdateTenant);
app.get("/GetTenants", GetTenants);
app.delete("/DeleteTenant", DeleteTenant);

// --------------------------------------------------
// USER / AUTHENTICATION ROUTES
// --------------------------------------------------

app.post("/RegisterUser", RegisterLimiter, RegisterUser);
app.post("/VerifyAccount", otpLimiter, verifyToken, VerifyAccount);
app.post("/LoginUser", LoginUser);
app.post("/LogoutUser", verifyToken, LogoutUser);
app.get("/GetAllUsers", verifyToken, GetAllUsers);

// --------------------------------------------------
// START SERVER AFTER MONGODB CONNECTS
// --------------------------------------------------

const PORT = Number(process.env.PORT) || 8081;

async function startServer() {
  try {
    await mongoose.connect(process.env.DB_URL);

    console.log("Connected to MongoDB");

    DeleteUnverifiedUsers();
    console.log("DeleteUnverifiedUsers is running");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Local API: http://localhost:${PORT}`);
      console.log(`Android emulator API: http://10.0.2.2:${PORT}`);
    });
  } catch (error) {
    console.error("Backend startup error:", error);
    process.exit(1);
  }
}

startServer();
