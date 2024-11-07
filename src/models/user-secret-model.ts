import { DataType, Model, Column, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "./user-model.js";
import { v4 as uuidv4 } from "uuid";

@Table({
    tableName: "user_secrets",
    timestamps: false,
})
export class UserSecret extends Model {
   
}
