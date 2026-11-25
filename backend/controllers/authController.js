import User from "../models/User.js";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

const isProduction = process.env.NODE_ENV === "production";

// Compare passwords
function isPasswordSame(password1, password2) {
  return password1 === password2;
}

// Generate Access Token
function generateAccessToken(payload) {
  return JWT.sign(payload, process.env.JWT_ACCESS_KEY, {
    expiresIn: "5m",
  });
}

// Generate Refresh Token
function generateRefreshToken(payload) {
  return JWT.sign(payload, process.env.JWT_REFRESH_KEY, {
    expiresIn: "7d",
  });
}

// Signup
const signup = async (req, res) => {
  try {
    let { username, password, confirm, classLevel } = req.body;

    if (!username || !password || !classLevel) {
      return res.status(400).json({
        error: "Please fill in all required fields.",
      });
    }

    username = username.trim();

    const key = username.toLowerCase();

    // Check if username already exists
    const existingUser = await User.findOne({ username: key });

    if (existingUser) {
      return res.status(400).json({
        error: "That username is already taken. Try another one.",
      });
    }

    // Validate password confirmation if provided
    if (confirm && !isPasswordSame(password, confirm)) {
      return res.status(400).json({
        error: "Passwords do not match!",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      username: key,
      displayName: username,
      password: hashedPassword,
      classLevel: Number(classLevel),
      refreshTokens: [],
    });

    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully!",
      user: {
        name: newUser.displayName,
        classLevel: newUser.classLevel,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      error: "Server error during registration.",
    });
  }
};

// Signin
const signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Please enter username and password.",
      });
    }

    const key = username.trim().toLowerCase();

    const foundUser = await User.findOne({ username: key });

    if (!foundUser) {
      return res.status(401).json({
        error: "Wrong username or password.",
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, foundUser.password);

    if (!isMatch) {
      return res.status(401).json({
        error: "Wrong username or password.",
      });
    }

    // Generate JWT payload
    const payload = {
      userId: foundUser._id,
      username: foundUser.username,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refresh token in database
    foundUser.refreshTokens.push(refreshToken);
    await foundUser.save();

    // Store refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful!",
      accessToken,
      user: {
        name: foundUser.displayName,
        classLevel: foundUser.classLevel,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);

    return res.status(500).json({
      error: "Server error during login.",
    });
  }
};

// Refresh Access Token
const refreshTokenController = async (req, res) => {
  try {
    const { refreshToken } = req.cookies || {};

    if (!refreshToken) {
      return res.status(401).json({
        error: "Refresh token is missing!",
      });
    }

    // Verify refresh token
    const decoded = JWT.verify(refreshToken, process.env.JWT_REFRESH_KEY);

    // Check whether token exists in database
    const foundUser = await User.findOne({
      _id: decoded.userId,
      refreshTokens: refreshToken,
    });

    if (!foundUser) {
      return res.status(401).json({
        error: "Invalid refresh token.",
      });
    }

    // Generate new access token
    const payload = {
      userId: foundUser._id,
      username: foundUser.username,
    };

    const accessToken = generateAccessToken(payload);

    return res.status(200).json({
      accessToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);

    return res.status(401).json({
      error: "Invalid or expired refresh token.",
    });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies || {};

    console.log("Logout API called");

    if (!refreshToken) {
      return res.status(401).json({
        error: "Refresh token is missing.",
      });
    }

    const result = await User.updateOne(
      {
        _id:
          req.user?.userId ||
          (
            await User.findOne({
              refreshTokens: refreshToken,
            })
          )?._id,
        refreshTokens: refreshToken,
      },
      {
        $pull: {
          refreshTokens: refreshToken,
        },
      },
    );

    console.log("MongoDB deletion result:", result);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({
      message: "Logged out successfully!",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      error: "Server error during logout.",
    });
  }
};

// Get Current Logged-in User
const me = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("-password -refreshTokens");

    if (!user) {
      return res.status(404).json({
        error: "No user found!",
      });
    }

    return res.status(200).json({
      user: {
        name: user.displayName,
        classLevel: user.classLevel,
      },
    });
  } catch (error) {
    console.error("Me route error:", error);

    return res.status(500).json({
      error: "Server error fetching user.",
    });
  }
};

export default {
  signup,
  signin,
  refreshTokenController,
  logout,
  me,
};
