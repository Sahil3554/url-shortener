import { URLRepository } from "../repositories/url.repository";
import { generateShortCode } from "../utils/nanoid";
import Configuration from "../config/config";



class URLService {
    private config: typeof Configuration
    private urlRepository: URLRepository;
    constructor(config: typeof Configuration, urlRepository: URLRepository) {
        this.config = config;
        this.urlRepository = urlRepository;

    }
    async shortenURL(longUrl: string): Promise<string> {
        const shortCode = generateShortCode();
        await this.urlRepository.saveURL(shortCode, longUrl);
        return `${this.config.BASE_URL}/api/url/${shortCode}`;
    }

    async getOriginalURL(shortCode: string): Promise<string | null> {
        return await this.urlRepository.getURL(shortCode);
    }
}
export default URLService;