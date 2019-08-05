import {MigrationInterface, QueryRunner, getRepository} from "typeorm";
import {User} from "../entity/User";
import config from "../config/config";

export class CreateAdminUser1547919837483 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        let admin = new User();
        admin.email = "admin";
        admin.firstName = "Admin";
        admin.lastName = "Tan";
        admin.password = "admin";
        admin.hashPassword();
        admin.contactNo = "+6596959093"
        admin.role = config.roles.ADMIN;
        const userRepository = getRepository(User);
        await userRepository.save(admin);

        let client = new User();
        client.email = "zhenwei";
        client.firstName = "Zhen Wei";
        client.lastName = "Ow";
        client.password = "tantric";
        client.hashPassword();
        client.contactNo = "+6512345678"
        client.role = config.roles.CLIENT;
        await userRepository.save(client);

        let recruiter = new User();
        recruiter.email = "jess";
        recruiter.firstName = "Jess";
        recruiter.lastName = "Cheong";
        recruiter.password = "jess12345";
        recruiter.hashPassword();
        recruiter.contactNo = "+6587654321"
        recruiter.role = config.roles.RECRUITER;
        await userRepository.save(recruiter);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }
}