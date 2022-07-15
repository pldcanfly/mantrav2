'use strict';

import mysql, { MysqlError } from 'mysql';
import { MysqlDBConfig } from '../../..';
import { logger } from '../../appspace.js';
import { DB, JoinObject, WhereObject } from './db.js';

export class MySQL_DB extends DB {
  private connection: any;

  constructor(config: MysqlDBConfig) {
    super();
    this.connection = mysql.createConnection(config);
  }

  execute() {
    let fields: Array<string> | string;
    let query: string = '';
    let values: Array<any> = [];
    let execute = false;

    if (this._fields.length == 0) {
      fields = '*';
    } else {
      fields = [];
      this._fields.forEach((field, index) => {
        fields = index == 0 ? `${field}` : `${fields}, ${field}`;
      });
    }

    switch (this.operation) {
      case 'SELECT':
        execute = true;
        query = `SELECT ${fields} FROM ${this.collection}`;
        break;
      case 'INSERT':
        execute = true;
        query = `INSERT INTO ${this.collection}`;
        break;
      case 'UPDATE':
        execute = true;
        query = `UPDATE ${this.collection}`;
        break;
      case 'DELETE':
        execute = true;
        query = `DELETE FROM ${this.collection}`;
        break;
    }

    if (['SELECT'].includes(this.operation)) {
      if (this._joins.length > 0) {
        this._joins.forEach((join: JoinObject) => {
          query = `${query} ${join.modifier} JOIN ${join.collection} ON (${this.collection}.${join.field1} = ${join.collection}.${join.field2})`;
        });
      }
    }

    if (['UPDATE', 'INSERT'].includes(this.operation)) {
      this._sets.forEach((item, index) => {
        query = index == 0 ? `${query} SET ?? = ?` : `${query}, ?? = ?`;
        values.push(item.field, item.value);
      });
    }

    if (this._wheres.length > 0) {
      var parenopen = false;
      this._wheres.forEach((where: WhereObject, index) => {
        switch (where.type) {
          case 'where':
            if (!parenopen) {
              query = index == 0 ? `${query} WHERE` : `${query} ${where.operator}`;
            } else {
              parenopen = false;
            }
            switch (where.symbol) {
              case 'IN':
                query = `${query} ?? IN(`;
                values.push(where.field);
                (where.value as Array<string>).forEach((value: string, index: number) => {
                  query = index == 0 ? `${query} ?` : `${query} ,?`;
                  values.push(value);
                });
                query = `${query})`;
                break;
              default:
                query = `${query} ?? ${where.symbol} ?`;
                values.push(where.field, where.value);
            }
            break;
          case 'parenthesis_open':
            parenopen = true;
            query = index == 0 ? `${query} WHERE (` : `${query} ${where.operator} (`;
            break;
          case 'parenthesis_close':
            query = `${query} )`;
            break;
        }
      });
    }

    if (this._order.length > 0) {
      query = `${query} `;
      this._order.forEach((order, index) => {
        query = index == 0 ? `${query} ORDER BY ?? ${order.order}` : `${query}, ?? ${order.order}`;
        values.push(order.field);
      });
    }

    //console.log('Query:', query);
    // console.log(' └─ Values:', values);
    if (execute) {
      return new Promise((resolve, reject) => {
        this.connection.query(query, values, (err: MysqlError, rows: any) => {
          if (err) return reject(err);
          resolve(rows);
        });
      })
        .then(function (rows: any) {
          //console.log(rows);
          return rows;
        })
        .catch(function (err: MysqlError) {
          logger.error('MYSQL-ERROR:', err.message);
          return [];
        });
    }
  }
}
