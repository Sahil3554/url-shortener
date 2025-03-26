import express from "express";
import cors from "cors";
import URLController from "./controllers/url.controller";
import URLService from "./services/url.service";
import { URLRepository } from "./repositories/url.repository";
import configuration from "./config/config";
import RedisConnector from "./redis";


class App {
    private expressApp = express();
    private router = express.Router()

    private urlRepository: URLRepository
    private urlService: URLService
    private urlController: URLController
    private config: typeof configuration
    redisConnector: RedisConnector;

    constructor(config: typeof configuration) {
        this.config = config


    }
    setup() {
        this.expressApp.use(cors());
        this.expressApp.use(express.json());
        this.redisConnector = new RedisConnector(this.config);
        this.redisConnector.connect()
        let redis = this.redisConnector.getRedis();
        this.urlRepository = new URLRepository(redis);
        this.urlService = new URLService(this.config, this.urlRepository);
        this.urlController = new URLController(this.router, this.urlService);
        this.urlController.setRoutes();
    }
    setupRoutes() {
        this.expressApp.get("/health", (req, res) => {
            res.status(200).json({ "status": "Working Fine!" })
        })

        this.expressApp.use("/api/url", this.urlController.getRouter());
    }
    startServer() {
        this.expressApp.listen(this.config.PORT, () => console.log(`🚀 Server running on port ${this.config.PORT}`));

    }

}
export default App;
