export const enum HashAlgorithm {
    SHA1   = 'SHA-1',
    SHA256 = 'SHA-256',
    SHA384 = 'SHA-384',
    SHA512 = 'SHA-512'
}

export const enum CryptoAlgorithm {
    RSA_OAEP = 'RSA-OAEP',
    AES_CTR  = 'AES-CTR',
    AES_CBC  = 'AES-CBC',
    AES_GCM  = 'AES-GCM'
}

// Binary and string converter
export const convertStringToBinary = (str: string): Uint8Array => new TextEncoder().encode(str);
export const convertBinaryToString = (binary: BufferSource): string => new TextDecoder().decode(binary);
export const convertBinaryToHex = (binary: Uint8Array): string => Array.from(binary).map(e => e.toString(16).padStart(2, "0")).join("");
export const convertBinaryToBase64 = (binary: Uint8Array): string => btoa(String.fromCharCode(...binary));
export const convertHexToBinary = (hex: string): Uint8Array => new Uint8Array((hex.match(/.{1,2}/g) || []).map(e => Number('0x' + e)));  // p.s. The Hex must be a multiple of 2
export const convertBase64ToBinary = (base64: string): Uint8Array => Uint8Array.from(atob(base64), c => c.charCodeAt(0));

// Generate random data
export const generateRandomBinary = (length = 32): Uint8Array => crypto.getRandomValues(new Uint8Array(length));
export const generateRandomKey = (length = 32): string => convertBinaryToHex(generateRandomBinary(length));

// Create hashs
export const createBinaryHash = async (binary: Uint8Array, algorithm: HashAlgorithm = HashAlgorithm.SHA256): Promise<Uint8Array> => new Uint8Array(await window.crypto.subtle.digest(algorithm, binary));
export const createHash = async (data: string, algorithm: HashAlgorithm = HashAlgorithm.SHA256): Promise<Uint8Array> => {
    const encoded_text = convertStringToBinary(data);
    const hash = await createBinaryHash(encoded_text, algorithm);

    return new Uint8Array(hash);
}
export const createBinaryHashHex = async (binary: Uint8Array, algorithm: HashAlgorithm = HashAlgorithm.SHA256): Promise<string> => convertBinaryToHex(await createBinaryHash(binary, algorithm));
export const createHashHex = async (data: string, algorithm: HashAlgorithm = HashAlgorithm.SHA256): Promise<string> => convertBinaryToHex(await createHash(data, algorithm));

// Encryption
export const encryption = async (data: Uint8Array, key: Uint8Array, algorithm: CryptoAlgorithm = CryptoAlgorithm.AES_CBC): Promise<string> => {
    const iv = generateRandomBinary(16);
    const encoded_key = await window.crypto.subtle.importKey('raw', await createBinaryHash(key), {
        name: algorithm,
        length: 256
    }, true, ['encrypt']);
    const ciphertext = await window.crypto.subtle.encrypt({
        name: algorithm,
        iv
    }, encoded_key, data);

    return [convertBinaryToBase64(new Uint8Array(ciphertext)), convertBinaryToHex(iv)].join("");
}

// Decryption
export const decryption = async (cipher: string, key: Uint8Array, algorithm: CryptoAlgorithm = CryptoAlgorithm.AES_CBC): Promise<Uint8Array> => {
    const encrypted_data = cipher.slice(0, cipher.length - 32);
    const encrypted_iv = convertHexToBinary(cipher.slice(cipher.length - 32));
    const decrypted_cipher = convertBase64ToBinary(encrypted_data);
    const encoded_key = await window.crypto.subtle.importKey('raw', await createBinaryHash(key), {
        name: algorithm,
        length: 256
    }, true, ['decrypt']);
    const content = await window.crypto.subtle.decrypt({
        name: algorithm,
        iv: encrypted_iv
    }, encoded_key, decrypted_cipher);

    return new Uint8Array(content);
}