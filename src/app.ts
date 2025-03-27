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
    private redisConnector: RedisConnector;
    private server: any;

    constructor(config: typeof configuration) {
        this.config = config


    }
    getExpressApp() {
        return this.expressApp;
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
        this.setupRoutes();
    }
    setupRoutes() {
        this.expressApp.get("/health", (req, res) => {
            res.status(200).json({ "status": "Working Fine!" })
        })

        this.expressApp.use("/api/url", this.urlController.getRouter());
    }
    startServer() {
        this.server = this.expressApp.listen(this.config.PORT, () => console.log(`🚀 Server running on port ${this.config.PORT}`));

    }

    closeServer() {
        if (this.server) {
            this.server.close(() => {
                console.log("🛑 Server closed successfully.");
                this.redisConnector.disconnect(); // Close Redis connection
                process.exit(0);
            });
        }
    }

}
export default App;
