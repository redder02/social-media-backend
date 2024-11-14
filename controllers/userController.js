const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        
        const hashedPassword = await bcrypt.hash(password, 10);
        // const hashedPassword = password
        const user = new User({
            username,
            email,
            password: hashedPassword  // Save hashed password
        });

        await user.save();
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid email' });

        // Check if password matches the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        // const isMatch = (user.password === password)
        if (!isMatch) return res.status(400).json({ msg: 'Invalid password' });

        // Generate JWT
        const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // const token = "test"
        res.json({ token });
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
};
