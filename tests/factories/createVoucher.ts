import { faker } from '@faker-js/faker';
import { Voucher } from '@prisma/client';

export default function createVoucher(){

    const voucher: Voucher = {
        id: faker.datatype.number(),
        code: faker.random.word(),
        discount: faker.datatype.number(),
        used: faker.datatype.boolean()
    };

    return voucher;

}