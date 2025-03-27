
export const generateShortCode = async (): Promise<string> => {
    const { nanoid } = await import("nanoid");
    return nanoid(6);
};

