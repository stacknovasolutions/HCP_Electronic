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
 *   - name: Gst
 *     description: Operations related to Gst
 */

@Controller("api/gst")
export class GstController {
  /**
   * @swagger
   * /api/gst:
   *   get:
   *     tags:
   *       - Gst
   *     description: Get gst details
   *     parameters:
   *       - in: query
   *         name: id
   *         description: Gst id
   *         required: true
   *         schema:
   *           type: integer
   *           example: 0
   *       - in: query
   *         name: pageNo
   *         description: Page Number
   *         schema:
   *           type: integer
   *           example: 1
   *       - in: query
   *         name: pageSize
   *         description: Page Size
   *         schema:
   *           type: integer
   *           example: 10
   *     responses:
   *       200:
   *         description: Successful response
   */

  @Get("")
  @Middleware(verifyToken)
  private async getGstDetails(req: any, res: any) {
    const output = {
      name: "TotalRecord",
      type: { type: sql.Int },
    };
    const { id, pageNo, pageSize } = req.query;

    const [error, result] = await asyncWrap(
      runSP(
        "G_GST",
        [
          {
            name: "GSTID",
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
            name: "CompanyID",
            value: req.payload.companyId
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
      statusCode: OK,
      data: result.recordset,
      total: result.output[output.name],
    });
  }

  /**
   * @swagger
   * /api/gst:
   *   post:
   *     tags:
   *       - Gst
   *     description: Insert Update User
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               UserID:
   *                 type: integer
   *               RoleID:
   *                 type: integer
   *               Email:
   *                 type: string
   *               Password:
   *                 type: string
   *               FirstName:
   *                 type: string
   *               LastName:
   *                 type: string
   *               Gender:
   *                 type: string
   *               Birthdate:
   *                 type: string
   *               Date:
   *                 type: integer
   *               Address:
   *                 type: string
   *               Latitude:
   *                 type: string
   *               Longitude:
   *                 type: string
   *               MobileNumber:
   *                 type: string
   *               RefferalCode:
   *                 type: integer
   *               stateId:
   *                 type: integer
   *               city:
   *                 type: string
   *               pinCode:
   *                 type: integer
   *     responses:
   *       200:
   *         description: Successful login
   *       401:
   *         description: Unauthorized - Invalid credentials
   *       422:
   *         description: Unprocessable entity
   *       500:
   *         description: Internal server error
   */

  @Post("")
    @Middleware([verifyToken])
  private async insertUpdateGst(req: any, res: any) {
    const { gstId, policyName, category, gstRate, date, rateType } =
      req.body;

    const [error, result] = await asyncWrap(
      runSP("IU_GST", [
        {
          name: "GSTID",
          value: gstId || 0,
        },
        {
          name: "Companyid",
          value: req.payload.companyId || 1,
        },
        {
          name: "PolicyName",
          value: policyName || 1,
        },
        {
          name: "GSTRate",
          value: gstRate || 10,
        },
        {
          name: "Date",
          value: date,
        },
        {
          name: "RateType",
          value: rateType,
        },
        {
          name: "LoginUserID",
          value: req.payload.userId || 1,
        },
      ])
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


  /**
 * @swagger
 * /api/gst/:id:
 *   delete:
 *     tags:
 *     - Gst
 *     description: Delete Gst by id
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
  private async deleteGst(req: ISecureRequest, res: Response) {

    const { id } = req.params;

    const [error, result] = await asyncWrap(
      runSP("D_GST", [
        {
          name: "GSTID",
          value: id || 0,
        },
        {
          name: 'CompanyID',
          value: req?.payload?.companyId || 1,
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
