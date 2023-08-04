import User from "../models/user.model";

export const getUserDetail = async (req: any, res: any) => {
	try {
		const user = await User.findById(req.user._id);
		if (!user) {
			return res.json({
				error: true,
				message: "User not found",
			});
		}
		return res.json({
			error: false,
			data: user,
		});
	} catch (error: any) {
		return res.json({
			error: true,
			message: error.message,
		});
	}
};
