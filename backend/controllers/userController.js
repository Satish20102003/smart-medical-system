import User from '../models/UserModel.js';

// @desc    Update User Password (Requires old password for verification)
// @route   PUT /api/auth/update-password
// @access  Private (Doctor or Patient)
export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 1. Verify current password matches the stored password
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ message: 'Invalid current password' });
    }
    
    // Simple check to prevent setting a blank or weak password
    if (newPassword.length < 8 || !/\d/.test(newPassword)) {
        return res.status(400).json({ message: 'New password must be 8+ chars and include a number.' });
    }

    // 2. Update password field (UserModel pre-save hook handles hashing)
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};