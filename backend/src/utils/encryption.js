const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';

// Derive a 32-byte key from the environment variable or use a fallback for dev
const getKey = () => {
    const key = process.env.ENCRYPTION_KEY || 'bareprop_default_secret_key_32b';
    return crypto.createHash('sha256').update(key).digest();
};

function encrypt(text) {
    if (!text) return text;
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    // Store IV with the encrypted text, separated by a colon
    return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
    if (!text) return text;
    // Check if text matches the encrypted format (iv:content)
    if (!text.includes(':')) return text; 

    try {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = textParts.join(':');
        const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error("Decryption failed (returning original):", error.message);
        return text;
    }
}

module.exports = { encrypt, decrypt };