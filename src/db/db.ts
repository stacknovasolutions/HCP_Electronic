import * as sql from 'mssql';
import { asyncWrap } from '../utils/asyncWrap';
import util from 'util';

require('dotenv').config();

const { DB_PASSWORD, DB_USERNAME, DB_NAME, DB_SERVER, DB_PORT, REDIS_PORT, REDIS_HOST } = process.env;

var sqlConfig: sql.config = {
  user: DB_USERNAME,
  password: DB_PASSWORD,
  server: DB_SERVER,
  port: Number(DB_PORT) || 1433,
  database: DB_NAME,
  pool: {
    max: 100,
    min: 3
  }
};

const pool: sql.ConnectionPool = new sql.ConnectionPool(sqlConfig);

pool.on('error', (err) => {
  console.error('SQL error', err);
  // ... error handler
});

//On how to use mssql types = https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/mssql/mssql-tests.ts
async function getConnection() {
  return pool.connect();
}

export interface IInput {
  name: string;
  value: number | string;
}

interface IOutput {
  name: string;
  type: sql.ISqlType;
}

if (!REDIS_HOST || !REDIS_PORT) {
  process.exit(1);
}

export async function runSP(
  procedure_name: string,
  inputs: IInput[],
  output?: IOutput,
  respondWithError?: boolean,
  log: boolean = true
) {
  const timeId = Math.ceil(Math.random() * 10000000000)
  console.time(`ID:${timeId} Response time for Running SP ${procedure_name}`) // Start counting time
  const [connectionError, pool] = await asyncWrap(getConnection());
  if (connectionError) {
    // console.error(connectionError)
    return null;
  }

  if (log) {
    console.log("Parameters", util.inspect(inputs, { breakLength: Infinity }))
  }

  let request = inputs.reduce((request, input) => {
    return request.input(input.name, input.value);
  }, pool.request());
  if (output) {
    request = request.output(output.name, output.type);
  }
  const [requestError, result] = await asyncWrap(
    request.execute(procedure_name),
  );
  if (requestError) {
    console.log(util.inspect(requestError, { breakLength: Infinity }))
  } else {
    //no need to log the results. you can track it by timeId
    //console.log('got ' + result?.recordset?.length + ' results')
  }
  //console.log(result)
  if (requestError && respondWithError) {
    console.timeEnd(`ID:${timeId} Response time for Running SP ${procedure_name}`)
    return requestError
  } else if (requestError) {
    console.timeEnd(`ID:${timeId} Response time for Running SP ${procedure_name}`)
    return null
  } else {
    console.timeEnd(`ID:${timeId} Response time for Running SP ${procedure_name}`)

    return result
  }
}

export async function runQuery(query: string) {

  try {
    const [connectionError, pool] = await asyncWrap(getConnection());
    if (connectionError) {
      //console.error(connectionError)
      return null;
    }
    console.log('running query', util.inspect(query, { breakLength: Infinity }))

    let output = await pool.request().query(query)

    return output;

  } catch (error) {
    console.error(error)
  }
}