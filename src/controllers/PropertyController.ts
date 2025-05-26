import { Controller, Get, Middleware, Post } from "@overnightjs/core";
import { StatusCodes } from "http-status-codes";
import { serverErrorResponse } from "./errors";
import { runSP } from "../db/db";
import { asyncWrap } from "../utils/asyncWrap";
import * as sql from "mssql";
import verifyToken from "../middlewares/verifyToken";

const { UNPROCESSABLE_ENTITY, UNAUTHORIZED, NOT_FOUND, OK } = StatusCodes;

/**
 * @swagger
 * tags:
 *   - name: Property
 *     description: Operations related to Property
 */
@Controller("api/property")
export class PropertyController {
  /**
   * @swagger
   * /api/property:
   *   get:
   *     tags:
   *       - Property
   *     description: Get property details based on companyId
   *     parameters:
   *       - in: query
   *         name: companyId
   *         description: ID of the company
   *         required: true
   *         schema:
   *           type: integer
   *           example: 1
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
  private async getPropertyDetails(req: any, res: any) {
    const output = {
      name: "TotalRecord",
      type: { type: sql.Int },
    };

    const { pageNo, pageSize } = req.query;

    const [error, result] = await asyncWrap(
      runSP(
        "G_Property",
        [
          {
            name: "CompanyId",
            value: req.payload.companyId,
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
      statusCode: OK,
      data: result.recordset,
      total: result.output[output.name],
    });
  }

  @Post("")
  @Middleware(verifyToken)
  private async insertUpdateInquiry(req: any, res: any) {
    const { companyId, propertyId, categoryId, propertyName } = req.body;

    const [error, result] = await asyncWrap(
      runSP("IU_Property", [
        {
          name: "PropertyID",
          value: propertyId || 0,
        },
        {
          name: "Companyid",
          value: req.payload.companyId || 1,
        },
        {
          name: "Propertyname",
          value: propertyName,
        },
        {
          name: "categoryId",
          value: categoryId,
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
   * /api/property/category:
   *   get:
   *     tags:
   *       - Property
   *     description: Get property by category id
   *     parameters:
   *       - in: query
   *         name: categoryId
   *         description: category Id
   *         schema:
   *           type: integer
   *           example: 1
   *     responses:
   *       200:
   *         description: Successful response
   */

  @Get("category")
  @Middleware(verifyToken)
  private async getPropertyByCategoryId(req: any, res: any) {

    const { categoryId } = req.query;

    const [error, result] = await asyncWrap(
      runSP(
        "G_PropertyByCatogaryId",
        [
          {
            name: "CompanyId",
            value: req.payload.companyId,
          },
          {
            name: "LoginUserId",
            value: req.payload.userId || 1,
          },
          {
            name: "CategoryID",
            value: categoryId
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
      StatusCode: OK,
      data: result.recordset,
    });
  }

  /**
   * @swagger
   * /api/property/value:
   *   get:
   *     tags:
   *       - Property
   *     description: Get property details based on companyId
   *     parameters:
   *       - in: query
   *         name: companyId
   *         description: ID of the company
   *         required: true
   *         schema:
   *           type: integer
   *           example: 1
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

  @Get("value")
  @Middleware(verifyToken)
  private async getPropertyvalueDetails(req: any, res: any) {
    const output = {
      name: "TotalRecord",
      type: { type: sql.Int },
    };

    const { pageNo, pageSize } = req.query;

    const [error, result] = await asyncWrap(
      runSP(
        "G_Property",
        [
          {
            name: "CompanyId",
            value: req.payload.companyId,
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
      statusCode: OK,
      data: result.recordset,
      total: result.output[output.name],
    });
  }

  @Post("value")
  @Middleware(verifyToken)
  private async insertUpdateInquiryFollowUp(req: any, res: any) {
    const { PropertyValueID, productId, propertyId, propertyValue } =
      req.body;

    const [error, result] = await asyncWrap(
      runSP("IU_InquiryFollowUp", [
        {
          name: "PropertyValueID",
          value: PropertyValueID || 0,
        },
        {
          name: "CompanyId",
          value: req.payload.companyId || 1,
        },
        {
          name: "ProductId",
          value: productId,
        },
        {
          name: "PropertyId",
          value: propertyId,
        },
        {
          name: "Propertyvalue",
          value: propertyValue,
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
}
