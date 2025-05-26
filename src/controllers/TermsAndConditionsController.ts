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
 *   - name: Terms
 *     description: Operations related to terms and condition
 */
@Controller("api/terms")
export class TermsAndConditions {
  /**
   * @swagger
   * /api/terms:
   *   get:
   *     tags:
   *       - Terms
   *     description: Get terms and conditions
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
  @Middleware(verifyToken)
  private async getTermsConditions(req: ISecureRequest, res: Response) {

    const output = {
      name: "TotalRecord",
      type: { type: sql.Int },
    };

    const { id, pageNo, pageSize } = req.query;

    const [error, result] = await asyncWrap(
      runSP(
        "G_TermsAndCondition",
        [
          {
            name: "TermsConditionID",
            value: id || 0,
          },
          {
            name: "LoginUserId",
            value: req.payload.userId
          },
          {
            name: "CompanyID",
            value: req.payload.companyId
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
  * /api/terms:
  *   post:
  *     tags:
  *       - Terms
  *     description: Insert Update pages
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               id:
  *                 type: integer
  *               companyId:
  *                 type: integer
  *               description:
  *                 type: string
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
  @Middleware(verifyToken)
  private async insertUpdateTerms(req: ISecureRequest, res: Response) {

    const {
      id,
      description
    } = req.body;

    const [error, result] = await asyncWrap(
      runSP("IU_TermsAndCondition", [
        {
          name: "TermsConditionID",
          value: id || 0,
        },
        {
          name: "ComapanyID",
          value: req.payload.companyId || 1,
        },
        {
          name: 'Description',
          value: description
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
      message: result.recordset[0].Message
    });
  }


  /**
 * @swagger
 * /api/terms/:id:
 *   delete:
 *     tags:
 *     - Terms
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
  private async deleteTerms(req: ISecureRequest, res: Response) {

    const { id } = req.params;

    const [error, result] = await asyncWrap(
      runSP("D_TermsAndCondition", [
        {
          name: "TermsConditionID",
          value: id || 0,
        },
        {
          name: "CompanyID",
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
