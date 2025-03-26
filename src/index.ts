import App from "./app";
import config from "./config/config";

const app = new App(config)
app.setup();
app.setupRoutes();

app.startServer();
