const bcrypt = require('bcrypt');
const saltRounds = 10; // Facteur de travail

const HashPassword = async (text : string) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(text, salt);
    return hashedPassword;
  } catch (error) {
    console.error('Erreur lors du hachage du mot de passe :', error);
    throw error;
  }
};