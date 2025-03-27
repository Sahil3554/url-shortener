import App from "./app";
import config from "./config/config";

const app = new App(config)
app.setup();

app.startServer();

// Handle process termination
['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGKILL']
    .forEach(signal => {
        if (process.platform !== "win32" && (signal == 'SIGINT' || signal == 'SIGTERM')) {
            process.on(signal, () => {
                console.log(`Received ${signal}. Closing server...`);
                app.closeServer();
            })
        }
    });
