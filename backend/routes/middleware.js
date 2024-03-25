export const sync = f => (req, res, next) => f(req, res, next).catch(next);

export const checkAuth = sync(async (req, res, next) => {
  if (!req.session.user)
    return res.status(401).json({ error: 'Not logged in.' })
  next();
});
