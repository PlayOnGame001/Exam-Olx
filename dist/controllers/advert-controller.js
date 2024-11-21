import { Advert } from "../models/advert-model.js";
import { Op } from "sequelize";
export class AdvertController {
    static async createAdvert(req, res) {
        try {
            const listing = await Advert.create(req.body);
            res.status(201).json(listing);
        }
        catch (error) {
            res.status(500).json({ message: "Ошибка прослушивание не найдено", error });
        }
    }
    static async getListing(req, res) {
        try {
            const listing = await Advert.findByPk(req.params.id);
            if (!listing)
                return res.status(404).json({ message: "Ошибка" });
            res.status(200).json(listing);
        }
        catch (error) {
            res.status(500).json({ message: "Ошибка получения данных о компании.", error });
        }
    }
    static async getAdvertById(req, res) {
        try {
            const { id } = req.params;
            const advert = await Advert.findByPk(id);
            if (!advert) {
                return res.status(404).json({ message: "Объявление не найдено" });
            }
            res.status(200).json(advert);
        }
        catch (error) {
            console.error("Ошибка при загрузке объявления.:", error);
            res.status(500).json({ message: "Ошибка при загрузке объявления.", error });
        }
    }
    static async getAllAdverts(req, res) {
        try {
            const adverts = await Advert.findAll();
            res.status(200).json(adverts);
        }
        catch (error) {
            console.error("Ошибка при загрузке объявления.:", error);
            res.status(500).json({ message: "Ошибка при загрузке объявления.", error });
        }
    }
    static async updateAdvert(req, res) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const { title, description, category, price, location } = req.body;
            const advert = await Advert.findByPk(id);
            if (!advert) {
                return res.status(404).json({ message: "Объявление не найдено" });
            }
            if (advert.userId !== userId) {
                return res.status(403).json({ message: "Вы не авторизированы чтобы слать запрос" });
            }
            await advert.update({ title, description, category, price, location });
            res.status(200).json({ message: "Объявление успешно обновленно", advert });
        }
        catch (error) {
            console.error("Ошибка при загрузке объявления.:", error);
            res.status(500).json({ message: "Ошибка обновления объявления", error });
        }
    }
    static async deleteAdvert(req, res) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const advert = await Advert.findByPk(id);
            if (!advert) {
                return res.status(404).json({ message: "Объявление не найдено" });
            }
            if (advert.userId !== userId) {
                return res.status(403).json({ message: "Вы не авторизированы для того чтобы удалить" });
            }
            await advert.destroy();
            res.status(200).json({ message: "Объявление удалено" });
        }
        catch (error) {
            console.error("Ошибка при удалении:", error);
            res.status(500).json({ message: "Ошибка при удалении объявления", error });
        }
    }
    static async searchAdverts(req, res) {
        try {
            const { category, location, priceMin, priceMax, keyword, sortBy = "createdAt", order = "DESC", } = req.query;
            const whereConditions = {};
            if (category) {
                whereConditions.category = category;
            }
            if (location) {
                whereConditions.location = location;
            }
            if (priceMin) {
                whereConditions.price = { [Op.gte]: parseFloat(priceMin) };
            }
            if (priceMax) {
                whereConditions.price = {
                    ...whereConditions.price,
                    [Op.lte]: parseFloat(priceMax),
                };
            }
            if (keyword) {
                whereConditions[Op.or] = [
                    { title: { [Op.like]: `%${keyword}%` } },
                    { description: { [Op.like]: `%${keyword}%` } },
                ];
            }
            const adverts = await Advert.findAll({
                where: whereConditions,
                order: [[sortBy, order]],
            });
            res.status(200).json(adverts);
        }
        catch (error) {
            console.error("Ошибка поиска объявления:", error);
            res.status(500).json({ message: "Ошибка при поиске объявления", error });
        }
    }
}
