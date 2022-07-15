'use strict';

import nodemailer from 'nodemailer';
import { mailconfig } from '../config/mail.js';
import { logger } from '../appspace.js';

export class EmailQue {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport(mailconfig.transporter);
    logger.info('Initializing Mailer');
    logger.info(` └─ via ${mailconfig.transporter.host}`);

    this.transporter.verify(function (error) {
      if (error) {
        logger.error(error);
      } else {
        logger.info('Mailer: Server is ready to take our messages');
      }
    });
    return this;
  }

  async send(mailOptions: any) {
    console.log(mailOptions);
    return this.transporter
      .sendMail(mailOptions)
      .then((res: any) => {
        logger.info(`Mailer: send ${res.response}`);
        return res;
      })
      .catch((err: any) => {
        logger.error(`Mailer: ${err}`);
      });
  }
}
