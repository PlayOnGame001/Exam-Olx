import { Request, Response } from "express";
import { Advert } from "../models/advert-model.js";

export class AdvertController {
    static async createListing(req: Request, res: Response) {
        try {
            const listing = await Advert.create(req.body);
            res.status(201).json(listing);
        } catch (error) {
            res.status(500).json({ message: "Error creating listing", error });
        }
    }

    static async getListing(req: Request, res: Response) {
        try {
            const listing = await Advert.findByPk(req.params.id);
            if (!listing) return res.status(404).json({ message: "Listing not found" });
            res.status(200).json(listing);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving listing", error });
        }
    }

}
