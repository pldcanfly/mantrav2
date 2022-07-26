'use strict';

export interface JoinObject {
  modifier: string;
  collection: string;
  field1: string;
  field2: string;
  table1?: string;
  table2?: string;
}

export interface WhereObject {
  type?: string;
  field?: string;
  symbol?: string;
  value?: string | number | Array<string> | Array<number> | object | boolean;
  operator?: string;
  table?: string;
}

export interface SetObject {
  field: string;
  value: any;
}

export interface OrderObject {
  field: string;
  order: string;
  table?: string;
}

export interface AggregateObject {
  func: AggregateFunction;
  field: string;
  table?: string;
}

export interface DistinctObject {
  field: string;
  table?: string;
}

export interface FieldObject {
  field: string;
  table?: string;
}

export interface LimitObject {
  limit: number;
  offset: number;
  fuzzy: boolean;
  fuzzyfield: string;
  fuzzytable?: string;
}

export type AggregateFunction = 'MAX' | 'MIN' | 'COUNT' | 'SUM' | 'AVG';

export class DB {
  _wheres: Array<WhereObject> = [];
  _fields: Array<FieldObject> = [];
  _aggregates: Array<AggregateObject> = [];
  _sets: Array<SetObject> = [];
  _joins: Array<JoinObject> = [];
  _order: Array<OrderObject> = [];
  _group: Array<string> = [];
  collection: string = '';
  operation: string = 'SELECT';
  _errors: boolean = true;
  _distinct: Array<DistinctObject> = [];
  _debug = false;
  _limit: LimitObject = { limit: -1, offset: 0, fuzzy: false, fuzzyfield: 'id' };

  query(collection: string) {
    this.collection = collection;
    this._wheres = [];
    this._fields = [];
    this._group = [];
    this._aggregates = [];
    this._sets = [];
    this._joins = [];
    this._order = [];
    this._errors = true;
    this._distinct = [];
    this._limit = { limit: -1, offset: 0, fuzzy: false, fuzzyfield: 'id' };
    this.operation = 'SELECT';
    return this;
  }

  errors(errors: boolean) {
    this._errors = errors;

    return this;
  }

  select() {
    this.operation = 'SELECT';
    return this;
  }

  update() {
    this.operation = 'UPDATE';
    return this;
  }

  insert() {
    this.operation = 'INSERT';
    return this;
  }

  delete(softdelete?: boolean) {
    if (!softdelete) {
      this.operation = 'DELETE';
      return this;
    } else {
      this.operation = 'UPDATE';
      this.set('deleted', true);
      return this;
    }
  }

  debug() {
    this._debug = true;
    return this;
  }

  fuzzy(field?: string) {
    this._limit.fuzzy = true;

    if (field) {
      this._limit.fuzzyfield = field;
      if (field.includes('.')) {
        this._limit.fuzzyfield = field.split('.')[1];
        this._limit.fuzzytable = field.split('.')[0];
      }
    }

    return this;
  }

  limit(limit?: number, offset?: number) {
    this._limit.limit = 100;

    if (limit !== undefined) {
      this._limit.limit = limit;
    }

    if (offset !== undefined) {
      this._limit.offset = offset;
    }

    return this;
  }

  set(field: string | { [propName: string]: any }, value?: any) {
    if (typeof field === 'string') {
      this._sets.push({ field, value });
    }

    if (typeof field === 'object') {
      for (const fieldname in field) {
        this._sets.push({ field: fieldname, value: field[fieldname] });
      }
    }
    return this;
  }

  fields(fields: string | Array<string>) {
    if (Array.isArray(fields)) {
      for (const field of fields) {
        let table = undefined;
        let realfield = field;
        if (field.includes('.')) {
          realfield = field.split('.')[1];
          table = field.split('.')[0];
        }
        this._fields.push({
          field: realfield,
          table,
        });
      }
    } else {
      let table = undefined;
      let realfield = fields;
      if (fields.includes('.')) {
        realfield = fields.split('.')[1];
        table = fields.split('.')[0];
      }
      this._fields.push({
        field: realfield,
        table,
      });
    }

    return this;
  }

  aggregate(func: AggregateFunction, field: string) {
    let table = undefined;
    let realfield = field;
    if (field.includes('.')) {
      realfield = field.split('.')[1];
      table = field.split('.')[0];
    }
    this._aggregates.push({
      func,
      field: realfield,
      table,
    });
    return this;
  }

  distinct(fields: string | Array<string>) {
    if (Array.isArray(fields)) {
      for (const field of fields) {
        let table = undefined;
        let realfield = field;
        if (field.includes('.')) {
          realfield = field.split('.')[1];
          table = field.split('.')[0];
        }
        this._distinct.push({
          field: realfield,
          table,
        });
      }
    } else {
      let table = undefined;
      let realfield = fields;
      if (fields.includes('.')) {
        realfield = fields.split('.')[1];
        table = fields.split('.')[0];
      }
      this._distinct.push({
        field: realfield,
        table,
      });
    }

    return this;
  }

  order(field: string, asc?: string) {
    let table = undefined;
    let realfield = field;
    if (field.includes('.')) {
      realfield = field.split('.')[1];
      table = field.split('.')[0];
    }
    this._order.push({
      field: realfield,
      order: asc || 'ASC',
      table,
    });
    return this;
  }

  group(field: string) {
    this._group.push(field);
    return this;
  }

  join(collection: string, field1: string, field2: string, modifier?: string) {
    let table1 = undefined;
    let table2 = undefined;
    let realfield1 = field1;
    let realfield2 = field2;
    if (field1.includes('.')) {
      realfield1 = field1.split('.')[1];
      table1 = field1.split('.')[0];
    }

    if (field2.includes('.')) {
      realfield2 = field2.split('.')[1];
      table2 = field2.split('.')[0];
    }

    this._joins.push({
      collection,
      field1: realfield1,
      field2: realfield2,
      table1: table1,
      table2: table2,
      modifier: modifier || 'INNER',
    });
    return this;
  }

  where(field: string, symbol: string, value: object | string | number | Array<string> | Array<number> | boolean, operator?: string) {
    let table = undefined;
    let realfield = field;
    if (field.includes('.')) {
      realfield = field.split('.')[1];
      table = field.split('.')[0];
    }
    this._wheres.push({
      type: 'where',
      operator: operator || 'AND',
      field: realfield,
      symbol,
      value,
      table,
    });
    return this;
  }

  parentesisOpen(operator?: string) {
    // TODO: Wonky Implementation
    this._wheres.push({
      type: 'parenthesis_open',
      operator: operator || 'AND',
    });
    return this;
  }

  parentesisClose() {
    this._wheres.push({
      type: 'parenthesis_close',
    });
    return this;
  }
}
