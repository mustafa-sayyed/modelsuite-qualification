const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id, role, expires = '30m') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: expires });
};

// @desc  Register a new user
// @route POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
	const { name, email, password, role } = req.body;
	try {
		const userExists = await User.findOne({ email });
		if (userExists) {
			return res.status(400).json({ message: "User already exists" });
		}
		const salt = await bcrypt.genSalt(8);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = await User.create({
      name,
			email,
			password: hashedPassword,
			role,
		});
    const accessToken = generateToken(user._id, user.role);
    const refreshToken = generateToken(user._id, user.role, "7d");

    user.refreshToken = refreshToken;
    await user.save();

		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			accessToken,
			refreshToken,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc  Login user
// @route POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = generateToken(user._id, user.role);
    const refreshToken = generateToken(user._id, user.role, '7d');

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
      refreshToken,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Refresh access token
// @route POST /api/auth/refresh
// @access Public
const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    res.json({
      accessToken: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(403).json({ message: error.message ?? 'Invalid or expired refresh token' });
  }
};

// @desc  Logout user
// @route POST /api/auth/logout
// @access Public
const logoutUser = async (req, res) => {
	try {
		const { refreshToken } = req.body;

		if (refreshToken) {
			await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
		}

		res.json({ message: "Logged out successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message || "Logout failed" });
	}
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
};
