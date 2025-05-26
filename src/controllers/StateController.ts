import { Controller, Delete, Get, Middleware } from "@overnightjs/core";
import { StatusCodes } from "http-status-codes";
import { serverErrorResponse } from "./errors";
import { runSP } from "../db/db";
import { asyncWrap } from "../utils/asyncWrap";
import * as sql from "mssql";
import { ISecureRequest } from "@overnightjs/jwt";
import verifyToken from "../middlewares/verifyToken";
import { Response } from 'express';

const { UNPROCESSABLE_ENTITY, UNAUTHORIZED, NOT_FOUND, OK } = StatusCodes;

/**
 * @swagger
 * tags:
 *   - name: State
 *     description: Operations related to State
 */
@Controller("api/state")
export class StateController {
  /**
   * @swagger
   * /api/state:
   *   get:
   *     tags:
   *       - State
   *     description: Get category details based on state id
   *     parameters:
   *       - in: query
   *         name: id
   *         description: ID of the state
   *         required: true
   *         schema:
   *           type: integer
   *           example: 0
   *       - in: query
   *         name: pageNo
   *         description: Page Number
   *         schema:
   *           type: integer
   *       - in: query
   *         name: pageSize
   *         description: Page Size
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Successful response
   */

  @Get("")
  @Middleware([verifyToken])
  private async getStateDetails(req: ISecureRequest, res: Response) {
    const output = {
      name: "TotalRecord",
      type: { type: sql.Int },
    };
    const { id, pageNo, pageSize } = req.query;

    const [error, result] = await asyncWrap(
      runSP(
        "G_State",
        [
          {
            name: "StateID",
            value: id || 0,
          },
          {
            name: "LoginUserId",
            value: req.payload.userId || 1,
          },
          {
            name: "PageNo",
            value: pageNo || 1,
          },
          {
            name: "PageSize",
            value: pageSize || 10,
          },
        ],
        output
      )
    );

    if (!result) {
      console.log(error);
      return serverErrorResponse(res);
    }

    return res.status(OK).send({
      success: true,
      statusCode: 1,
      data: result.recordset,
      total: result.output[output.name],
    });
  }


  /**
* @swagger
* /api/state/:id:
*   delete:
*     tags:
*     - State
*     description: Delete a terms and condition y id
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: integer
*         description: ID of the resource to delete
*     responses:
*       204:
*         description: Resource deleted successfully
*       404:
*         description: Resource not found
*/
  @Delete(':id')
  @Middleware(verifyToken)
  private async deleteStateById(req: ISecureRequest, res: Response) {

    const { id } = req.params;

    const [error, result] = await asyncWrap(
      runSP("D_State", [
        {
          name: "StateID",
          value: id || 0,
        },
        {
          name: "LoginUserID",
          value: req?.payload?.userId || 1,
        },
      ])
    );

    if (!result) {
      return serverErrorResponse(res)
    }

    return res.status(OK).json({
      statusCode: OK,
      message: result.recordset[0].Message,
    });
  }
}
