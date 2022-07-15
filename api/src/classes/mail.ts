'use strict';

import { appspace, logger } from '../appspace.js';
import fs from 'fs';
import path from 'path';

type MailOptions = {
  to?: string | Array<string>;
  from?: string;
  subject?: string;
  html?: string;
  text?: string;
};

export class Email {
  private _to: string | Array<string> = '';
  private _from: string = '';
  private _subject: string = '';
  private _text: string = '';
  private _html = true;
  private _debug = false;
  private _replaces: Array<{ variable: string; value: any }> = [];

  to(val: string | Array<string>) {
    this._to = val;
    return this;
  }

  from(val: string) {
    this._from = val;
    return this;
  }

  subject(val: string) {
    this._subject = val;
    return this;
  }

  text(val: string) {
    this._text = val;
    return this;
  }

  fromTemplate(name: string) {
    const template = path.join('mailtemplates', `${name}.html`);
    if (fs.existsSync(template)) {
      this._text = fs.readFileSync(template, { encoding: 'utf-8' });
    } else {
      console.log('Mailtemplate not existing!!', template);
    }

    return this;
  }

  replace(variable: string, value: any) {
    this._replaces.push({ variable, value });
    return this;
  }

  html(val: boolean) {
    this._html = val;
    return this;
  }

  debug() {
    this._debug = true;
    return this;
  }

  async send() {
    const mailOptions: MailOptions = {};

    if (this._to) {
      mailOptions.to = this._to;
    }

    if (this._from) {
      mailOptions.from = this._from;
    }

    if (this._subject) {
      mailOptions.subject = this._subject;
    }

    if (this._text) {
      for (let i = 0; i < this._replaces.length; i++) {
        this._text = this._text.replace(this._replaces[i].variable, this._replaces[i].value);
      }

      if (this._html) {
        mailOptions.html = this._text;
      } else {
        mailOptions.text = this._text;
      }
    }

    if (this._debug) {
      console.log('mailOptions', mailOptions);
      return true;
    } else {
      return await appspace.mail?.send(mailOptions);
    }
  }
}
