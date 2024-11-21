import { Category } from "../models/category-models.js";
export class CategoryController {
    static async createCategory(req, res) {
        try {
            const category = await Category.create(req.body);
            res.status(201).json(category);
        }
        catch (error) {
            res.status(500).json({ message: "Ошибка при создании категории", error });
        }
    }
    static async getAllCategories(req, res) {
        try {
            const categories = await Category.findAll();
            res.status(200).json(categories);
        }
        catch (error) {
            console.error("Ошибак поиска категории:", error);
            res.status(500).json({ message: "Ошибак поиска категории", error });
        }
    }
    static async getCategoryById(req, res) {
        try {
            const { id } = req.params;
            const category = await Category.findByPk(id);
            if (!category) {
                return res.status(404).json({ message: "Категория не найдена" });
            }
            res.status(200).json(category);
        }
        catch (error) {
            console.error("Ошибак создания категории:", error);
            res.status(500).json({ message: "Ошибак поиска категории", error });
        }
    }
    static async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const { name, parentId } = req.body;
            const category = await Category.findByPk(id);
            if (!category) {
                return res.status(404).json({ message: "Категории не найдена" });
            }
            await category.update({ name, parentId });
            res.status(200).json({ message: "Категория успешно обновленна", category });
        }
        catch (error) {
            console.error("Ошибка обновления категории:", error);
            res.status(500).json({ message: "Ошибка обновления категории", error });
        }
    }
    static async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            const category = await Category.findByPk(id);
            if (!category) {
                return res.status(404).json({ message: "Категория не найдена" });
            }
            await category.destroy();
            res.status(200).json({ message: "Категория удалена успешно" });
        }
        catch (error) {
            console.error("Ошибка удаления категории:", error);
            res.status(500).json({ message: "Ошибка удаления категории", error });
        }
    }
}
