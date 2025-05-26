import { Controller, Middleware, Post } from "@overnightjs/core";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import logger from "../config/logger";
import { serverErrorResponse } from "./errors";
import { imageMiddleWare } from "../middlewares/uploadMiddleware";
import verifyToken from "../middlewares/verifyToken";

/**
 * @swagger
 * tags:
 *   - name: Upload 
 *     description: Operations related to file upload
 */


@Controller('api/upload')
export class UploadController {

    /**
 * @swagger
 * /api/upload:
 *   post:
 *     tags:
 *       - Upload
 *     description: Upload a file
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         description: The file to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: Bad request - Invalid file or missing file
 */

    @Post('')
    @Middleware([imageMiddleWare])
    private async uploadImage(req: any, res: Response) {
        try {
            if (!(req.file && req.file.key)) {
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({
                    statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
                    success: false,
                    code: 0,
                    message: 'Please upload a file'
                });
            }

            return res.status(StatusCodes.OK).send({
                statusCode: StatusCodes.OK,
                success: true,
                message: 'File uploaded successfully',
                fileUrl: req.file.location
            });
        } catch (error) {
            logger.error(error)
            serverErrorResponse(res)
        }
    }
}