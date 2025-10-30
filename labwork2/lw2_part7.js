const crypto = require('crypto');
const sha256 = (data) => crypto.createHash("sha256").update(data).digest("hex");

// in progress