import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";
import {Length, IsNotEmpty} from "class-validator";
import * as bcrypt from "bcryptjs";

@Entity()
@Unique(["email"])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, unique: true})
    @IsNotEmpty()
    @Length(4, 20)
    email: string;

    @Column({nullable: false})
    @IsNotEmpty()
    firstName: string;

    @Column({nullable: false})
    @IsNotEmpty()
    lastName: string;

    @Column({nullable: false})
    @IsNotEmpty()
    @Length(4, 100)
    password: string;

    @Column({nullable: false, unique: true})
    @IsNotEmpty()
    contactNo: string;

    @Column({nullable: false})
    @IsNotEmpty()
    role: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}