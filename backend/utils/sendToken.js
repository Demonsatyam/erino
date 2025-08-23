const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken(); // ✅ make sure getJwtToken() exists

  const options = {
    httpOnly: true,
    secure: true, // ✅ IMPORTANT for HTTPS
    sameSite: 'None', // ✅ REQUIRED for cross-origin cookies
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      user,
    });
};

module.exports = sendToken;
