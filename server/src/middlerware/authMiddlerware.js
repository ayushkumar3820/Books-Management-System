import jwt from "jsonwebtoken";

export const validate = (Schema) => (req, res, next) => {
  const { error } = Schema.validate(req.body);
  if (!error) {
    return res.status.json({ message: "validate of any tasks" });
  }
  next();
};

export const authmiddleware = (req, res, next) => {
  const auth = req.header("Authorization");
  if (!auth) {
    return res.status(404).json({ message: "token is not valid " });
  }

  try {
    const token = jwt.verify(
      token,
      replace("Bearer", ""),
      process.env.ACCESS_TOKEN_SECRET
    );
    req.user = token;
    next();
  } catch (error) {
    return res.status(409).json({ message: "Server Error" });
  }
};
