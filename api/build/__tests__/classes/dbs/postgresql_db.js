"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const postgresql_db_1 = require("../../../classes/dbs/postgresql_db");
describe('classes', () => {
    describe('PostgreSQL_DB', () => {
        let db = new postgresql_db_1.PostgreSQL_DB();
        beforeEach(() => {
            db.close();
            db = new postgresql_db_1.PostgreSQL_DB();
            // @ts-ignore
            db.pool.query = jest.fn((query) => {
                return Promise.resolve(query);
            });
        });
        describe('SELECT', () => {
            it('can handle the default statement', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield db.query('test').execute();
                expect(jest.spyOn(db.pool, 'query').mock.calls[0][0]).toBe('SELECT * FROM test.test');
            }));
            it('can handle setting fields', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield db.query('test').fields('name').execute();
                expect(jest.spyOn(db.pool, 'query').mock.calls[0][0]).toBe('SELECT name FROM test.test');
            }));
            it('can handle setting fields with schema', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield db.query('test').fields('test.name').execute();
                expect(jest.spyOn(db.pool, 'query').mock.calls[0][0]).toBe('SELECT test.name FROM test.test');
            }));
            it('can handle getting an array of fields', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield db.query('test').fields(['name', 'login', 'test']).execute();
                expect(jest.spyOn(db.pool, 'query').mock.calls[0][0]).toBe('SELECT name, login, test FROM test.test');
            }));
            it('can handle setting fields with schema', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield db.query('test').fields(['test.name', 'test.login', 'othertest.name']).execute();
                expect(jest.spyOn(db.pool, 'query').mock.calls[0][0]).toBe('SELECT test.name, test.login, othertest.name FROM test.test');
            }));
            it('handles disctinct', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield db.query('test').distinct('id').execute();
                expect(jest.spyOn(db.pool, 'query').mock.calls[0][0]).toBe('SELECT DISTINCT ON (id) id,* FROM test.test');
            }));
            it('handles disctinct with fields', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield db.query('test').fields('name').distinct('id').execute();
                expect(jest.spyOn(db.pool, 'query').mock.calls[0][0]).toBe('SELECT DISTINCT ON (id) id,name FROM test.test');
            }));
            it('handels distinct with schema', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield db.query('test').distinct('test.id').execute();
                expect(jest.spyOn(db.pool, 'query').mock.calls[0][0]).toBe('SELECT DISTINCT ON (test.id) test.id,* FROM test.test');
            }));
            it('handles aggregates', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield db.query('test').aggregate('COUNT', 'name').execute();
                expect(jest.spyOn(db.pool, 'query').mock.calls[0][0]).toBe('SELECT COUNT(name) FROM test.test');
            }));
            it('handles aggregates with fields', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield db.query('test').fields(['field1', 'field2']).aggregate('COUNT', 'name').execute();
                expect(jest.spyOn(db.pool, 'query').mock.calls[0][0]).toBe('SELECT field1, field2, COUNT(name) FROM test.test');
            }));
            it('handles aggregates with schema', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield db.query('test').aggregate('COUNT', 'test.name').execute();
                expect(jest.spyOn(db.pool, 'query').mock.calls[0][0]).toBe('SELECT COUNT(test.name) FROM test.test');
            }));
            it('handles limits', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield db.query('test').limit(100).execute();
                expect(jest.spyOn(db.pool, 'query').mock.calls[0][0]).toBe('SELECT * FROM test.test LIMIT 100');
            }));
            it('handles limits and offset', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield db.query('test').limit(100, 10).execute();
                expect(jest.spyOn(db.pool, 'query').mock.calls[0][0]).toBe('SELECT * FROM test.test LIMIT 100 OFFSET 10');
            }));
            it('handles fuzzy-limits', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield db.query('test').limit(100).fuzzy().execute();
                expect(jest.spyOn(db.pool, 'query').mock.calls[0][0]).toBe('SELECT * FROM test.test LIMIT 100');
            }));
            it('handles fuzzy-limits with offset', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield db.query('test').limit(100, 10).fuzzy().execute();
                expect(jest.spyOn(db.pool, 'query').mock.calls[0][0]).toBe("SELECT * FROM test.test WHERE id > '10' LIMIT 100");
            }));
            it('handles fuzzy-limits with offset and different offset-field', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield db.query('test').limit(100, 30).fuzzy('date').execute();
                expect(jest.spyOn(db.pool, 'query').mock.calls[0][0]).toBe("SELECT * FROM test.test WHERE date > '30' LIMIT 100");
            }));
            it('handles fuzzy-limits with offset and different offset-field and schema', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield db.query('test').limit(100, 30).fuzzy('test.date').execute();
                expect(jest.spyOn(db.pool, 'query').mock.calls[0][0]).toBe("SELECT * FROM test.test WHERE test.date > '30' LIMIT 100");
            }));
            it('handles between', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield db.query('test').where('value', 'BETWEEN', [1, 2]).execute();
                expect(jest.spyOn(db.pool, 'query').mock.calls[0][0]).toBe("SELECT * FROM test.test WHERE value BETWEEN '1' AND '2'");
            }));
        });
        describe('INSERT', () => {
            it('handles statement with a single field', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield db.query('test').insert().set('name', 'test').execute();
                expect(jest.spyOn(db.pool, 'query').mock.calls[0][0]).toBe("INSERT INTO test.test(name) VALUES ('test') RETURNING *");
            }));
            it('handles statement with multiple sets', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield db.query('test').insert().set({ name: 'test', value: 'valuevalue' }).execute();
                expect(jest.spyOn(db.pool, 'query').mock.calls[0][0]).toBe("INSERT INTO test.test(name,value) VALUES ('test','valuevalue') RETURNING *");
            }));
        });
        describe('UPDATE', () => {
            it('handles statement with a single field', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield db.query('test').update().set('name', 'test').execute();
                expect(jest.spyOn(db.pool, 'query').mock.calls[0][0]).toBe("UPDATE test.test SET name = 'test'");
            }));
            it('handles statement with multiple sets', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield db.query('test').update().set({ name: 'test', value: 'valuevalue' }).execute();
                expect(jest.spyOn(db.pool, 'query').mock.calls[0][0]).toBe("UPDATE test.test SET name = 'test', value = 'valuevalue'");
            }));
        });
        describe('DELETE', () => {
            it('handles it', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield db.query('test').delete().execute();
                expect(jest.spyOn(db.pool, 'query').mock.calls[0][0]).toBe('DELETE FROM test.test');
            }));
        });
    });
});
