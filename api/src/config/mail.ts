'use strict';

import SMTPTransport from 'nodemailer/lib/smtp-transport';

let conf: {
  email?: string;
  transporter?: any;
} = {};

if (process.env.NODE_ENV == 'live') {
  conf = {
    email: 'test@test.at',
    transporter: {
      pool: true,
      rateLimit: 5,
      host: '127.0.0.1',
      port: 25,
      // auth: {
      //   user: 'gregoria.reinger@ethereal.email',
      //   pass: 'ySCXw7cdJA95sjX1uP',
      // },
    },
  };
} else {
  conf = {
    email: 'test@test.at',
    transporter: {
      pool: true,
      rateLimit: 5,
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'gregoria.reinger@ethereal.email',
        pass: 'ySCXw7cdJA95sjX1uP',
      },
    },
  };
}

export const mailconfig = conf;
