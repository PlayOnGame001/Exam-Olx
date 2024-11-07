import { Message } from "../models/message-model.js";
export class MessageController {
    static async getMessage(req, res) {
        try {
            const message = await Message.findByPk(req.params.id);
            if (!message)
                return res.status(404).json({ message: "Message not found" });
            res.status(200).json(message);
        }
        catch (error) {
            res.status(500).json({ message: "Error retrieving message", error });
        }
    }
}
