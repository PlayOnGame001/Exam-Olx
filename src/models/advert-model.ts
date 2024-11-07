import { DataType, Model, Column, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "./user-model.js";
import { Category } from "./category-models.js";
import { v4 as uuidv4 } from 'uuid'

@Table({
    tableName: "listings",
    timestamps: true,
})
export class Advert extends Model {

}
