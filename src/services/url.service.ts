import { URLRepository } from "../repositories/url.repository";
import { generateShortCode } from "../utils/nanoid";
import Configuration from "../config/config";

import { Url } from "@prisma/client";
import URLCache from "@src/cache/url.cache";

class URLService {
    private config: typeof Configuration
    private urlRepository: URLRepository;
    private urlCache: URLCache;
    constructor(config: typeof Configuration, urlRepository: URLRepository, urlCache: URLCache) {
        this.config = config;
        this.urlRepository = urlRepository;
        this.urlCache = urlCache
    }
    async shortenURL(longUrl: string): Promise<string> {
        const shortCode = await generateShortCode();
        this.urlRepository.saveURL(shortCode, longUrl).then(() => this.urlCache.saveURL(shortCode, longUrl));
        return `${this.config.BASE_URL}/api/url/${shortCode}`;
    }

    async getOriginalURL(shortCode: string): Promise<string | null> {
        let cachedURL = this.urlCache.getURL(shortCode);
        if (cachedURL) return cachedURL;
        let urlData = await this.urlRepository.getURL(shortCode);
        if (!urlData) return null
        return urlData.longUrl

    }
}
export default URLService;