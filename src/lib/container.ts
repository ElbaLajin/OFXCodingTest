import { IPaymentRepository, PaymentRepository } from '../repositories/PaymentRepository';
import { IPaymentService, PaymentService } from '../services/PaymentService';
import { Logger, ConsoleLogger } from './logger';

export interface Container {
    paymentRepository: IPaymentRepository;
    paymentService: IPaymentService;
    logger: Logger;
}

export const createContainer = (): Container => {
    const logger = new ConsoleLogger('PaymentsAPI');
    const paymentRepository = new PaymentRepository('Payments', logger);
    const paymentService = new PaymentService(paymentRepository, logger);

    return {
        paymentRepository,
        paymentService,
        logger
    };
};

