import { Controller, Delete, Get, Middleware, Post } from "@overnightjs/core";
import { StatusCodes } from "http-status-codes";
import { serverErrorResponse } from "./errors";
import { runSP } from "../db/db";
import { asyncWrap } from "../utils/asyncWrap";
import * as sql from "mssql";
import verifyToken from "../middlewares/verifyToken";
import { ISecureRequest } from "@overnightjs/jwt";
import { Response } from "express";

const { UNPROCESSABLE_ENTITY, UNAUTHORIZED, NOT_FOUND, OK } = StatusCodes;

/**
 * @swagger
 * tags:
 *   - name: Inquiry
 *     description: Operations related to inquiry
 */

@Controller("api/inquiry")
export class InquiryController {
  /**
   * @swagger
   * /api/inquiry:
   *   get:
   *     tags:
   *       - Inquiry
   *     description: Get category details based on categoryId and companyId
   *     parameters:
   *       - in: query
   *         name: id
   *         description: ID of the inquiry
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
  private async getInquiryDetails(req: any, res: any) {

    const output = {
      name: "TotalRecord",
      type: { type: sql.Int },
    };

    const { id, pageNo, pageSize, userName } = req.query;

    const [error, result] = await asyncWrap(
      runSP(
        "G_Inquiry",
        [
          {
            name: "InquriyID",
            value: id || 0,
          },
          {
            name: "CompanyId",
            value: req.payload.companyId,
          },
          {
            name: "LoginUserId",
            value: req.payload.userId || 1,
          },
          {
            name: 'UserName',
            value: userName
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
   * /api/inquiry:
   *   post:
   *     tags:
   *       - Inquiry
   *     description: Insert update inquiry
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               inquiryId:
   *                 type: integer
   *               inquiryDate:
   *                 type: string
   *               userId:
   *                 type: integer
   *               inquiryDescription:
   *                 type: string
   *               inquiryStatus:
   *                 type: integer
   *               statusDate:
   *                 type: string
   *               assignedtoUserID:
   *                 type: interger
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
  private async insertUpdateInquiry(req: any, res: any) {
    const {
      userId,
      inquriyId,
      inquiryDate,
      inquiryDescription,
      inquiryStatus,
      statusDate,
      assignedtoUserID,
      filePath,
      shortDescription,
    } = req.body;

    const [error, result] = await asyncWrap(
      runSP("IU_Inquiry", [
        {
          name: "InquriyID",
          value: inquriyId || 0,
        },
        {
          name: "Companyid",
          value: req.payload.companyId || 1,
        },
        {
          name: "UserID",
          value: userId,
        },
        {
          name: "InquiryDate",
          value: inquiryDate,
        },
        {
          name: "InquiryDescription",
          value: inquiryDescription,
        },
        {
          name: "InquiryStatus",
          value: inquiryStatus,
        },
        {
          name: "statusDate",
          value: statusDate,
        },
        {
          name: "assignedtoUserID",
          value: assignedtoUserID,
        },
        {
          name: "FilePath",
          value: filePath,
        },
        {
          name: "ShortDescription",
          value: shortDescription,
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
      message: result.recordset[0].Message,
    });
  }

  /**
   * @swagger
   * /api/inquiry/:id:
   *   delete:
   *     tags:
   *     - Inquiry
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
  @Delete(":id")
  @Middleware(verifyToken)
  private async deleteStateById(req: ISecureRequest, res: Response) {
    const { id } = req.params;

    const [error, result] = await asyncWrap(
      runSP("D_Inquiry", [
        {
          name: "InquriyID",
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
      return serverErrorResponse(res);
    }

    return res.status(OK).json({
      statusCode: OK,
      message: result.recordset[0].Message,
    });
  }

  /**
   * @swagger
   * /api/inquiry/follow-up:
   *   get:
   *     tags:
   *       - Inquiry
   *     description: Get category details based on categoryId and companyId
   *     parameters:
   *       - in: query
   *         name: id
   *         description: ID of the inquiry followup
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

  @Get("follow-up")
  @Middleware(verifyToken)
  private async getInquiryFollowupDetails(req: any, res: any) {
    const output = {
      name: "TotalRecord",
      type: { type: sql.Int },
    };
    const { id, inquiryId, companyId, pageNo, pageSize } = req.query;

    const [error, result] = await asyncWrap(
      runSP(
        "G_InquiryFollowUp",
        [
          {
            name: "InquiryFollowUpID",
            value: id || 0,
          },
          {
            name: "InquiryID",
            value: inquiryId || 0,
          },
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

  /**
   * @swagger
   * /api/inquiry/follow-up:
   *   post:
   *     tags:
   *       - Inquiry
   *     description: Insert update inquiry
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               inquiryId:
   *                 type: integer
   *               inquiryFollowUpId:
   *                 type: integer
   *               followUpById:
   *                 type: integer
   *               followUpDate:
   *                 type: string
   *               followUpDescription:
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

  @Post("follow-up")
  @Middleware(verifyToken)
  private async insertUpdateInquiryFollowUp(req: any, res: any) {
    const {
      inquiryFollowUpId,
      inquiryId,
      followUpDescription,
      followUpDate,
    } = req.body;

    const [error, result] = await asyncWrap(
      runSP("IU_InquiryFollowUp", [
        {
          name: "InquiryFollowUpID",
          value: inquiryFollowUpId || 0,
        },
        {
          name: "InquriyID",
          value: inquiryId || 1,
        },
        {
          name: "FollowUpByID",
          value: req.payload.userId,
        },
        {
          name: "FollowUpDate",
          value: followUpDate,
        },
        {
          name: "FollowUpDescriptions",
          value: followUpDescription,
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
      statusCode: 1,
      message: result.recordset[0].Message,
    });
  }

  /**
   * @swagger
   * /api/inquiry/follow-up:id:
   *   delete:
   *     tags:
   *     - Inquiry
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
  @Delete("follow-up:id")
  @Middleware(verifyToken)
  private async deleteInquiryFollowup(req: ISecureRequest, res: Response) {
    const { id } = req.params;

    const [error, result] = await asyncWrap(
      runSP("D_InquiryFollowUp", [
        {
          name: "InquiryFollowUpID",
          value: id || 0,
        },
        {
          name: "LoginUserID",
          value: req?.payload?.userId || 1,
        },
      ])
    );

    if (!result) {
      return serverErrorResponse(res);
    }

    return res.status(OK).json({
      statusCode: OK,
      message: result.recordset[0].Message,
    });
  }
}
