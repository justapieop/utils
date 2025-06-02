export interface EmailProvider {
    domain?: string,
    cut?: RegExp,
    alias?: EmailProvider,
}

export class EmailUtils {
    private static readonly INSTANCE: EmailUtils = new EmailUtils();
    private readonly EMAIL_REGEX: RegExp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
    private readonly PLUS_ONLY = /\+.*$/;
    private readonly PLUS_AND_DOT = /\.|\+.*$/g;
    private readonly PROVIDERS: EmailProvider[] = [
        {
            domain: "gmail.com",
            cut: this.PLUS_AND_DOT,
        },
        {
            domain: "googlemail.com",
            cut: this.PLUS_AND_DOT,
            alias:
            {
                domain: "gmail.com",
                cut: this.PLUS_AND_DOT,
            }
        },
        {
            domain: "hotmail.com",
            cut: this.PLUS_ONLY,
        },
        {
            domain: "live.com",
            cut: this.PLUS_AND_DOT,
        },
        {
            domain: "hotmail.com",
            cut: this.PLUS_ONLY,
        }
    ];

    public validate(email: string): boolean {
        return this.EMAIL_REGEX.test(email);
    }

    public normalize(email: string): string {
        const lower: string = email.toLowerCase();
        const parts: string[] = lower.split("/@/");

        if (parts.length !== 2) {
            return email;
        }

        let username: string = parts[0];
        let host: string = parts[1];

        for (const provider of this.PROVIDERS) {
            if (host === provider.domain) {
                username = username.replace(provider.cut as RegExp, "");
            }

            if (Object.hasOwn(provider, "alias") && provider.alias?.domain === host) {
                host = provider.alias.domain;
            }
        }

        return `${username}@${host}`;
    }

    public static get instance(): EmailUtils {
        return this.INSTANCE;
    }
}