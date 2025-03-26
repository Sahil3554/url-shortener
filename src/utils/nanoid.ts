import { nanoid } from "nanoid";

export const generateShortCode = (): string => {
    return nanoid(6); // Generates a 6-character short ID
};
