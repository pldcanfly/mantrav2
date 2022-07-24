'use strict';

import { AggregateObject, DB, DistinctObject, FieldObject, JoinObject, WhereObject } from './db';
import { Pool, PoolConfig, QueryResult } from 'pg';

import pgformat from 'pg-format';
export class PostgreSQL_DB extends DB {
  pool;
  constructor(pooloptions?: PoolConfig) {
    super();
    this.pool = new Pool(pooloptions);
  }

  close() {
    this.pool.end();
  }

  execute() {
    let query: string = '';
    let values: Array<any> = [];

    var schema = process.env.PGSCHEMA || '';

    var tablename: string;

    if (schema == '') {
      tablename = pgformat('%s', this.collection);
    } else {
      tablename = pgformat('%s.%I', schema, this.collection);
    }

    switch (this.operation) {
      case 'SELECT':
        query = 'SELECT ';

        if (this._distinct.length > 0) {
          query = `${query}DISTINCT ON (`;
          this._distinct.forEach((distinct: DistinctObject, index: number) => {
            if (distinct.table) {
              query = index == 0 ? `${query}%s.%I` : `${query}, %s.%I`;
              values.push(distinct.table, distinct.field);
            } else {
              query = index == 0 ? `${query}%I` : `${query}, %I`;
              values.push(distinct.field);
            }
          });
          if (this._distinct[0].table) {
            query = `${query}) %s.%I,`;
            values.push(this._distinct[0].table, this._distinct[0].field);
          } else {
            query = `${query}) %I,`;
            values.push(this._distinct[0].field);
          }
        }

        if (this._fields.length == 0 && this._aggregates.length == 0) {
          query = `${query}*`;
        }

        if (this._fields.length > 0) {
          this._fields.forEach((field: FieldObject, index: number) => {
            if (field.table) {
              query = index == 0 ? `${query}%s.%I` : `${query}, %s.%I`;
              values.push(field.table, field.field);
            } else {
              query = index == 0 ? `${query}%I` : `${query}, %I`;
              values.push(field.field);
            }
          });
        }

        if (this._aggregates.length > 0) {
          if (this._fields.length != 0) {
            query = `${query}, `;
          }
          this._aggregates.forEach((aggregate: AggregateObject, index: number) => {
            if (aggregate.table) {
              query = index == 0 ? `${query}%s(%s.%I)` : `${query}, %s(%s.%I)`;
              values.push(aggregate.func, aggregate.table, aggregate.field);
            } else {
              query = index == 0 ? `${query}%s(%I)` : `${query}, %s(%I)`;
              values.push(aggregate.func, aggregate.field);
            }
          });
        }

        query = `${query} FROM ${tablename}`;
        break;
      case 'INSERT':
        query = `INSERT INTO ${tablename}`;
        break;
      case 'UPDATE':
        query = `UPDATE ${tablename}`;
        break;
      case 'DELETE':
        query = `DELETE FROM ${tablename}`;
        break;
    }

    if (['SELECT'].includes(this.operation)) {
      if (this._joins.length > 0) {
        this._joins.forEach((join: JoinObject) => {
          let table1 = join.table1 || this.collection;
          let table2 = join.table2 || join.collection;

          if (schema == '') {
            query = `${query} ${join.modifier} JOIN %s ON (%s.%I = %s.%I)`;
            values.push(join.collection, table1, join.field1, table2, join.field2);
          } else {
            query = `${query} ${join.modifier} JOIN %s.%I ON (%s.%I.%I = %s.%I.%I)`;
            values.push(schema, join.collection, schema, table1, join.field1, schema, table2, join.field2);
          }
        });
      }
    }

    if (['UPDATE'].includes(this.operation)) {
      this._sets.forEach((item, index) => {
        query = index == 0 ? `${query} SET %I = %L` : `${query}, %I = %L`;
        values.push(item.field, item.value);
      });
    }

    if (['INSERT'].includes(this.operation)) {
      const insertfields: Array<string> = [];
      const insertvalues: Array<any> = [];

      this._sets.forEach((item, index) => {
        insertfields.push(item.field);
        insertvalues.push(item.value);
      });

      query = `${query}(%I) VALUES (%L) RETURNING *`;
      values.push(insertfields, insertvalues);
    }

    if (['SELECT'].includes(this.operation) && this._limit.fuzzy && this._limit.limit >= 0 && this._limit.offset > 0) {
      const where: WhereObject = {
        type: 'where',
        field: this._limit.fuzzyfield,
        symbol: '>',
        value: this._limit.offset,
        operator: 'AND',
      };

      if (this._limit.fuzzytable) where.table = this._limit.fuzzytable;

      this._wheres.push(where);
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
            switch (where.symbol?.toLowerCase()) {
              case 'in':
                if (where.table) {
                  query = `${query} %s.%I IN(%L)`;
                  values.push(where.table);
                  values.push(where.field);
                  values.push(where.value);
                } else {
                  query = `${query} %I IN(%L)`;
                  values.push(where.field);
                  values.push(where.value);
                }

                break;
              case 'between':
                if (Array.isArray(where.value)) {
                  if (where.table) {
                    query = `${query} %s.%I BETWEEN %L AND %L`;
                    values.push(where.table);
                    values.push(where.field);
                    values.push(where.value[0]);
                    values.push(where.value[1]);
                  } else {
                    query = `${query} %I BETWEEN %L AND %L`;
                    values.push(where.field);
                    values.push(where.value[0]);
                    values.push(where.value[1]);
                  }
                }
                break;

              default:
                if (where.table) {
                  query = `${query} %I.%I ${where.symbol} %L`;
                  values.push(where.table);
                  values.push(where.field, where.value);
                } else {
                  query = `${query} %I ${where.symbol} %L`;
                  values.push(where.field, where.value);
                }
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

    if (['SELECT'].includes(this.operation) && this._group.length > 0) {
      query = `${query} GROUP BY %I`;
      values.push(this._group);
    }

    if (this._order.length > 0) {
      this._order.forEach((order, index) => {
        if (order.table) {
          query = index == 0 ? `${query} ORDER BY %s.%I ${order.order}` : `${query}, %s.%I ${order.order}`;
          values.push(order.table);
          values.push(order.field);
        } else {
          query = index == 0 ? `${query} ORDER BY %I ${order.order}` : `${query}, %I ${order.order}`;
          values.push(order.field);
        }
      });
    }

    if (['SELECT'].includes(this.operation) && this._limit.limit >= 0) {
      query = `${query} LIMIT %s`;
      values.push(this._limit.limit);

      if (!this._limit.fuzzy && this._limit.offset > 0) {
        query = `${query} OFFSET %s`;
        values.push(this._limit.offset);
      }
    }

    const safequery = pgformat.withArray(query, values);
    if (this._debug) {
      console.log(` └─ Safequery: ${safequery}`);
    }

    return this.pool
      .query(safequery)
      .then((result: QueryResult) => result.rows)
      .catch((err: any) => {
        if (this._errors) console.log(`PGSQL-ERROR: ${err}`);
        return Promise.reject(err);
      });
  }
}
