import { Controller, Delete, Get, Middleware, Post } from "@overnightjs/core";
import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import logger from "../config/logger";
import { serverErrorResponse } from "./errors";
import { runSP } from "../db/db";
import { asyncWrap } from "../utils/asyncWrap";
import { ISecureRequest } from "@overnightjs/jwt";
import * as sql from "mssql";
import verifyToken from "../middlewares/verifyToken";
import jwt from "jsonwebtoken";
import { BASEURL, JWT_SECRET } from "../config/config";
import { sendEmail } from "../utils/mail";


const { UNPROCESSABLE_ENTITY, UNAUTHORIZED, NOT_FOUND, OK } = StatusCodes;

/**
 * @swagger
 * tags:
 *   - name: Company
 *     description: Operations related to Company
 */
@Controller("api/company")
export class CompanyController {

  /**
    * @swagger
    * /api/company:
    *   get:
    *     tags:
    *       - Company
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
  private async getCompanyDetails(req: any, res: any) {
    const output = {
      name: "TotalRecords",
      type: { type: sql.Int },
    };
    const { pageNo, pageSize, companyId } = req.query;

    const [error, result] = await asyncWrap(
      runSP(
        "G_Company",
        [
          {
            name: "CompanyID",
            value: companyId || 0,
          },
          {
            name: "LoginUserId",
            value: req.payload.userId,
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
      statusCode: 1,
      data: result.recordset,
      total: result.output[output.name],
    });
  }


  /**
    * @swagger
    * /api/company:
    *   post:
    *     tags:
    *       - Company
    *     description: Insert Update company
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               companyName:
    *                 type: string
    *               shortName:
    *                 type: string
    *               registrationNumber:
    *                 type: string
    *               industryType:
    *                 type: integer
    *               address:
    *                 type: string
    *               contactInformation:
    *                 type: string
    *               founder_CEO:
    *                 type: string
    *               dateofEstablishment:
    *                 type: string
    *               numberOfEmployee:
    *                 type: integer
    *               partnerships:
    *                 type: string
    *               logoUrl:
    *                 type: string
    *               stateId:
    *                 type: integer
    *               city:
    *                 type: string
    *               pinCode:
    *                 type: integer
    *               latitude:
    *                 type: string
    *               longitude:
    *                 type: string
    *               userLimit:
    *                 type: integer 
    *               email:
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
  @Middleware([verifyToken])
  @Middleware([
    body("shortName", "shortName is required to process").exists({
      checkFalsy: true,
      checkNull: true,
    }),
    body("companyName", "companyName is required to process").exists({
      checkFalsy: true,
      checkNull: true,
    }),
  ])

  private async insertUpdateCompany(req: any, res: any) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(UNPROCESSABLE_ENTITY).json({
          success: false,
          statusCode: UNPROCESSABLE_ENTITY,
          errors: errors.array(),
          message: "Please check your inputs!",
        });
      }

      const {
        companyId,
        companyName,
        shortName,
        registrationNumber,
        industryType,
        address,
        contactInformation,
        founder_CEO,
        dateofEstablishment,
        numberOfEmployee,
        partnerships,
        logoUrl,
        stateId,
        city,
        pinCode,
        latitude,
        longitude,
        userLimit,
        moduleId,
        email
      } = req.body;


      if (companyId === '') {

        const [userError, userResult] = await asyncWrap(
          runSP("G_UserMasterByEmail", [
            {
              name: 'Email',
              value: email
            },
            {
              name: 'LoginUserID',
              value: 1
            }
          ])
        );

        if (userError) {
          return serverErrorResponse(res)
        }

        if (userResult.recordset.length) {
          return res.status(UNPROCESSABLE_ENTITY).json({
            statusCode: UNPROCESSABLE_ENTITY,
            success: false,
            message: 'You are already registered with us, please try to login!'
          })
        }
      }

      const [error, result] = await asyncWrap(
        runSP("IU_Company", [
          {
            name: "CompanyID",
            value: companyId || 0
          },
          {
            name: "CompanyName",
            value: companyName,
          },
          {
            name: "ShortName",
            value: shortName,
          },
          {
            name: "RegistrationNumber",
            value: registrationNumber || null,
          },
          {
            name: "IndustryType",
            value: industryType || null,
          },
          {
            name: "Address",
            value: address || null,
          },
          {
            name: "ContactInformation",
            value: contactInformation || null,
          },
          {
            name: "Founder_CEO",
            value: founder_CEO || "",
          },
          {
            name: "DateofEstablishment",
            value: dateofEstablishment
          },
          {
            name: "NumberOfEmployee",
            value: numberOfEmployee || null,
          },
          {
            name: "Partnerships",
            value: partnerships || null,
          },
          {
            name: "LOGOURL",
            value: logoUrl || null,
          },
          {
            name: "StateID",
            value: stateId,
          },
          {
            name: "City",
            value: city,
          },
          {
            name: "PinCode",
            value: pinCode,
          },
          {
            name: "Lattitude",
            value: latitude || null,
          },
          {
            name: "Longiitude",
            value: longitude || null,
          },
          {
            name: 'CompanyUserLimit',
            value: userLimit
          },
          {
            name: 'ModuleID',
            value: moduleId || ""
          },
          {
            name: 'Email',
            value: email || ""
          },
          {
            name: 'LoginUserID',
            value: req.payload.userId || 1
          }

        ])
      );

      if (!result) {
        return serverErrorResponse(res);
      }

      if (!companyId) {
        const token = jwt.sign(
          {
            email
          },
          JWT_SECRET,
          {
            expiresIn: "10m",
          }
        );

        const mailBody = `Set your password link is as below \n\n${BASEURL}?token=${token}\n\n This Link is valid for next 10 minutes`;

        const mailResult = await sendEmail(email, "Registration Successful Set Your Password!", mailBody, "");

        if (mailResult.success) {
          return res.status(OK).json({
            success: true,
            statusCode: OK,
            message: 'Reset link sent on email!'
          })
        }
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

  @Delete(":id")
  @Middleware(verifyToken)
  private async deleteInquiryFollowup(req: ISecureRequest, res: Response) {
    const { id } = req.params;

    const [error, result] = await asyncWrap(
      runSP("D_Company", [
        {
          name: "CompanyID",
          value: id,
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
