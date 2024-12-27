const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Récupération du token
  
  if (!token) {
    return res.status(401).json({ message: "Accès non autorisé. Token manquant." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Décoder le token avec le secret
    req.userID = decoded.id; // Attachez l'ID utilisateur à la requête
    next(); // Passez au middleware suivant
  } catch (error) {
    res.status(401).json({ message: "Accès non autorisé. Token invalide." });
  }
};

module.exports = authenticateUser;
