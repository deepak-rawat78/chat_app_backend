import jwt from "jsonwebtoken";
import UserToken from "../models/userToken.model";

export const ACCESS_TOKEN_EXPIRES_IN = "30m";
export const REFRESH_TOKEN_EXPIRES_IN = "30d";

const generateTokens = async (user: any) => {
	try {
		const payload = { _id: user._id, userName: user.userName };

		const accessToken = jwt.sign(
			payload,
			process.env.ACCESS_TOKEN_PRIVATE_KEY as string,
			{
				expiresIn: ACCESS_TOKEN_EXPIRES_IN,
			}
		);
		const refreshToken = jwt.sign(
			payload,
			process.env.REFRESH_TOKEN_PRIVATE_KEY as string,
			{
				expiresIn: REFRESH_TOKEN_EXPIRES_IN,
			}
		);

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
