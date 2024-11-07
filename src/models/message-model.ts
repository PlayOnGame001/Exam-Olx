import { DataType, Model, Column, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "./user-model.js";
import { Advert } from "./advert-model.js";
import { v4 as uuidv4 } from 'uuid'

@Table({
    tableName: "messages",
    timestamps: true,
})
export class Message extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
    })
    declare id: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        unique: true,
    })
    senderId!: number;
}
