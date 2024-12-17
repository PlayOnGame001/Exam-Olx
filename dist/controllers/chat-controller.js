import { Message } from "../models/chat-model.js";
import { User } from "../models/user-model.js";
import { Advert } from "../models/advert-model.js";
export class MessageController {
    static async sendMessage(req, res) {
        try {
            const senderId = req.user.userId;
            const { receiverId, advertId, content } = req.body;
            const advert = await Advert.findByPk(advertId);
            if (!advert) {
                return res.status(404).json({ message: "Объявление не найдено" });
            }
            const receiver = await User.findByPk(receiverId);
            if (!receiver) {
                return res.status(404).json({ message: "Получатель не найден" });
            }
            const message = await Message.create({
                senderId,
                receiverId,
                advertId,
                content,
            });
            res.status(201).json({ message: "Сообщение успешно отправлено", data: message });
        }
        catch (error) {
            res.status(500).json({ message: "Ошибка отправки сообщения", error });
        }
    }
    static async getMessages(req, res) {
        try {
            const userId = req.user.userId;
            const { otherUserId, advertId } = req.query;
            const messages = await Message.findAll({
                where: {
                    advertId,
                    senderId: [userId, otherUserId],
                    receiverId: [userId, otherUserId],
                },
                order: [["createdAt", "ASC"]],
            });
            res.status(200).json({ messages });
        }
        catch (error) {
            console.error("Ошибка при получении сообщений.:", error);
            res.status(500).json({ message: "Ошибка при получении сообщений.", error });
        }
    }
    static async deleteMessage(req, res) {
        try {
            const userId = req.user.userId;
            const { messageId } = req.params;
            const message = await Message.findByPk(messageId);
            if (!message || (message.senderId.toString() !== userId && message.receiverId.toString() !== userId)) {
                return res.status(404).json({ message: "Сообщение не найдено или доступ запрещен" });
            }
            await message.destroy();
            res.status(200).json({ message: "Сообщение успешно удалено" });
        }
        catch (error) {
            console.error("Ошибка удаления сообщения:", error);
            res.status(500).json({ message: "Ошибка удаления сообщения", error });
        }
    }
}
