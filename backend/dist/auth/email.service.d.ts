export declare class EmailService {
    private transporter;
    constructor();
    sendResetPasswordEmail(email: string, resetToken: string): Promise<void>;
}
