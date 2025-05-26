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
 *   - name: Page
 *     description: Operations related to Page
 */

@Controller("api/page")
export class PageController {


  /**
    * @swagger
    * /api/page:
    *   get:
    *     tags:
    *       - Page
    *     description: Get all pages
    *     parameters:
    *       - in: query
    *         name: id
    *         description: page id
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
  private async getCompanyDetails(req: any, res: any) {
    const output = {
      name: "TotalRecord",
      type: { type: sql.Int },
    };
    const { id, pageNo, pageSize, pageName } = req.query;

    const [error, result] = await asyncWrap(
      runSP(
        "G_Page",
        [
          {
            name: "PageID",
            value: id || 0,
          },
          {
            name: "PageName",
            value: pageName || null
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

   /**
    * @swagger
    * /api/page:
    *   post:
    *     tags:
    *       - Page
    *     description: Insert Update page
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               id:
    *                 type: integer
    *               pageName:
    *                 type: string
    *               pagePath:
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
   private async insertUpdatePage(req: any, res: any) {
     const { id, pageName, pagePath, moduleId  } =
       req.body;
 
     const [error, result] = await asyncWrap(
       runSP("IU_Page", [
         {
           name: "PageId",
           value: id || 0,
         },
         {
           name: "PageName",
           value: pageName,
         },
         {
           name: "PagePath",
           value: pagePath,
         },
         {
           name: "ModuleID",
           value: moduleId
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
   * /api/page/rolewise:
   *   get:
   *     tags:
   *       - Page
   *     description: Get Page details
   *     parameters:
   *       - in: query
   *         name: id
   *         description: role wise page id
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

  @Get("roleWise")
  @Middleware(verifyToken)
  private async getRoleWisePage(req: any, res: any) {
    const output = {
      name: "TotalRecord",
      type: { type: sql.Int },
    };
    const { id, pageNo, roleId, pageSize } = req.query;

    const [error, result] = await asyncWrap(
      runSP(
        "G_RoleWisePage",
        [
          {
            name: 'RoleWisePageID',
            value: id || 0
          },
          {
            name: "RoleID",
            value: roleId || null,
          },
          {
            name: "ComapanyID",
            value: req.payload.companyId || 1,
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

  @Get("roleWise-pagelist")
  @Middleware(verifyToken)
  private async getRoleWisePageList(req: any, res: any) {
    const output = {
      name: "TotalRecord",
      type: { type: sql.Int },
    };
    const { id, pageNo, roleId, pageSize } = req.query;

    const [error, result] = await asyncWrap(
      runSP(
        "G_RoleWisePageList",
        [
          {
            name: "RoleID",
            value: roleId || null,
          },
          {
            name: "ComapanyID",
            value: req.payload.companyId || 1,
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


  /**
    * @swagger
    * /api/page/rolewise:
    *   post:
    *     tags:
    *       - Page
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
    *               roleWisePage:
    *                 type: object
    *                 example: '[{"RoleID":"2","PageID":"3","Permission":"1"},{"RoleID":"2","PageID":"3","Permission":"2"}]'
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

  @Post("rolewise")
  @Middleware(verifyToken)
  private async insertUpdateRoleWisePage(req: any, res: any) {

    //  Pass as this format 
    //  roleWisePage = '[{"RoleID":"2","PageID":"3","Permission":"1"}
    // ,{"RoleID":"2","PageID":"3","Permission":"2"}
    // ,{"RoleID":"2","PageID":"3","Permission":"3"}
    //   ]'

    const {
      id,
      roleWisePage,
      companyId
    } = req.body;

    const [error, result] = await asyncWrap(
      runSP("I_RoleWisePage", [
        {
          name: "RoleWisePageID",
          value: id || 0,
        },
        {
          name: "ComapanyID",
          value: companyId || req.payload.companyId,
        },
        {
          name: 'RoleWisepage',
          value: JSON.stringify(roleWisePage)
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

  @Get("company-pages")
  @Middleware(verifyToken)
  private async getCompanyPagesDetails(req: any, res: any) {

    const { companyId} = req.query;

    const [error, result] = await asyncWrap(
      runSP(
        "G_PageByCompanyID",
        [
          {
            name: "CompanyID",
            value: companyId || req.payload.companyId
        },
          {
            name: "LoginUserId",
            value: req.payload.userId || 1,
          },
        ]
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

  /**
* @swagger
* /api/page/:id:
*   delete:
*     tags:
*     - Page
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
private async deletePageId(req: ISecureRequest, res: Response) {

  const { id } = req.params;

  const [error, result] = await asyncWrap(
    runSP("D_Page", [
      {
        name: "PageID",
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
