import jwt from "jsonwebtoken";
import UserToken from "../models/userToken.model";

const generateTokens = async (user: any) => {
	try {
		const payload = { ...user };
		const accessToken = jwt.sign(payload, "private_key", {
			expiresIn: "14m",
		});
		const refreshToken = jwt.sign(payload, "refresh_key", {
			expiresIn: "30d",
		});

		const userToken = await UserToken.findOne({
			userId: user._id,
			token: refreshToken,
		});
		if (userToken) {
			await userToken.deleteOne();
		}

		await new UserToken({ userId: user._id, token: refreshToken }).save();

		return Promise.resolve({ accessToken, refreshToken });
	} catch (error) {
		return Promise.reject(error);
	}
};

export default generateTokens;
