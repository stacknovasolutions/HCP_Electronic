import { Controller, Delete, Get, Middleware, Post } from "@overnightjs/core";
import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import logger from "../config/logger";
import { serverErrorResponse } from "./errors";
import { runSP } from "../db/db";
import { asyncWrap } from "../utils/asyncWrap";
import * as sql from "mssql";
import verifyToken from "../middlewares/verifyToken";
import { ISecureRequest } from "@overnightjs/jwt";

const { UNPROCESSABLE_ENTITY, UNAUTHORIZED, NOT_FOUND, OK } = StatusCodes;

/**
 * @swagger
 * tags:
 *   - name: Category
 *     description: Operations related to Category
 */
@Controller("api/category")
export class CategoryController {
  /**
   * @swagger
   * /api/category:
   *   get:
   *     tags:
   *       - Category
   *     description: Get category details based on categoryId and companyId
   *     parameters:
   *       - in: query
   *         name: categoryId
   *         description: ID of the category
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
  private async getCategoryDetails(req: any, res: any) {
    const output = {
      name: "TotalRecords",
      type: { type: sql.Int },
    };
    const { categoryId, pageNo, pageSize } = req.query;

    const [error, result] = await asyncWrap(
      runSP(
        "G_Category",
        [
          {
            name: "CategoryID",
            value: categoryId || 0,
          },
          {
            name: "LoginUserId",
            value: req.payload.userId
          },
          {
            name: "CompanyID",
            value: req.payload.companyId,
          },
          {
            name: "PageNo",
            value: pageNo || 1,
          },
          {
            name: "PazeSize",
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
   * /api/category:
   *   post:
   *     tags:
   *       - Category
   *     description: Insert Update category
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               categoryId:
   *                 type: integer
   *               categoryCode:
   *                 type: integer
   *               categoryName:
   *                 type: string
   *               categoryLevel:
   *                 type: integer
   *               parentCategoryId:
   *                 type: integer
   *               categoryImage:
   *                 type: string
   *               isVisible:
   *                 type: boolean
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
  @Middleware([
    body("categoryName", "CategoryName is required to process").exists({
      checkFalsy: true,
      checkNull: true,
    }),
    body("companyId", "CompanyID is required to process").exists({
      checkFalsy: true,
      checkNull: true,
    }),
    body("categoryLevel", "CategoryLevel is required to process").exists({
      checkFalsy: true,
      checkNull: true,
    }),
    body("categoryCode", "CategoryCode is required to process").exists({
      checkFalsy: true,
      checkNull: true,
    }),
    verifyToken
  ])
  private async insertUpdateCompany(req: any, res: any) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(UNPROCESSABLE_ENTITY).json({
          success: false,
          code: -1,
          errors: errors.array(),
          message: "Please check your inputs!",
        });
      }

      const {
        categoryId,
        categoryCode,
        categoryName,
        categoryLevel,
        parentCategoryId,
        categoryImage,
        isVisible
      } = req.body;

      const [error, result] = await asyncWrap(
        runSP("IU_Category", [
          {
            name: "CompanyID",
            value: req.payload.companyId,
          },
          {
            name: "CategoryID",
            value: categoryId || 0,
          },
          {
            name: "CategoryCode",
            value: categoryCode,
          },
          {
            name: "CategoryName",
            value: categoryName,
          },
          {
            name: "CategoryLevel",
            value: categoryLevel || 0,
          },
          {
            name: "ParentCategoryID",
            value: parentCategoryId || 0,
          },
          {
            name: "CategoryImage",
            value: categoryImage || "",
          },
          {
            name: 'isVisible',
            value: isVisible,
          },
          {
            name: "LoginUserId",
            value: req.payload.userId || 1,
          },
        ])
      );

      if (!result) {
        return serverErrorResponse(res);
      }

      return res.status(OK).json({
        success: true,
        statusCode: OK,
        message: result.recordset[0].Message

      });
    } catch (error) {
      logger.error(error);
      serverErrorResponse(res);
    }
  }


  /**
* @swagger
* /api/category/:id:
*   delete:
*     tags:
*     - Category
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
      runSP("D_Category", [
        {
          name: "CategoryID",
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

  /**
   * @swagger
   * /api/category/parent:
   *   get:
   *     tags:
   *       - Category
   *     description: Get category details based on categoryId and companyId
   *     parameters:
   *       - in: query
   *         name: companyId
   *         description: ID of the company
   *         required: true
   *         schema:
   *           type: integer
   *           example: 1
   *     responses:
   *       200:
   *         description: Successful response
   */

  @Get("parent")
  @Middleware(verifyToken)
  private async getParentCategory(req: any, res: any) {

    const { companyId } = req.query;

    const [error, result] = await asyncWrap(
      runSP(
        "G_ParentCategory",
        [
          {
            name: "CompanyID",
            value: companyId || req.payload.companyId
          },
          {
            name: "LoginUserID",
            value: req.payload.userId
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
      code: 1,
      data: result.recordset,
    });
  }

  /**
   * @swagger
   * /api/category/parentId:
   *   get:
   *     tags:
   *       - Category
   *     description: Get category details based on categoryId and companyId
   *     parameters:
   *       - in: query
   *         name: parentId
   *         description: parentId of the category
   *         required: true
   *         schema:
   *           type: integer
   *           example: 0
   *       - in: query
   *         name: companyId
   *         description: ID of the company
   *         required: true
   *         schema:
   *           type: integer
   *           example: 1
   *     responses:
   *       200:
   *         description: Successful response
   */

  @Get("parentId")
  @Middleware(verifyToken)
  private async getCategoryByProprtyDetails(req: any, res: any) {

    const { parentId, companyId } = req.query;

    const [error, result] = await asyncWrap(
      runSP(
        "G_CategoryByParentCategoryID",
        [
          {
            name: "ParentCategoryID",
            value: parentId || 0,
          },
          {
            name: "CompanyID",
            value: req.payload.companyId
          },
          {
            name: "LoginUserID",
            value: req.payload.userId,
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
      statusCode: 1,
      data: result.recordset,
    });
  }
}
