import { Controller, Delete, Get, Middleware, Post } from "@overnightjs/core";
import { StatusCodes } from "http-status-codes";
import { serverErrorResponse } from "./errors";
import { runSP } from "../db/db";
import { asyncWrap } from "../utils/asyncWrap";
import * as sql from "mssql";
import verifyToken from "../middlewares/verifyToken";
import { ISecureRequest } from "@overnightjs/jwt";
import { Response } from 'express';

const { UNPROCESSABLE_ENTITY, UNAUTHORIZED, NOT_FOUND, OK } = StatusCodes;

/**
 * @swagger
 * tags:
 *   - name: Module
 *     description: Operations related to Gst
 */

@Controller("api/user-type")
export class UserTypeController {
  /**
   * @swagger
   * /api/gst:
   *   get:
   *     tags:
   *       - Module
   *     description: Get modules
   *     parameters:
   *       - in: query
   *         name: id
   *         description: Gst id
   *         required: true
   *         schema:
   *           type: integer
   *           example: 0
   *     responses:
   *       200:
   *         description: Successful response
   */

  @Get("")
  @Middleware(verifyToken)
  private async getModules(req: any, res: any) {

    const { id } = req.query;

    const [error, result] = await asyncWrap(
      runSP(
        "G_UserTypeID",
        [
          {
            name: "UserTypeID",
            value: id || 0,
          },
          {
            name: "LoginUserId",
            value: req?.payload?.userId || 1,
          },
        ],
      )
    );

    if (!result) {
      console.log(error);
      return serverErrorResponse(res);
    }

    return res.status(OK).send({
      success: true,
      statusCode: OK,
      data: result.recordset,
    });
  }
}
