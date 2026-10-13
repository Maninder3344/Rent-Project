import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
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
import cookieParser from "cookie-parser";
import {
  createTenantMember,
  updateTenantMember,
  GetTenantMemberById,
  GetTenantsMember,
  DeleteTenantMember
} from "./controllers/TenantMember.js";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: ["http://localhost:8100", "http://localhost:4200"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Property routes

app.post("/CreateProperty", CreateProperty);
app.get("/GetAllProperties", GetAllProperties);
app.get("/GetPropertyById", GetPropertyById);
app.put("/UpdateProperty", UpdateProperty);
app.delete("/DeleteProperty", DeleteProperty);

//room routes

app.post("/CreateRoom", CreateRoom);
app.put("/UpdateRoom", UpdateRoom);
app.delete("/DeleteRoom", DeleteRoom);
app.get("/GetAllRooms", GetAllRooms);
app.get("/GetRoomById", GetRoomById);

//rent routes
app.post("/CreateRent", verifyToken, CreateRent);
app.get("/GetAllRent", verifyToken, GetAllRent);

//member
app.post("/CreateTenantMember", createTenantMember);
app.put("/UpdateTenantMember", updateTenantMember);
app.get("/GetTenantMemberById", GetTenantMemberById);
app.get("/GetTenantMember", GetTenantsMember);
app.delete("/DeleteTenantMember",DeleteTenantMember);

// tenant routes
app.post("/CreateTenant", CreateTenant);
app.put("/UpdateTenant", UpdateTenant);
app.get("/GetTenants", GetTenants);
app.delete("/DeleteTenant", DeleteTenant);

//user routes
app.post("/RegisterUser", RegisterLimiter, RegisterUser);
app.post("/VerifyAccount", otpLimiter, verifyToken, VerifyAccount);
app.post("/LoginUser", LoginLimiter, LoginUser);
app.post("/LogoutUser", verifyToken, LogoutUser);
app.get("/GetAllUsers", verifyToken, GetAllUsers);




// Connect to MongoDB and start the server
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    // delete unverified users
    DeleteUnverifiedUsers();
    console.log("DeleteUnverifiedUsers is running"); // 1 min

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
