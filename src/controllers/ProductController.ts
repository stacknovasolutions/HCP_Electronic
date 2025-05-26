import { Controller, Delete, Get, Middleware, Post } from "@overnightjs/core";
import { StatusCodes } from "http-status-codes";
import { serverErrorResponse } from "./errors";
import { runSP } from "../db/db";
import { asyncWrap } from "../utils/asyncWrap";
import * as sql from "mssql";
import verifyToken from "../middlewares/verifyToken";
import { Response } from 'express';
import { ISecureRequest } from "@overnightjs/jwt";


const { UNPROCESSABLE_ENTITY, UNAUTHORIZED, NOT_FOUND, OK } = StatusCodes;

/**
 * @swagger
 * tags:
 *   - name: Product
 *     description: Operations related to product
 */

@Controller("api/product")
export class ProductController {
  /**
   * @swagger
   * /api/product:
   *   get:
   *     tags:
   *       - Product
   *     description: Get category details based on categoryId and companyId
   *     parameters:
   *       - in: query
   *         name: id
   *         description: ID of the product
   *         required: true
   *         schema:
   *           type: integer
   *           example: 0
   *       - in: query
   *         name: productName
   *         description: name of the product
   *         schema:
   *           type: string
   *       - in: query
   *         name: productCode
   *         description: code of the product
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
  private async getProductDetails(req: any, res: any) {
    const output = {
      name: "TotalRecord",
      type: { type: sql.Int },
    };
    const { id, pageNo, pageSize, productCode, productName } = req.query;

    const [error, result] = await asyncWrap(
      runSP(
        "G_Product",
        [
          {
            name: "ProductID",
            value: id || 0,
          },
          {
            name: 'ProductName',
            value: productName
          },
          {
            name: 'ProductCode',
            value: productCode
          },
          {
            name: "LoginUserId",
            value: req.payload.userId || 1,
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
    * /api/product:
    *   post:
    *     tags:
    *       - Product
    *     description: Insert Update product
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               productId:
    *                 type: integer
    *               productCode:
    *                 type: string
    *               productName:
    *                 type: string
    *               categoryId:
    *                 type: integer
    *               productLogo:
    *                 type: string
    *               productType:
    *                 type: string
    *               gstPolicyId:
    *                 type: integer
    *               gstInclusive:
    *                 type: boolean
    *               description:
    *                 type: string
    *               productDescription:
    *                 type: string
    *               productImages:
    *                 type: object
    *                 example: '[{"ImagePath":"/Image1.Jpg","IsDefault":"1"},{"ImagePath":"/Image2.Jpg","IsDefault":"0"}]'
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
  private async insertUpdateInquiry(req: any, res: any) {
    const {
      productId,
      productCode,
      productName,
      categoryID,
      productLogo,
      productType,
      gstPolicyId,
      gstInclusive,
      description,
      productDescription,
      productImages,
      productProperty,
      unitPrice
    } = req.body;

    const [error, result] = await asyncWrap(
      runSP("IU_Product", [
        {
          name: "ProductID",
          value: productId || 0,
        },
        {
          name: "Companyid",
          value: req.payload.companyId || 1,
        },
        {
          name: "ProductCode",
          value: productCode,
        },
        {
          name: "CategoryID",
          value: categoryID,
        },
        {
          name: "ProductName",
          value: productName,
        },
        {
          name: "Productlogo",
          value: productLogo,
        },
        {
          name: "ProductType",
          value: productType,
        },
        {
          name: "GSTPolicyID",
          value: gstPolicyId,
        },
        {
          name: "IsGstInclusive",
          value: gstInclusive,
        },
        {
          name: "Description",
          value: description,
        },
        {
          name: "ProductDescription",
          value: productDescription,
        },
        {
          name: "UnitPirce",
          value: unitPrice
        },
        {
          name: 'ProductImages',
          value: JSON.stringify(productImages)
        },
        {
          name: 'ProductProperty',
          value: JSON.stringify(productProperty)
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
      stausCode: OK,
      message: result.recordset[0].Message
    });
  }

  /**
 * @swagger
 * /api/product/:id:
 *   delete:
 *     tags:
 *     - Product
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
      runSP("D_Product", [
        {
          name: "ProductID",
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
