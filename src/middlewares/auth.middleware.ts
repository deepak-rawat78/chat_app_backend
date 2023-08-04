import jwt from "jsonwebtoken";

export const authenticate = (req: any, res: any, next: any) => {
	const token = req.header("x-access-token");
	if (!token) {
		return res.json({
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
		return res.json({ error: true, message: error.message });
	}
};
