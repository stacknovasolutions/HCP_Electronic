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
 *   - name: Quotation
 *     description: Operations related to Quotation
 */

@Controller("api/quotation")
export class QuotationController {
  /**
   * @swagger
   * /api/quotation:
   *   get:
   *     tags:
   *       - Quotation
   *     description: Get quotation details
   *     parameters:
   *       - in: query
   *         name: id
   *         description: ID of the quotation
   *         required: true
   *         schema:
   *           type: integer
   *           example: 0
   *       - in: query
   *         name: inquiryId
   *         description: ID of the inquiry
   *         schema:
   *           type: integer
   *       - in: query
   *         name: quotationDate
   *         description: quotation date
   *         schema:
   *           type: string
   *       - in: query
   *         name: quotationType
   *         description: quotation type
   *         schema:
   *           type: string
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
  private async getQuotationDetails(req: any, res: any) {

    const output = {
      name: "TotalRecord",
      type: { type: sql.Int },
    };

    const { id, pageNo, pageSize, inquiryId, quotationDate, quotationType } = req.query;

    const [error, result] = await asyncWrap(
      runSP(
        "G_Quatation",
        [
          {
            name: 'InquiryID',
            value: inquiryId
          },
          {
            name: 'QuatationType',
            value: quotationType
          },
          {
            name: 'QuatationDate',
            value: quotationDate
          },
          {
            name: "QuatationID",
            value: id || 0,
          },
          {
            name: "CompanyID",
            value: req.payload.companyId || 1
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
   * /api/quotation:
   *   post:
   *     tags:
   *       - Quotation
   *     description: Insert update complaint
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               quotationId:
   *                 type: integer
   *               quotationType:
   *                 type: string
   *               quotationDate:
   *                 type: string
   *               totalAmount:
   *                 type: integer
   *               description:
   *                 type: string
   *               inquiryId:
   *                 type: number
   *               quotationItem:
   *                 type: object
   *                 example: '[{"ProductID":"1","Quantity":"5","UnitPrice":"4","Sub_Total":"10"},{"ProductID":"2","Quantity":"5","UnitPrice":"4","Sub_Total":"10"}]'
   *               filePath:
   *                 type: string
   *               shortDescription:
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
  private async insertQuotation(req: any, res: any) {
    const {
      quotationId,
      quotationType,
      quotationDate,
      totalAmount,
      description,
      inquiryId,
      quotationItem,
      filePath,
      shortDescription
    } = req.body;

    const [error, result] = await asyncWrap(
      runSP("I_Quatation", [
        {
          name: "QuatationID",
          value: quotationId || 0,
        },
        {
          name: "Companyid",
          value: req.payload.companyId || 1,
        },
        {
          name: "QuatationType",
          value: quotationType,
        },
        {
          name: "QuatationDate",
          value: quotationDate,
        },
        {
          name: "TotalAmount",
          value: totalAmount,
        },
        {
          name: "Description",
          value: description,
        },
        {
          name: "InquiryID",
          value: inquiryId,
        },
        {
          name: "QuatationItem",
          value: JSON.stringify(quotationItem),
        },
        {
          name: 'FilePath',
          value: filePath
        },
        {
          name: 'ShortDescription',
          value: shortDescription
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
   * /api/quotation/item:
   *   get:
   *     tags:
   *       - Quotation
   *     description: Get quotation details
   *     parameters:
   *       - in: query
   *         name: id
   *         description: ID of the quotation
   *         required: true
   *         schema:
   *           type: integer
   *           example: 0
   *     responses:
   *       200:
   *         description: Successful response
   */

  @Get('item')
  @Middleware(verifyToken)
  private async getQuotationItem(req: ISecureRequest, res: Response) {

    const { id } = req.query;

    const [error, result] = await asyncWrap(
      runSP(
        "G_QuatationItem", [
        {
          name: 'QuatationID',
          value: +id,
        },
        {
          name: 'CompanyID',
          value: req?.payload?.companyId || 1,
        },
        {
          name: 'LoginUserID',
          value: req?.payload?.userId || 1,
        }
      ])
    )

    if (!result) {
      console.log(error);
      return serverErrorResponse(res);
    }

    return res.status(OK).send({
      success: true,
      statusCode: OK,
      data: result.recordset
    });
  }


  /**
* @swagger
* /api/quotation/:id:
*   delete:
*     tags:
*     - Quotation
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
      runSP("D_Quatation", [
        {
          name: "QuatationID",
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
