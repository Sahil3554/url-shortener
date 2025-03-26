import { Request, Response, Router } from "express";
import URLService from "../services/url.service";


class URLController {
    public router: Router;
    public urlService: URLService

    constructor(router: Router, urlService: URLService) {
        this.router = router;
        this.urlService = urlService;
    }
    getRouter() {
        return this.router;
    }
    setRoutes() {
        this.router.post("/shorten", this.shortenURL);
        this.router.get("/:shortId", this.redirect);
    }
    shortenURL = async (req: Request, res: Response): Promise<any> => {
        const { longUrl } = req.body;
        if (!longUrl) return res.status(400).json({ error: "URL is required" });

        const shortUrl = await this.urlService.shortenURL(longUrl);
        return res.json({ shortUrl });
    }

    redirect = async (req: Request, res: Response): Promise<any> => {
        const { shortCode } = req.params;
        const longUrl = await this.urlService.getOriginalURL(shortCode);

        if (!longUrl) return res.status(404).json({ error: "Short URL not found" });

        res.redirect(longUrl);
    }
}
export default URLController;