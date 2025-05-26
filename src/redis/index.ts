import Redis from "ioredis";
import util from "util";
import { REDIS } from "../config/config";
import logger from "../config/logger";

const { HOST, PORT, PASSWORD } = REDIS

const redis = new Redis({ host: HOST, port: PORT, password: PASSWORD, db: 0 });

redis.on('connect', () => logger.debug(`REDIS at port: ${PORT}`))
redis.on('error', (err) => {
    logger.error('Redis error', util.inspect(err, { breakLength: Infinity }));
    console.log(err);
    process.exit(1)
})

export default redis;
