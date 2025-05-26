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
 *   - name: Complaint
 *     description: Operations related to Complaint
 */
@Controller("api/complaint")
export class ComplaintControllerController {
  /**
   * @swagger
   * /api/complaint:
   *   get:
   *     tags:
   *       - Complaint
   *     description: Get complaint
   *     parameters:
   *       - in: query
   *         name: complaintId
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
  private async getComplaint(req: any, res: any) {
    const output = {
      name: "TotalRecord",
      type: { type: sql.Int },
    };

    const { complaintId, userName, technicianName, assignedtoUserName, pageNo, pageSize } = req.query;

    const [error, result] = await asyncWrap(
      runSP(
        "G_Complain",
        [
          {
            name: "CompanyID",
            value: req.payload.companyId || 1,
          },
          {
            name: "LoginUserID",
            value: req.userId || 1,
          },
          {
            name: 'UserName',
            value: userName
          },
          {
            name: 'TechnicianName',
            value: technicianName
          },
          {
            name: 'AssignedtoUserName',
            value: assignedtoUserName
          },
          {
            name: "PageNo",
            value: pageNo || 1,
          },
          {
            name: "ComplainId",
            value: complaintId || 0,
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
   * /api/complaint:
   *   post:
   *     tags:
   *       - Complaint
   *     description: Insert update complaint
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               userId:
   *                 type: integer
   *               orderId:
   *                 type: integer
   *               technicianId:
   *                 type: integer
   *               assignedToUserId:
   *                 type: integer
   *               quotationId:
   *                 type: integer
   *               complaintId:
   *                 type: integer
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
   *               filePath:
   *                 type: string
   *               shortDescription:
   *                 type:  string
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
  private async insertUpdateComplaint(req: any, res: any) {
    const {
      userId,
      orderId,
      technicianId,
      assignedToUserId,
      quotationId,
      complaintId,
      complaintDate,
      description,
      status,
      resolution,
      filePath,
      shortDescription
    } = req.body;

    const [error, result] = await asyncWrap(
      runSP("IU_Complain", [
        {
          name: "ComplainId",
          value: complaintId || 0,
        },
        {
          name: "Companyid",
          value: req.payload.companyId
        },
        {
          name: "UserID",
          value: userId,
        },
        {
          name: "OrderID",
          value: orderId,
        },
        {
          name: "TechnicianID",
          value: technicianId,
        },
        {
          name: "AssignedtoUserID",
          value: assignedToUserId,
        },
        {
          name: "QuatationID",
          value: quotationId,
        },
        {
          name: "ComplainDate",
          value: complaintDate,
        },
        {
          name: "Descriptions",
          value: description,
        },
        {
          name: "Status",
          value: status,
        },
        {
          name: "Resolution",
          value: resolution,
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
          value: req.payload.userId
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
* /api/complaint/:id:
*   delete:
*     tags:
*     - Complaint
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
  private async deleteComplaint(req: ISecureRequest, res: Response) {

    const { id } = req.params;

    const [error, result] = await asyncWrap(
      runSP("D_Complain", [
        {
          name: "ComplainId",
          value: id || 0,
        },
        {
          name: 'CompanyID',
          value: req.payload.companyId
        },
        {
          name: "LoginUserID",
          value: req.payload.userId
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


  @Get("follow-up")
  @Middleware(verifyToken)
  private async getComplaintFollowUp(req: any, res: any) {
    const output = {
      name: "TotalRecords",
      type: { type: sql.Int },
    };

    const { ComplainFollowUpId, complainId, pageNo, pageSize } = req.query;

    const [error, result] = await asyncWrap(
      runSP(
        "G_ComplainFollowUp",
        [
          {
            name: "CompanyID",
            value: req.payload.companyId || 1,
          },
          {
            name: "ComplainId",
            value: complainId || 0
          },
          {
            name: "LoginUserID",
            value: req.payload.userId || 1,
          },
          {
            name: "PageNo",
            value: pageNo || 1,
          },
          {
            name: "ComplainFollowUpId",
            value: ComplainFollowUpId || 0,
          },
          {
            name: "PageSize",
            value: pageSize || 10,
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
      total: result.output[output.name],
    });
  }

  @Post("follow-up")
  @Middleware(verifyToken)
  private async insertUpdateFollowUp(req: any, res: any) {
    const {
      complaintFollowUpId,
      complainId,
      followUpDate,
      followUpDescription,
    } = req.body;

    const [error, result] = await asyncWrap(
      runSP("IU_ComplainFollowUp", [
        {
          name: "ComplainFollowUpID",
          value: complaintFollowUpId || 0,
        },
        {
          name: "ComplainId",
          value: complainId || 1,
        },
        {
          name: "Companyid",
          value: req.payload.companyId || 1,
        },
        {
          name: "FollowUpByID_UserID",
          value: req.payload.userId,
        },
        {
          name: "FollowUpDescriptions",
          value: followUpDescription,
        },
        {
          name: 'FollowUpDate',
          value: followUpDate
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
* /api/complaint/follow-up/:id:
*   delete:
*     tags:
*     - Complaint
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
  @Delete('follow-up/:id')
  @Middleware(verifyToken)
  private async deleteComplaintFollowUp(req: ISecureRequest, res: Response) {

    const { id } = req.params;

    const [error, result] = await asyncWrap(
      runSP("D_ComplainFollowUp", [
        {
          name: "ComplainFollowUpID",
          value: id || 0,
        },
        {
          name: 'CompanyID',
          value: req.payload.companyId || 1,
        },
        {
          name: "LoginUserID",
          value: req.payload.userId || 1,
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
