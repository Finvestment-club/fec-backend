import { catchASyncError } from "../middlewares/catchASyncError.js";
import ErrorHandler from "../middlewares/error.js";
import User from "../models/userSchema.js";
import { sendToken } from "../utils/jwtTokens.js";
import { Socials } from "../models/socialSchema.js";
import cloudinary from "cloudinary";
import { getSingleArtical } from "./ArticalController.js";

export const Socialpost = catchASyncError(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            success: false,
            message: "images Required!",
        });
    }
    const { images } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(images.mimetype)) {
        return next(
            // new ErrorHandler("Invalid file type. Please upload a PNG file.", 400)
            res.status(400).json({
                success: false,
                message: "Invalid file type. Please upload a PNG file.",
            })
        );
    }
    console.log("images:", images);

    if (images && images.mimetype) {
        // Access the mimetype property only if 'resume' is defined
        // and has a 'mimetype' property
        const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
        if (!allowedFormats.includes(images.mimetype)) {
            return next(
                // new ErrorHandler("Invalid file type. Please upload a PNG file.", 400)
                res.status(400).json({
                    success: false,
                    message: "Invalid file type. Please upload a PNG file.",
                })
            );
        }
        // Rest of your code for Cloudinary upload
    } else {
        return res.status(400).json({
            success: false,
            message: "images file is missing.",
        });
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
        images.tempFilePath
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error(
            "Cloudinary Error:",
            cloudinaryResponse.error || "Unknown Cloudinary error"
        );

        return res.status(500).json({
            success: false,
            message: "Failed to upload images to Cloudinary",
        });
    }
    const postedBy = req.user.id;
    const { name, title, links } = req.body;
    if (!name || !title || !links || !images) {
        // return next(new ErrorHandler("Please fill all fields.", 400));
        return res.status(400).json({
            success: false,
            message: "Please fill all fields.",
        });
    }

    const social = await Socials.create({
        name,
        title,
        links,
        postedBy,
        images: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });
    res.status(200).json({
        success: true,
        message: "social post Submitted!",
        social,
    });
});

export const getSocials = catchASyncError(async (req, res, next) => {
    const socials = await Socials.find();
    res.status(200).json(socials);
});

export const updateSocials = catchASyncError(async (req, res, next) => {
    const { id } = req.params;
    let social = await Socials.findById(id);
    if (!social) {
        return next(new ErrorHandler("Social not found.", 404));
    }
    // make sure user is the owner of the social media post and has the right to update it
    // const {images}=req.body
    if (social.postedBy != req.user.id) {
        return next(
            new ErrorHandler("You are not allowed to perform this action.", 401)
        );
    }
    const updatedSocial = await Socials.findByIdAndUpdate(id, req.body, {
        new: true,
    });
    res.status(200).json({
        success: true,
        message: "Social post updated!",
        updatedSocial,
    });
});

export const deleteSocials = catchASyncError(async (req, res, next) => {
    const { id } = req.params;
    let social = await Socials.findById(id);

    if (!social) {
        return next(new ErrorHandler("Social not found.", 404));
    }

    if (social.postedBy != req.user.id) {
        return next(
            new ErrorHandler("You are not allowed to perform this action.", 401)
        );
    }

    // Delete image from Cloudinary - in case user wants to delete the image but keep the Social Post
    try {
        const public_id = social.images.public_id;
        await cloudinary.uploader.destroy(public_id);
    } catch (err) {
        console.error("Cloudinary Error:", err);
        return next(
            new ErrorHandler("Failed to delete image from Cloudinary", 500)
        );
    }

    await Socials.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "Social post deleted!",
    });
});

export const getSingleSocial = catchASyncError(async (req, res, next) => {
    const { id } = req.params;
    console.log("id:", id);
    try {
        const Social = await Socials.findById(id);
        console.log("Social:", Social);
        if (!Social) {
            // return next(new ErrorHandler("Job not found.", 404));
            return res.status(404).json({
                success: false,
                message: "Social Post not found.",
            });
        }
        res.status(200).json({
            success: true,
            Social,
        });
    } catch (error) {
        console.log("error:", error);
        // return next(new ErrorHandler(`Invalid ID / CastError`, 404));
        return res.status(404).json({
            success: false,
            message: `Invalid ID / CastError`,
        });
    }
});

export const getMySocial = async (req, res, next) => {
    try {
        // Assuming you have authentication middleware that sets req.user properly
        const userId = req.user._id;
        console.log("userId: getMySocial", userId);

        // Fetch social media posts for the authenticated user
        const social = await Socials.find({ postedBy: userId });

        res.status(200).json({
            success: true,
            Social: social,
        });
    } catch (err) {
        // Pass the error to the error handling middleware
        next(err);
    }
};
