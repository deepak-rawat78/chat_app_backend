import jwt from "jsonwebtoken";

export const authenticate = (req: any, res: any, next: any) => {
	const token = req.header("authorization");

	if (!token) {
		return res.status(401).json({
			error: true,
			message: "Access Denied: No token provided",
		});
	}
	try {
		const tokenDetails = jwt.verify(
			token,
			process.env.ACCESS_TOKEN_PRIVATE_KEY as string
		);
		req.user = tokenDetails;
		next();
	} catch (error: any) {
		return res.status(400).json({ error: true, message: error.message });
	}
};
