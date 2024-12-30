import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import errorMiddleware from "../middlewares/errorMiddleware.js";
import User from "../models/userSchema.js";

import { v2 as cloudinary } from "cloudinary";

//register a user method
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      password,
      role,
      firstNiche,
      secondNiche,
      thirdNiche,
      coverLetter,
    } = req.body;

    //check if all fields are entered
    if (
      !name ||
      !email ||
      !phone ||
      !address ||
      !password ||
      !role ||
      !coverLetter
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
      // return next(new Errorhandler("Please enter all fields", 400));
    }
    //check if role is Seeker
    if (role === "Seeker" && (!firstNiche || !secondNiche || !thirdNiche)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter your prefered niches" });
      // return next(new errorMiddleware("Please enter all niches", 400));
    }

    //check if user already exists
    const existingUser = await User.findOne({ email });

    //check if user already exists
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with the email already exists",
      });
      // // return next(new Errorhandler("User with the email already exists", 400));
      // return next(new errorMiddleware("Email is already registered.", 400));
    }

    //create user
    const userData = {
      name,
      email,
      phone,
      address,
      password,
      role,
      niches: { firstNiche, secondNiche, thirdNiche },
      coverLetter,
    };

    //upload resume to cloud

    if (req.files && req.files.resume) {
      //upload resume to cloud
      const { resume } = req.files;
      //upload resume to cloud
      if (resume) {
        try {
          const cloudinaryResponse = await cloudinary.uploader.upload(
            resume.tempFilePath,
            { folder: "Job_Seekers_Resume" }
          );
          //check if upload was successful
          if (!cloudinaryResponse || cloudinaryResponse.error) {
            return res.status(400).json({
              success: false,
              message:
                "Failed to upload resume to cloud: " +
                cloudinaryResponse.error.message,
            });
            // return next(
            //   new Errorhandler(
            //     "Failed to upload resume to cloud: " +
            //       cloudinaryResponse.error.message,
            //     400
            //   )
            // );
          }
          userData.resume = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
          };
        } catch (error) {
          return res.status(400).json({
            success: false,
            message:
              "Failed to upload resume to cloud: " +
              cloudinaryResponse.error.message,
          });
          // return next(
          //   new Errorhandler(
          //     "Failed to upload resume to cloud: " + error.message,
          //     500
          //   )
          // );
        }
      }
    }
    //save user
    const registerUser = await User.create(userData);
    //send response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      registerUser,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to upload resume to cloud: " + error,
    });
  }
});
