import { createServer } from "http";
import { Server } from "./presentation/server";
import { AppRoutes } from "./presentation/routes";
import { WssService } from "./presentation/services/wss.service";
import { envs } from "./config";
import { MongoDataBase } from "./data";


(async () => {
    await main();
})();

async function main() {

    await MongoDataBase.connect({ dbName: envs.DB_NAME, mongoUrl: envs.MONGO_URL });

    const server = new Server();

    const httpServer = createServer(server.app); //Se crea servidor http con la configuracion de express
    WssService.initWss({ server: httpServer }); // Crea servidor webSocket con la configuracion de express

    server.setRouter(AppRoutes.routes);
    server.setRouterToRedirectPublicPath();

    httpServer.listen(envs.PORT, () => {
        console.log(`Server running on ${envs.PORT}`);
    });
}