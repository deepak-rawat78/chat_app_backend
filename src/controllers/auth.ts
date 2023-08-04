import { log } from "console";
import User from "../models/user.model";
import {
	loginBodyValidation,
	refreshTokenBodyValidation,
	signUpBodyValidation,
} from "../validations/validationSchema";
import bcrypt from "bcrypt";
import generateTokens from "../utils/generateTokens";
import UserToken from "../models/userToken.model";
import jwt from "jsonwebtoken";

export const signUpController = async (req: any, res: any) => {
	try {
		const data = signUpBodyValidation(req.body);

		if (data.error) {
			return res.json({ error: data?.error });
		}
		let user = await User.findOne({ email: req.body.email });

		if (user) {
			return res.json({
				error: "User already exist",
			});
		}
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(req.body.password, salt);
		user = await new User({
			...req.body,
			password: hashPassword,
		}).save();

		res.status(201).json({
			error: false,
			message: "Account created successfully.",
		});
	} catch (error) {
		return res.json({ error: "Something went wrong." });
	}
};

export const loginController = async (req: any, res: any) => {
	try {
		const { error } = loginBodyValidation(req.body);
		if (error) {
			return res.json({ error });
		}
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			return res.json({
				error: "Invalid email or password",
			});
		}

		const verifiedPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!verifiedPassword) {
			return res.json({
				error: "Invalid password",
			});
		}
		const { accessToken, refreshToken } = await generateTokens(user);
		return res.json({
			error: false,
			accessToken,
			refreshToken,
			message: "Logged in successfully",
		});
	} catch (error) {
		return res.json({
			error: "Something went wrong",
		});
	}
};

export const getAccessToken = async (req: any, res: any) => {
	try {
		const { error } = refreshTokenBodyValidation(req.body);
		if (error) {
			return res.json({
				error: true,
				message: error.details[0].message,
			});
		}
		verifyRefreshToken(req.body.refreshToken)
			.then((result: any) => {
				const { tokenDetails } = result;
				const payload = { ...tokenDetails?._doc };
				log(payload, result, tokenDetails, tokenDetails._doc._id);
				const accessToken = jwt.sign(payload, "private_key", {
					expiresIn: "14m",
				});

				return res.json({
					error: false,
					accessToken,
					message: "Access token created successfully",
				});
			})
			.catch((error: any) => {
				return res.json({
					error: true,
					message: error.message,
				});
			});
	} catch (error: any) {
		return res.json({
			error: true,
			message: "Something went wrong",
		});
	}
};

export const verifyRefreshToken = (refreshToken: any) => {
	const private_key = "refresh_key";
	return new Promise((resolve, reject) => {
		UserToken.findOne({ token: refreshToken })
			.then((doc: any) => {
				if (!doc) {
					return reject({
						error: true,
						message: "Invalid refresh token",
					});
				}
				jwt.verify(
					refreshToken,
					private_key,
					(err: any, tokenDetails: any) => {
						if (err) {
							return reject({
								error: true,
								message: "Invalid refresh token",
							});
						}
						resolve({
							tokenDetails,
							error: false,
							message: "Valid refresh token",
						});
					}
				);
			})
			.catch((error: any) => {
				return reject({
					error: true,
					message: error.message,
				});
			});
	});
};

export const authenticate = (req: any, res: any, next: any) => {
	const token = req.header("x-access-token");
	if (!token) {
		return res.json({
			error: true,
			message: "Access Denied: No token provided",
		});
	}
	try {
		const tokenDetails = jwt.verify(token, "private_key");
		req.user = tokenDetails;
		next();
	} catch (error: any) {
		return res.json({ error: true, message: error.message });
	}
};
