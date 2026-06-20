import { Router } from "express";
import {
    changeCurrentPassword,
    getCurrentUser,
    loginUser,
    logoutUser,
    registerUser,
    updateAccountDetails,
    updateUserAvatar,
    updateCoverImage,
    getuserChannelProfile,
    getWatchHistory,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { refreshAccessToken } from "../controllers/user.controller.js";
import { uploadOnCloudinary } from "../models/cloudinary.js";
const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1,
        },
    ]),

    registerUser
);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-Token").post(refreshAccessToken);
router.route("/changed-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router
    .route("/avatar")
    .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
    .route("/cover-image")
    .patch(verifyJWT, upload.single("/coverImage"), updateCoverImage);

router.route("/c/:username").get(verifyJWT, getuserChannelProfile);
router.route("/watchHistory").get(verifyJWT, getWatchHistory);
export default router;
