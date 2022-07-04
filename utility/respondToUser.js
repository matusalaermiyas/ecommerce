module.exports = (res, details, type='error', url='/all') =>
  res.cookie("type", type).cookie("details", details).redirect(url);
