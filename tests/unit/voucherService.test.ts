import voucherService from '../../src/services/voucherService';
import voucherRepository from '../../src/repositories/voucherRepository';
import { Voucher } from '@prisma/client';

describe('voucherService Tests', ()=>{

    test('Should create voucher', async ()=>{

        const code = 'test';
        const discount = 10;

        jest.spyOn(voucherRepository, 'getVoucherByCode').mockResolvedValue(null);
        jest.spyOn(voucherRepository, 'createVoucher').mockResolvedValue({} as Voucher);

        const result = await voucherService.createVoucher(code, discount);
        expect(result).toBeUndefined();

    });

    test('Should return conflict error while trying to create voucher', async ()=>{

        const code = 'test';
        const discount = 10;

        const voucher: Voucher = {
            id: 1,
            code,
            discount,
            used: false
        }

        jest.spyOn(voucherRepository, 'getVoucherByCode').mockResolvedValue(voucher);
        jest.spyOn(voucherRepository, 'createVoucher').mockResolvedValue({} as Voucher);

        try {
            await voucherService.createVoucher(code, discount);
        } catch (err) {
            expect(err).toEqual({ type: 'conflict', message: 'Voucher already exist.' });
        }

    });

    test('Should apply voucher', async ()=>{

        const code = 'test';
        const discount = 10;
        const amount = 1000;

        const voucher: Voucher = {
            id: 1,
            code,
            discount,
            used: false
        }

        jest.spyOn(voucherRepository, 'getVoucherByCode').mockResolvedValue(voucher);
        jest.spyOn(voucherRepository, 'useVoucher').mockResolvedValue({} as Voucher);

        const result = await voucherService.applyVoucher(code, amount);
        expect(result).toEqual({
            amount,
            discount,
            finalAmount: 900,
            applied: true
        });

    });

    test('Should return conflict error while trying to apply voucher', async ()=>{

        const code = 'test';
        const discount = 10;
        const amount = 1000;

        jest.spyOn(voucherRepository, 'getVoucherByCode').mockResolvedValue(null);
        jest.spyOn(voucherRepository, 'useVoucher').mockResolvedValue({} as Voucher);

        try {
            await voucherService.applyVoucher(code, amount);
        } catch (err) {
            expect(err).toEqual({ type: 'conflict', message: 'Voucher does not exist.' });
        }

    });

    test('Should not apply voucher', async ()=>{

        const code = 'test';
        const discount = 10;
        const amount = 50;

        const voucher: Voucher = {
            id: 1,
            code,
            discount,
            used: false
        }

        jest.spyOn(voucherRepository, 'getVoucherByCode').mockResolvedValue(voucher);
        jest.spyOn(voucherRepository, 'useVoucher').mockResolvedValue({} as Voucher);

        const result = await voucherService.applyVoucher(code, amount);
        expect(result).toEqual({
            amount,
            discount,
            finalAmount: amount,
            applied: false
        });

    });

});