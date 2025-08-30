// node 18+ recommended
const crypto = require('crypto');
const { NFTStorage, File } = require('nft.storage');
require('dotenv').config();

const client = new NFTStorage({ token: process.env.NFT_STORAGE_KEY });

// encrypt a JS object with AES-256-GCM
function encryptJson(obj, key) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const data = Buffer.from(JSON.stringify(obj), 'utf8');
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    data: encrypted.toString('base64')
  };
}

async function uploadEncryptedMatch(matchObj, encryptionKeyBuffer) {
  const encrypted = encryptJson(matchObj, encryptionKeyBuffer);
  const blob = new Blob([JSON.stringify(encrypted)]);
  const cid = await client.storeBlob(blob);
  console.log('IPFS CID:', cid); // store this on chain
  return cid;
}

// Example usage:
(async () => {
  // 32-byte encryption key that you keep private (distribute to users out-of-band)
  const key = crypto.randomBytes(32);
  console.log('ENCRYPTION KEY (keep secret):', key.toString('hex'));

  const match = {
    userA: "0xabc...",
    userB: "0xdef...",
    score: 842,
    reason: "Common interests: hiking, chess; embedding similarity: 0.842"
  };

  const cid = await uploadEncryptedMatch(match, key);
  console.log('Encrypted CID -> pin on IPFS and write into Matchmaker.setMatch(...)');
})();
