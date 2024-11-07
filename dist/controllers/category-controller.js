import { Category } from "../models/category-models.js";
export class CategoryController {
    static async createCategory(req, res) {
        try {
            const category = await Category.create(req.body);
            res.status(201).json(category);
        }
        catch (error) {
            res.status(500).json({ message: "Error creating category", error });
        }
    }
    static async getCategory(req, res) {
        try {
            const category = await Category.findByPk(req.params.id);
            if (!category)
                return res.status(404).json({ message: "Category not found" });
            res.status(200).json(category);
        }
        catch (error) {
            res.status(500).json({ message: "Error retrieving category", error });
        }
    }
}
