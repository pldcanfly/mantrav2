import { DB } from '../../../classes/dbs/db.js';

describe('classes', () => {
  describe('DB', () => {
    var q: DB;

    beforeEach(() => {
      q = new DB().query('user');
    });

    it('sets the table on query()', () => {
      expect(q.collection).toBe('user');
    });

    it('sets the operations', () => {
      expect(q.operation).toBe('SELECT');
      expect(q.select().operation).toBe('SELECT');
      expect(q.update().operation).toBe('UPDATE');
      expect(q.insert().operation).toBe('INSERT');
      expect(q.delete().operation).toBe('DELETE');

      expect(q.delete(true).operation).toBe('UPDATE');
      expect(q.delete(true)._sets).toEqual(expect.arrayContaining([{ field: 'deleted', value: true }]));
    });

    it('handles setting debug', () => {
      expect(q.debug()._debug).toBe(true);
    });

    it('handles supressing errors', () => {
      expect(q._errors).toBe(true);
      expect(q.errors(false)._errors).toBe(false);
    });

    describe('fields()', () => {
      it('sets the name of a single field', () => {
        expect(q.fields('name')._fields).toEqual(expect.arrayContaining([{ field: 'name', table: undefined }]));
      });

      it('sets the schema if provided', () => {
        expect(q.fields('styria.name')._fields).toEqual(expect.arrayContaining([{ field: 'name', table: 'styria' }]));
      });

      it('handles multiple fields via array', () => {
        expect(q.fields(['name', 'login'])._fields).toEqual(
          expect.arrayContaining([
            { field: 'name', table: undefined },
            { field: 'login', table: undefined },
          ])
        );
      });

      it('handles multiple fields and a scheme via array', () => {
        expect(q.fields(['styria.name', 'styria.login'])._fields).toEqual(
          expect.arrayContaining([
            { field: 'name', table: 'styria' },
            { field: 'login', table: 'styria' },
          ])
        );
      });
    });

    describe('where()', () => {
      it('handles a minimal statement', () => {
        expect(q.where('name', '=', 'admin')._wheres).toEqual(expect.arrayContaining([{ field: 'name', operator: 'AND', value: 'admin', symbol: '=', table: undefined, type: 'where' }]));
      });

      it('handles fields with a schema', () => {
        expect(q.where('styria.name', '=', 'admin')._wheres).toEqual(expect.arrayContaining([{ field: 'name', operator: 'AND', value: 'admin', symbol: '=', table: 'styria', type: 'where' }]));
      });

      it('handels multiple datatypes', () => {
        // string
        expect(q.where('name', '=', 'string')._wheres).toEqual(expect.arrayContaining([{ field: 'name', operator: 'AND', value: 'string', symbol: '=', table: undefined, type: 'where' }]));
        // boolean
        expect(q.where('name', '=', true)._wheres).toEqual(expect.arrayContaining([{ field: 'name', operator: 'AND', value: true, symbol: '=', table: undefined, type: 'where' }]));
        // number
        expect(q.where('name', '=', 1)._wheres).toEqual(expect.arrayContaining([{ field: 'name', operator: 'AND', value: 1, symbol: '=', table: undefined, type: 'where' }]));
        // Array<number>
        expect(q.where('name', '=', [1, 2, 3])._wheres).toEqual(expect.arrayContaining([{ field: 'name', operator: 'AND', value: [1, 2, 3], symbol: '=', table: undefined, type: 'where' }]));
        // Array<string>
        expect(q.where('name', '=', ['1', '2', '3'])._wheres).toEqual(expect.arrayContaining([{ field: 'name', operator: 'AND', value: ['1', '2', '3'], symbol: '=', table: undefined, type: 'where' }]));
        // Object
        expect(q.where('name', '=', { test: test })._wheres).toEqual(expect.arrayContaining([{ field: 'name', operator: 'AND', value: { test: test }, symbol: '=', table: undefined, type: 'where' }]));
      });

      it('handles different operators', () => {
        expect(q.where('name', '=', 'admin', 'OR')._wheres).toEqual(expect.arrayContaining([{ field: 'name', operator: 'OR', value: 'admin', symbol: '=', table: undefined, type: 'where' }]));
      });

      it('handles multiple statements on the same query', () => {
        expect(q.where('name', '=', 'admin').where('login', '=', 'admin')._wheres).toEqual(
          expect.arrayContaining([
            { field: 'name', operator: 'AND', value: 'admin', symbol: '=', table: undefined, type: 'where' },
            { field: 'login', operator: 'AND', value: 'admin', symbol: '=', table: undefined, type: 'where' },
          ])
        );
      });

      it('handles paranthesis', () => {
        expect(q.parentesisOpen()._wheres).toEqual(expect.arrayContaining([{ type: 'parenthesis_open', operator: 'AND' }]));
        expect(q.parentesisOpen('OR')._wheres).toEqual(expect.arrayContaining([{ type: 'parenthesis_open', operator: 'OR' }]));
        expect(q.parentesisClose()._wheres).toEqual(expect.arrayContaining([{ type: 'parenthesis_close' }]));
      });
    });

    describe('aggregate()', () => {
      it('handles the simple statement', () => {
        expect(q.aggregate('COUNT', '*')._aggregates).toEqual(expect.arrayContaining([{ func: 'COUNT', table: undefined, field: '*' }]));
      });

      it('handles schemas', () => {
        expect(q.aggregate('COUNT', 'user.name')._aggregates).toEqual(expect.arrayContaining([{ func: 'COUNT', table: 'user', field: 'name' }]));
      });
    });

    describe('distinct()', () => {
      it('handles single fields', () => {
        expect(q.distinct('login')._distinct).toEqual(expect.arrayContaining([{ field: 'login', table: undefined }]));
      });

      it('handles multiple fields', () => {
        expect(q.distinct(['login', 'name'])._distinct).toEqual(
          expect.arrayContaining([
            { field: 'login', table: undefined },
            { field: 'name', table: undefined },
          ])
        );
      });

      it('handles schema statements', () => {
        expect(q.distinct('user.login')._distinct).toEqual(expect.arrayContaining([{ field: 'login', table: 'user' }]));
        expect(q.distinct(['user.login', 'user.name'])._distinct).toEqual(
          expect.arrayContaining([
            { field: 'login', table: 'user' },
            { field: 'login', table: 'user' },
          ])
        );
      });
    });

    describe('order()', () => {
      it('handles the simple statement', () => {
        expect(q.order('login')._order).toEqual(expect.arrayContaining([{ field: 'login', order: 'ASC', table: undefined }]));
      });

      it('handles schemas', () => {
        expect(q.order('user.login')._order).toEqual(expect.arrayContaining([{ field: 'login', order: 'ASC', table: 'user' }]));
      });
      it('handles setting the order', () => {
        expect(q.order('login', 'DESC')._order).toEqual(expect.arrayContaining([{ field: 'login', order: 'DESC', table: undefined }]));
      });
    });

    describe('group()', () => {
      it('handles the simple statement', () => {
        expect(q.group('login')._group).toEqual(expect.arrayContaining(['login']));
      });
    });

    describe('join()', () => {
      it('handles the simple statement', () => {
        expect(q.join('roles', 'id', 'userid')._joins).toEqual(
          expect.arrayContaining([
            {
              collection: 'roles',
              field1: 'id',
              field2: 'userid',
              table1: undefined,
              table2: undefined,
              modifier: 'INNER',
            },
          ])
        );
      });

      it('handles schemas', () => {
        expect(q.join('roles', 'user.id', 'roles.userid')._joins).toEqual(
          expect.arrayContaining([
            {
              collection: 'roles',
              field1: 'id',
              field2: 'userid',
              table1: 'user',
              table2: 'roles',
              modifier: 'INNER',
            },
          ])
        );
      });

      it('handles setting the modifier', () => {
        expect(q.join('roles', 'id', 'userid', 'OUTER')._joins).toEqual(
          expect.arrayContaining([
            {
              collection: 'roles',
              field1: 'id',
              field2: 'userid',
              table1: undefined,
              table2: undefined,
              modifier: 'OUTER',
            },
          ])
        );
      });
    });

    describe('limit()', () => {
      it('handles the simple statement', () => {
        expect(q.limit()._limit).toEqual({ limit: 100, offset: 0, fuzzy: false, fuzzyfield: 'id' });
      });

      it('handles setting the limit', () => {
        expect(q.limit(200)._limit).toEqual({ limit: 200, offset: 0, fuzzy: false, fuzzyfield: 'id' });
      });

      it('handles setting the offset', () => {
        expect(q.limit(200, 100)._limit).toEqual({ limit: 200, offset: 100, fuzzy: false, fuzzyfield: 'id' });
      });

      it('handles enabling fuzzy search', () => {
        expect(q.limit(100).fuzzy()._limit).toEqual({ limit: 100, offset: 0, fuzzy: true, fuzzyfield: 'id' });
      });

      it('handles enabling fuzzy search with a set field', () => {
        expect(q.limit(100).fuzzy('test')._limit).toEqual({ limit: 100, offset: 0, fuzzy: true, fuzzyfield: 'test' });
      });

      it('handles enabling fuzzy search with a set field and schema', () => {
        expect(q.limit(100).fuzzy('test.id')._limit).toEqual({ limit: 100, offset: 0, fuzzy: true, fuzzyfield: 'id', fuzzytable: 'test' });
      });
    });

    describe('set()', () => {
      it('handles the simple statement', () => {
        expect(q.set('name', 'admin')._sets).toEqual(expect.arrayContaining([{ field: 'name', value: 'admin' }]));
      });

      it('handles setting multiple values with an object', () => {
        const insert = { name: 'admin', login: 'adminlogin' };
        expect(q.set(insert)._sets).toEqual(
          expect.arrayContaining([
            { field: 'name', value: 'admin' },
            { field: 'login', value: 'adminlogin' },
          ])
        );
      });
    });
  });
});
