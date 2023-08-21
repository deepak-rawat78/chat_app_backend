import Message from "../models/message.modal";

export const getChatMessageList = async (req: any, res: any) => {
	try {
		const { peerId, skip, limit } = req.query;
		const userId = req.user._id;

		const messageList = await Message.find(
			{ sender: userId, receiver: peerId },
			'-__v',
			{ skip, limit }
		).populate([
			{ path: "sender", select: "-password -__v -contacts" },
			{ path: "receiver", select: "-password -__v -contacts" },
		]);
		const total = await Message.countDocuments({
			sender: userId,
			receiver: peerId,
		});
		return res.json({
			error: false,
			data: messageList,
			total,
		});
	} catch (error) {
		return res.status(400).json({ error: true, message: error.message });
	}
};
