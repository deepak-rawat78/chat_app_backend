import Contact from "../models/contact.model";
import User from "../models/user.model";

export const getUserDetail = async (req: any, res: any) => {
	try {
		const user = await User.findById(req.user._id);

		if (!user) {
			return res.status(400).json({
				error: true,
				message: "User not found",
			});
		}
		return res.json({
			error: false,
			data: user,
		});
	} catch (error: any) {
		return res.status(400).json({
			error: true,
			message: error.message,
		});
	}
};

export const addContactToUser = async (req: any, res: any) => {
	try {
		const { peerUserName } = req.body;

		const user = await User.findOne({ userName: peerUserName });
		if (user) {
			const isContactAlreadyExist = await Contact.findOne({
				contact: user._id,
				userId: req.user._id,
			});

			if (isContactAlreadyExist) {
				return res.status(400).json({
					error: true,
					message: `${peerUserName} already exist in your contact.`,
				});
			}

			const contact = new Contact({
				contact: user._id,
				contactType: "individual",
				userId: req.user._id,
			});
			await contact.save();

			await User.updateOne(
				{ _id: req.user._id },
				{ $push: { contacts: contact._id } }
			);

			return res.json({
				error: false,
				message: "Successfully added user",
			});
		}
		return res.status(400).json({
			error: true,
			message: `${peerUserName} not found.`,
		});
	} catch (error) {
		return res.status(400).json({
			error: true,
			message: error.message,
		});
	}
};

export const getContactList = async (req: any, res: any) => {
	try {
		const { skip = 0, limit = 10 } = req.query;
		const contactList = await Contact.find(
			{
				userId: req.user._id,
			},
			"-userId -__v",
			{
				skip,
				limit,
			}
		).populate("contact", { password: 0, __v: 0, contacts: 0 });
		const total = await Contact.countDocuments({
			userId: req.user._id,
		});
		return res.json({
			error: false,
			data: { data: contactList ?? [], total },
		});
	} catch (error) {
		return res.status(400).json({
			error: true,
			message: error.message,
		});
	}
};
