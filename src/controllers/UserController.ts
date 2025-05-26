import { Controller, Delete, Get, Middleware, Post } from "@overnightjs/core";
import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { compareHash, hashPassword } from "../utils/hashPassword";
import logger from "../config/logger";
import { serverErrorResponse } from "./errors";
import { runSP } from "../db/db";
import { asyncWrap } from "../utils/asyncWrap";
import * as sql from "mssql";
import jwt from "jsonwebtoken";
import { BASEURL, ENCRYPTIONKEY, JWT_EXPIRE, JWT_SECRET } from "../config/config";
import verifyToken from "../middlewares/verifyToken";
import { ISecureRequest } from "@overnightjs/jwt";
import { sendEmail } from "../utils/mail";
import { decrypt, encryt } from "../utils/encrypt";
import redis from '../redis';

const { UNPROCESSABLE_ENTITY, BAD_REQUEST, UNAUTHORIZED, NOT_FOUND, OK } = StatusCodes;

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: Operations related to user management
 */

@Controller("api/user")
export class UserController {

  /**
  * @swagger
  * /api/user:
  *   get:
  *     tags:
  *       - User
  *     description: Get User master
  *     parameters:
  *       - in: query
  *         name: userId
  *         description: ID of the user
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
  *         name: mobile
  *         description: mobile number of user
  *         schema:
  *           type: string
  *       - in: query
  *         name: email
  *         description: email of the user
  *         schema:
  *           type: string
  *       - in: query
  *         name: fullname
  *         description: fullname of the user
  *         schema:
  *           type: string
  *       - in: query
  *         name: roleId
  *         description: user role id
  *         schema:
  *           type: integer
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
  private async getUserMaster(req: any, res: any) {
    const output = {
      name: "TotalRecords",
      type: { type: sql.Int },
    };

    const { pageNo, pageSize, roleId, email, mobile, fullname, userId } = req.query;

    const [error, result] = await asyncWrap(
      runSP(
        "G_UserMaster",
        [
          {
            name: "CompanyID",
            value: req.payload.companyId || 1,
          },
          {
            name: "LoginUserID",
            value: req.payload.userId || 1,
          },
          {
            name: 'RoleID',
            value: roleId,
          },
          {
            name: 'Email',
            value: email || ''
          },
          {
            name: 'MobileNumber',
            value: mobile || ''
          },
          {
            name: 'FullName',
            value: fullname || ''
          },
          {
            name: "PageNo",
            value: pageNo || 1,
          },
          {
            name: "UserId",
            value: userId || 0,
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
      statuCode: OK,
      data: result.recordset,
      total: result.output[output.name],
    });
  }

  @Get("customer")
  @Middleware(verifyToken)
  private async getCustomerMaster(req: any, res: any) {
    const output = {
      name: "TotalRecords",
      type: { type: sql.Int },
    };

    const { pageNo, pageSize, roleId, email, mobile, fullname, userId } = req.query;

    const [error, result] = await asyncWrap(
      runSP(
        "G_Customer",
        [
          {
            name: "CompanyID",
            value: req.payload.companyId || 1,
          },
          {
            name: "LoginUserID",
            value: req.payload.userId || 1,
          },
          {
            name: 'RoleID',
            value: roleId,
          },
          {
            name: 'Email',
            value: email || ''
          },
          {
            name: 'MobileNumber',
            value: mobile || ''
          },
          {
            name: 'FullName',
            value: fullname || ''
          },
          {
            name: "PageNo",
            value: pageNo || 1,
          },
          {
            name: "UserId",
            value: userId || 0,
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
      statuCode: OK,
      data: result.recordset,
      total: result.output[output.name],
    });
  }

  @Get("staff")
  @Middleware(verifyToken)
  private async getStaffMaster(req: any, res: any) {
    const output = {
      name: "TotalRecords",
      type: { type: sql.Int },
    };

    const { pageNo, pageSize, roleId, email, mobile, fullname, userId } = req.query;

    const [error, result] = await asyncWrap(
      runSP(
        "G_Backoffice",
        [
          {
            name: "CompanyID",
            value: req.payload.companyId || 1,
          },
          {
            name: "LoginUserID",
            value: req.payload.userId || 1,
          },
          {
            name: 'RoleID',
            value: roleId,
          },
          {
            name: 'Email',
            value: email || ''
          },
          {
            name: 'MobileNumber',
            value: mobile || ''
          },
          {
            name: 'FullName',
            value: fullname || ''
          },
          {
            name: "PageNo",
            value: pageNo || 1,
          },
          {
            name: "UserId",
            value: userId || 0,
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
      statuCode: OK,
      data: result.recordset,
      total: result.output[output.name],
    });
  }

  @Get("technician")
  @Middleware(verifyToken)
  private async getTechnicianMaster(req: any, res: any) {
    const output = {
      name: "TotalRecords",
      type: { type: sql.Int },
    };

    const { pageNo, pageSize, roleId, email, mobile, fullname, userId } = req.query;

    const [error, result] = await asyncWrap(
      runSP(
        "G_Technician",
        [
          {
            name: "CompanyID",
            value: req.payload.companyId || 1,
          },
          {
            name: "LoginUserID",
            value: req.payload.userId || 1,
          },
          {
            name: 'RoleID',
            value: roleId,
          },
          {
            name: 'Email',
            value: email || ''
          },
          {
            name: 'MobileNumber',
            value: mobile || ''
          },
          {
            name: 'FullName',
            value: fullname || ''
          },
          {
            name: "PageNo",
            value: pageNo || 1,
          },
          {
            name: "UserId",
            value: userId || 0,
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
      statuCode: OK,
      data: result.recordset,
      total: result.output[output.name],
    });
  }

  /**
   * @swagger
   * /api/user:
   *   post:
   *     tags:
   *       - User
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
   *               CompanyID:
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
  @Middleware([
    body("Email", "Email is required to process")
      .exists({ checkFalsy: true, checkNull: true })
      .isEmail(),
    body("RoleID", "RoleID is required to process").exists({
      checkFalsy: true,
      checkNull: true,
    }),
    body("FirstName", "FirstName is required to process").exists({
      checkFalsy: true,
      checkNull: true,
    }),
    body("LastName", "LastName is required to process").exists({
      checkFalsy: true,
      checkNull: true,
    }),
    body("MobileNumber", "MobileNumber is required to process").exists({
      checkFalsy: true,
      checkNull: true,
    }),
    body("Gender", "Gender is required to process").exists({
      checkFalsy: true,
      checkNull: true,
    }),
    body("Birthdate", "Birthdate is required to process").exists({
      checkFalsy: true,
      checkNull: true,
    }),
    body("Address", "Address is required to process").exists({
      checkFalsy: true,
      checkNull: true,
    }),
    verifyToken
  ])
  private async insertUpdateUser(req: ISecureRequest, res: Response) {
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
        UserID,
        RoleID,
        Email,
        Password,
        FirstName,
        LastName,
        Gender,
        Birthdate,
        Address,
        Latitude,
        Longitude,
        RefferalCode,
        MobileNumber,
        stateId,
        city,
        pinCode,
        UserTypeID
      } = req.body;


      if (UserID === "") {

        const [userError, userResult] = await asyncWrap(
          runSP("G_UserMasterByEmail", [
            {
              name: 'Email',
              value: Email
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
        runSP("IU_RegisterUser", [
          {
            name: "CompanyID",
            value: req.payload.companyId,
          },
          {
            name: "UserID",
            value: UserID || 0,
          },
          {
            name: "RoleID",
            value: RoleID,
          },
          {
            name: "Email",
            value: Email,
          },
          {
            name: "FirstName",
            value: FirstName,
          },
          {
            name: "LastName",
            value: LastName,
          },
          {
            name: "Password",
            value: Password ? hashPassword(Password) : "",
          },
          {
            name: "Gender",
            value: Gender,
          },
          {
            name: "MobileNumber",
            value: MobileNumber,
          },
          {
            name: "Birthdate",
            value: Birthdate,
          },
          {
            name: "LoginUserID",
            value: req.payload.userId,
          },
          {
            name: "Lattitude",
            value: Latitude || null,
          },
          {
            name: "Longiitude",
            value: Longitude || null,
          },
          {
            name: "RefferalCode",
            value: RefferalCode || null,
          },
          {
            name: "Address",
            value: Address,
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
            name: "UserTypeID",
            value: UserTypeID,
          },
          {
            name: "PinCode",
            value: pinCode,
          },
        ])
      );

      if (!result) {
        return serverErrorResponse(res);
      }

      if (!UserID) {
        const token = jwt.sign(
          {
            email: Email
          },
          JWT_SECRET,
          {
            expiresIn: "10m",
          }
        );

        const mailBody = `${BASEURL}?token=${token}\n\n This Link is valid for next 10 minutes`;

        const mailResult = await sendEmail(Email, "Reset your password!", mailBody, "");

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
        message: result.recordset[0].Message,
        statusCode: OK
      });
    } catch (error) {
      logger.error(error);
      serverErrorResponse(res);
    }
  }

  /**
   * @swagger
   * /api/user/login:
   *   post:
   *     tags:
   *       - User
   *     description: User login endpoint
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *               companyId:
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

  @Post("login")
  @Middleware([
    body("email", "Email is required to process")
      .exists({ checkFalsy: true, checkNull: true })
      .isEmail(),
    body("password", "Password is required to process").exists({
      checkFalsy: true,
      checkNull: true,
    }),
  ])
  private async userLogin(req: any, res: any) {
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

      const { email, password, companyId } = req.body;

      const [error, result] = await asyncWrap(
        runSP("G_ValidateUser", [
          {
            name: "Email",
            value: email,
          },
          {
            name: "LoginUserID",
            value: req.userId || -1,
          },
        ])
      );

      if (!result) {
        return serverErrorResponse(res);
      }

      if (!result.recordset.length) {
        return res.status(NOT_FOUND).json({
          success: false,
          message: "No user found with this email",
        });
      }

      const { UserID, CompanyID, RoleID, Password } = result.recordset[0];

      //   if (!IsVerified) {
      //     return res.status(UNAUTHORIZED).json({
      //       success: false,
      //       message: "Email not verified!",
      //     });
      //   }

      if (!compareHash(password, Password)) {
        return res.status(UNAUTHORIZED).json({
          success: false,
          message: "Email/Password does not match. Please retry.",
        });
      }

      const token = jwt.sign(
        {
          companyId: CompanyID,
          roleId: RoleID,
          userId: UserID,
        },
        JWT_SECRET,
        {
          expiresIn: JWT_EXPIRE,
        }
      );

      return res.status(OK).json({
        token,
        success: true,
        statusCode: OK,
        message: "Login success.",
        userData: {
          userId: UserID,
          ...result.recordset[0],
        },
      });
    } catch (error) {
      logger.error(error);
      serverErrorResponse(res);
    }
  }


  /**
 * @swagger
 * /api/user/check-auth:
 *   get:
 *     tags:
 *       - User
 *     description: User login check endpoint
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

  @Get("check-auth")
  @Middleware(verifyToken)
  private async checkUserLogin(req: any, res: any) {
    try {

      const output = {
        name: "TotalRecords",
        type: { type: sql.Int },
      };

      const [error, result] = await asyncWrap(
        runSP(
          "G_UserMaster",
          [
            {
              name: "CompanyID",
              value: req.payload.companyId || 1,
            },
            {
              name: "LoginUserID",
              value: req.payload.userId || 1,
            },
            {
              name: "PageNo",
              value: -1,
            },
            {
              name: "UserId",
              value: req.payload.userId || 0,
            },
            {
              name: "PageSize",
              value: 10,
            },
          ],
          output
        )
      );


      if (!result) {
        return serverErrorResponse(res);
      }

      const { UserID } = result.recordset[0];

      //   if (!IsVerified) {
      //     return res.status(UNAUTHORIZED).json({
      //       success: false,
      //       message: "Email not verified!",
      //     });
      //   }

      return res.status(OK).json({
        success: true,
        statusCode: OK,
        message: "User Logged In",
        userData: {
          userId: UserID,
          ...result.recordset[0],
        },
      });
    } catch (error) {
      logger.error(error);
      serverErrorResponse(res);
    }
  }

  /**
   * @swagger
   * /api/user/role:
   *   post:
   *     tags:
   *       - User
   *     description: User login endpoint
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               RoleId:
   *                 type: integer
   *                 example: 0
   *               roleName:
   *                 type: string
   *               roleCode:
   *                 type: string
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

  @Post("role")
  @Middleware([
    body("roleName", "RoleName is required to process").exists({
      checkFalsy: true,
      checkNull: true,
    }),
    body("roleCode", "RoleCode is required to process").exists({
      checkFalsy: true,
      checkNull: true,
    }),
    verifyToken
  ])
  private async insertUpdateUserRole(req: any, res: any) {
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

      const { roleId, roleName, roleCode, description } = req.body;

      const [error, result] = await asyncWrap(
        runSP("IU_Roles", [
          {
            name: "RoleId",
            value: roleId || 0,
          },
          {
            name: "CompanyID",
            value: req.payload.companyId
          },
          {
            name: "RoleName",
            value: roleName,
          },
          {
            name: "RoleCode",
            value: roleCode,
          },
          {
            name: "basicdescription",
            value: description,
          },
          {
            name: "LoginUserID",
            value: req.payload.userId || -1,
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
   * /api/user/roles:
   *   get:
   *     tags:
   *       - User
   *     description: Get user roles
   *     parameters:
   *       - in: query
   *         name: id
   *         description: Role id
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

  @Get("roles")
  @Middleware(verifyToken)
  private async getGstDetails(req: any, res: any) {
    const output = {
      name: "TotalRecord",
      type: { type: sql.Int },
    };
    const { id, pageNo, pageSize, companyId } = req.query;

    const [error, result] = await asyncWrap(
      runSP(
        "G_Roles",
        [
          {
            name: "RoleId",
            value: id || 0,
          },
          {
            name: "CompanyID",
            value: companyId || req.payload.companyId
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
* /api/user/role/:
*   delete:
*     tags:
*     - User
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
  @Delete('role/:id')
  @Middleware(verifyToken)
  private async deleteUserRole(req: ISecureRequest, res: Response) {

    const { id } = req.params;

    const [error, result] = await asyncWrap(
      runSP("D_Roles", [
        {
          name: "RoleID",
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


  @Post('forgot-password')
  private async forgotPass(req: any, res: any) {

    const { email } = req.body;

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

    if (userResult.recordset.length === 0) {
      return res.status(UNPROCESSABLE_ENTITY).json({
        statusCode: UNPROCESSABLE_ENTITY,
        success: false,
        message: 'Invalid Email Address!'
      })
    }

    const { Email } = userResult.recordset[0];

    const token = jwt.sign(
      {
        email: Email
      },
      JWT_SECRET,
      {
        expiresIn: "10m",
      }
    );

    const redisKey = `used_forgot_token_${token}`;
    redis.set(redisKey, 0)
    redis.expire(redisKey, 10 * 60);

    const mailBody = `${BASEURL}?token=${token}`;

    const mailResult = await sendEmail(Email, "Reset your password!", mailBody, "");

    if (mailResult.success) {
      return res.status(OK).json({
        success: true,
        statusCode: OK,
        message: 'Reset link sent on email!'
      })
    } else {
      return serverErrorResponse(res);
    }
  }

  @Post("reset-password")
  @Middleware(
    body("password", "Password is required to process").exists({
      checkFalsy: true,
      checkNull: true,
    }))

  private async resetPassword(req: any, res: any) {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(UNPROCESSABLE_ENTITY).json({
        success: false,
        code: -1,
        errors: errors.array(),
        message: "Please check your inputs!",
      });
    }

    const { password } = req.body;

    const redisKey = `used_forgot_token_${req.headers.authorization}`

    const isTokenUsed: string = await redis.get(redisKey);

    if (+isTokenUsed > 0) {
      return res.status(BAD_REQUEST).send({
        success: false,
        message: 'Link is expired now as user has used it once and password is set successfully'
      })
    }

    const payload: any | null = jwt.verify(req.headers.authorization.toString(), JWT_SECRET, (err: any, payload: any) => {
      if (err) {
        logger.error(err)
        return null
      }

      return payload
    })

    if (payload === null) {
      return res.status(UNAUTHORIZED).send({
        success: false,
        message: 'Link is expired, please go to forgot password page and try again!'
      })
    }

    const [userError, userResult] = await asyncWrap(
      runSP("G_UserMasterByEmail", [
        {
          name: 'Email',
          value: payload.email,
        },
        {
          name: 'LoginUserID',
          value: -1
        }
      ])
    );

    if (userResult.recordset.length === 0) {
      return res.status(NOT_FOUND).send({
        success: false,
        message: 'No user found with this token!'
      })
    }

    const { Password, UserID, Email } = userResult.recordset[0];

    if (compareHash(password, Password)) {
      return res.status(BAD_REQUEST).send({
        success: false,
        message: 'New password is same as old password!'
      })
    }

    const [resetError, resetResult] = await asyncWrap(
      runSP("U_ResetPassword", [
        {
          name: 'UserID',
          value: UserID,
        },
        {
          name: 'Password',
          value: hashPassword(password)
        }
      ])
    )

    if (!resetResult) {
      return serverErrorResponse(res);
    }

    redis.set(redisKey, 1)

    const token = jwt.sign(
      {
        email: Email
      },
      JWT_SECRET,
      {
        expiresIn: "10m",
      }
    );

    const newKey = `used_forgot_token_${token}`

    redis.set(newKey, 0);
    redis.expire(newKey, 10 * 60)

    const mailBody = `Your password is reset successfully.\n\n if you have not done this, Kindly report it to your Admin or change the password using below link\n\n ${BASEURL}?token=${token}`;

    const mailResult = await sendEmail(Email, "Password Reset Successfully!", mailBody, "");

    return res.status(OK).send({
      success: true,
      message: 'Thanks, Password changed successfully!'
    })
  }

  @Delete(":id")
  @Middleware(verifyToken)
  private async deleteInquiryFollowup(req: ISecureRequest, res: Response) {
    const { id } = req.params;

    const [error, result] = await asyncWrap(
      runSP("D_UserMaster", [
        {
          name: "UserID",
          value: id || 0,
        },
        {
          name: "CompanyID",
          value: req.payload?.companyId,
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