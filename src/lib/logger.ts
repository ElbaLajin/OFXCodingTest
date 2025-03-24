export interface Logger {
    debug(message: string, meta?: Record<string, any>): void;
    info(message: string, meta?: Record<string, any>): void;
    warn(message: string, meta?: Record<string, any>): void;
    error(message: string, meta?: Record<string, any>): void;
}

export class ConsoleLogger implements Logger {
    constructor(private readonly context: string) {}

    debug(message: string, meta?: Record<string, any>): void {
        console.debug(`[${this.context}] ${message}`, meta || '');
    }

    info(message: string, meta?: Record<string, any>): void {
        console.info(`[${this.context}] ${message}`, meta || '');
    }

    warn(message: string, meta?: Record<string, any>): void {
        console.warn(`[${this.context}] ${message}`, meta || '');
    }

    error(message: string, meta?: Record<string, any>): void {
        console.error(`[${this.context}] ${message}`, meta || '');
    }
}
