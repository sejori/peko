const encoder = new TextEncoder();

type HMACData = { name: "HMAC"; hash: "SHA-256" | "SHA-384" | "SHA-512" };
type RSAData = { name: "RSA"; hash: "SHA-256" | "SHA-384" | "SHA-512" };
type AlgData = HMACData | RSAData;

/**
 * Crypto class, generates hashes and signs/verifies JWTs using provided key.
 * @param key: CryptoKey | string
 */
export class Crypto {
  algData: AlgData;
  key: CryptoKey | string;

  constructor(
    key: CryptoKey | string,
    algData: AlgData = { name: "HMAC", hash: "SHA-256" }
  ) {
    this.algData = algData;
    this.key = key;
  }

  /**
   * Create CryptoKey from rawKey string to be used in crypto methods
   */
  static async createCryptoKey(
    key: string,
    algData: AlgData,
    usage: KeyUsage[],
    extractable = false
  ): Promise<CryptoKey> {
    if (algData.name === "HMAC") {
      return await crypto.subtle.importKey(
        "raw",
        encoder.encode(key),
        algData,
        extractable,
        usage
      );
    }

    // remove header, footer and line breaks
    key = key.replace(
      /(?:-----(?:BEGIN|END) (?:PUBLIC|PRIVATE) KEY-----|\s|\\n)/g,
      ""
    );

    return await crypto.subtle.importKey(
      usage.some((use) => use === "verify") ? "spki" : "pkcs8",
      new Uint8Array(
        atob(key)
          .split("")
          .map((c) => c.charCodeAt(0))
      ),
      { ...algData, name: "RSASSA-PKCS1-v1_5" },
      extractable,
      usage
    );
  }

  /**
   * Generate hash from string
   * @param contents: string
   * @returns hashHex: string
   */
  async hash(contents: BodyInit): Promise<string> {
    const temp = new Response(contents); // how to array buffer all the things
    const hashBuffer = await crypto.subtle.digest(
      this.algData.hash,
      await temp.arrayBuffer()
    );
    return new String(hashBuffer).toString();
  }

  /**
   * Sign (create) JWT from payload
   * @param payload: Record<string, unknown>
   * @returns jwt: Promise<string>
   */
  async sign(payload: Record<string, unknown>): Promise<string> {
    const key =
      this.key instanceof CryptoKey
        ? this.key
        : await Crypto.createCryptoKey(this.key, this.algData, ["sign"]);

    const header = {
      alg: `${this.algData.name[0]}S${this.algData.hash.split("-")[1]}`,
      typ: "JWT",
    };

    const b64Header = btoa(JSON.stringify(header));
    const b64Payload = btoa(JSON.stringify(payload));

    const signatureBuffer = await crypto.subtle.sign(
      key.algorithm,
      key,
      encoder.encode(`${b64Header}.${b64Payload}`)
    );
    const signature = btoa(new String(signatureBuffer).toString());

    return `${b64Header}.${b64Payload}.${signature}`;
  }

  /**
   * Verify JWT and extract payload
   * @param jwt: string
   * @returns payload: Promise<Record<string, unknown> | false>
   */
  async verify(jwt: string): Promise<Record<string, unknown> | false> {
    const key =
      this.key instanceof CryptoKey
        ? this.key
        : await Crypto.createCryptoKey(this.key, this.algData, ["verify"]);

    const split = jwt.split(".");
    if (split.length != 3) return false;
    const [b64Header, b64Payload, b64Signature] = split;

    const verified = await crypto.subtle.verify(
      key.algorithm,
      key,
      encoder.encode(atob(b64Signature)),
      encoder.encode(`${b64Header}.${b64Payload}`)
    );

    return verified ? JSON.parse(atob(b64Payload)) : false;
  }
}
