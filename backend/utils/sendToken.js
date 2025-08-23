const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken(); // assuming this exists

  const options = {
    httpOnly: true,
    secure: true,            // Required for cross-origin cookies (Vercel → Render)
    sameSite: 'None',        // Allow cookies to be sent across different domains
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  };

  res.status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      user,
    });
};
