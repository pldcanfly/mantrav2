'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgreSQL_DB = void 0;
const db_1 = require("../db");
const pg_1 = require("pg");
const pg_format_1 = __importDefault(require("pg-format"));
class PostgreSQL_DB extends db_1.DB {
    constructor(pooloptions) {
        super();
        this.pool = new pg_1.Pool(pooloptions);
    }
    close() {
        this.pool.end();
    }
    execute() {
        let query = '';
        let values = [];
        var schema = process.env.PGSCHEMA || '';
        var tablename;
        if (schema == '') {
            tablename = (0, pg_format_1.default)('%s', this.collection);
        }
        else {
            tablename = (0, pg_format_1.default)('%s.%I', schema, this.collection);
        }
        switch (this.operation) {
            case 'SELECT':
                query = 'SELECT ';
                if (this._distinct.length > 0) {
                    query = `${query}DISTINCT ON (`;
                    this._distinct.forEach((distinct, index) => {
                        if (distinct.table) {
                            query = index == 0 ? `${query}%s.%I` : `${query}, %s.%I`;
                            values.push(distinct.table, distinct.field);
                        }
                        else {
                            query = index == 0 ? `${query}%I` : `${query}, %I`;
                            values.push(distinct.field);
                        }
                    });
                    if (this._distinct[0].table) {
                        query = `${query}) %s.%I,`;
                        values.push(this._distinct[0].table, this._distinct[0].field);
                    }
                    else {
                        query = `${query}) %I,`;
                        values.push(this._distinct[0].field);
                    }
                }
                if (this._fields.length == 0 && this._aggregates.length == 0) {
                    query = `${query}*`;
                }
                if (this._fields.length > 0) {
                    this._fields.forEach((field, index) => {
                        if (field.table) {
                            query = index == 0 ? `${query}%s.%I` : `${query}, %s.%I`;
                            values.push(field.table, field.field);
                        }
                        else {
                            query = index == 0 ? `${query}%I` : `${query}, %I`;
                            values.push(field.field);
                        }
                    });
                }
                if (this._aggregates.length > 0) {
                    if (this._fields.length != 0) {
                        query = `${query}, `;
                    }
                    this._aggregates.forEach((aggregate, index) => {
                        if (aggregate.table) {
                            query = index == 0 ? `${query}%s(%s.%I)` : `${query}, %s(%s.%I)`;
                            values.push(aggregate.func, aggregate.table, aggregate.field);
                        }
                        else {
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
                this._joins.forEach((join) => {
                    let table1 = join.table1 || this.collection;
                    let table2 = join.table2 || join.collection;
                    if (schema == '') {
                        query = `${query} ${join.modifier} JOIN %s ON (%s.%I = %s.%I)`;
                        values.push(join.collection, table1, join.field1, table2, join.field2);
                    }
                    else {
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
            const insertfields = [];
            const insertvalues = [];
            this._sets.forEach((item, index) => {
                insertfields.push(item.field);
                insertvalues.push(item.value);
            });
            query = `${query}(%I) VALUES (%L) RETURNING *`;
            values.push(insertfields, insertvalues);
        }
        if (['SELECT'].includes(this.operation) && this._limit.fuzzy && this._limit.limit >= 0 && this._limit.offset > 0) {
            const where = {
                type: 'where',
                field: this._limit.fuzzyfield,
                symbol: '>',
                value: this._limit.offset,
                operator: 'AND',
            };
            if (this._limit.fuzzytable)
                where.table = this._limit.fuzzytable;
            this._wheres.push(where);
        }
        if (this._wheres.length > 0) {
            var parenopen = false;
            this._wheres.forEach((where, index) => {
                var _a;
                switch (where.type) {
                    case 'where':
                        if (!parenopen) {
                            query = index == 0 ? `${query} WHERE` : `${query} ${where.operator}`;
                        }
                        else {
                            parenopen = false;
                        }
                        switch ((_a = where.symbol) === null || _a === void 0 ? void 0 : _a.toLowerCase()) {
                            case 'in':
                                if (where.table) {
                                    query = `${query} %s.%I IN(%L)`;
                                    values.push(where.table);
                                    values.push(where.field);
                                    values.push(where.value);
                                }
                                else {
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
                                    }
                                    else {
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
                                }
                                else {
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
                }
                else {
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
        const safequery = pg_format_1.default.withArray(query, values);
        if (this._debug) {
            console.log(` └─ Safequery: ${safequery}`);
        }
        return this.pool
            .query(safequery)
            .then((result) => result.rows)
            .catch((err) => {
            if (this._errors)
                console.log(`PGSQL-ERROR: ${err}`);
            return Promise.reject(err);
        });
    }
}
exports.PostgreSQL_DB = PostgreSQL_DB;
