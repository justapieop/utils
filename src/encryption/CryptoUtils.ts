import { randomBytes, CipherGCM, createCipheriv, DecipherGCM, createDecipheriv, createHmac } from "crypto";

export class CryptoUtils {
    private static readonly INSTANCE: CryptoUtils = new CryptoUtils();
    private readonly IV_LENGTH: number = 12;
    private readonly AUTH_TAG_LENGTH: number = 16;

    public aesEncrypt(data: string, key: string): string {
        const iv: Buffer = randomBytes(this.IV_LENGTH);
        const encryptionKey: Buffer = Buffer.from(key, "hex");

        const cipher: CipherGCM = createCipheriv("aes-256-gcm", encryptionKey, iv);

        let encrypted: string = cipher.update(data, "utf-8", "hex");
        encrypted += cipher.final("hex");

        const tag: Buffer = cipher.getAuthTag();
        return iv.toString("hex") + tag.toString("hex") + encrypted;
    }

    public aesDecrypt(cipher: string, key: string): string {
        const ivHexLength: number = this.IV_LENGTH * 2;
        const encryptionKey: Buffer = Buffer.from(key, "hex");
        const authTagHexLength: number = this.AUTH_TAG_LENGTH * 2;
        const iv: Buffer = Buffer.from(cipher.substring(0, ivHexLength), "hex");
        const authTag: Buffer = Buffer.from(cipher.substring(ivHexLength, ivHexLength + authTagHexLength), "hex");
        const encryptedText: string = cipher.substring(ivHexLength + authTagHexLength);

        const decipher: DecipherGCM = createDecipheriv("aes-256-gcm", encryptionKey, iv);
        decipher.setAuthTag(authTag);
        let decrypted: string = decipher.update(encryptedText, "hex", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
    }

    public createHmacSha256Hash(text: string, key: string): string {
        const hmac = createHmac("sha256", key);

        return hmac.update(text).digest("hex");
    }

    public static get instance(): CryptoUtils {
        return this.INSTANCE;
    }
}