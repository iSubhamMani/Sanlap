const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

export default secretKey;
