export class CaptchaValidarRq {
    captchaValueEncrypted : string;
    captchaValueTyped : string;
    response : CaptchaValidarRs;
}

export class CaptchaValidarRs {
    isValid: boolean;
}