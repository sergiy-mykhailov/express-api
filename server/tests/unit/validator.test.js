/* eslint-disable no-undef */

const {
  getValidationErrors,
  idValidator,
  paginationValidator,
  payloadFieldsFilter,
} = require('../../validators/base.validator');
const {
  registerValidator,
} = require('../../validators/auth.validator');

const mockRequest = ({ params, query, body }) => {
  const req = {};
  if (params) {
    req.params = params;
  }
  if (query) {
    req.query = query;
  }
  if (body) {
    req.body = body;
  }

  return req;
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = () => {
  return jest.fn((err) => err);
};

describe('base', () => {
  describe('idValidator', () => {
    const uuidV1 = '02f0f4c0-480a-11ea-a0b9-cf0a8b103033';
    const uuidV3 = '6df28a2c-2abd-3e59-8a2b-955e33d71af7';
    const uuidV4 = '495f0c2e-851c-4556-b87a-c664c1bf374a';
    const uuidV5 = 'b37b256e-5009-5d1c-a517-2b420cd58e06';
    const payloadWithError = [
      ['null', null],
      ['undefined', undefined],
      ['number', 0],
      ['number', 1],
      ['empty string', ''],
      ['some string', 'some string'],
      ['true', true],
      ['false', false],
      ['empty array', []],
      ['empty object', {}],
      ['wrong property name', { property: uuidV4 }],
      ['wrong value - null', { id: null }],
      ['wrong value - undefined', { id: undefined }],
      ['wrong value - 0', { id: 0 }],
      ['wrong value - 1', { id: 1 }],
      ['wrong value - empty string', { id: '' }],
      ['wrong value - string', { id: 'some string' }],
      ['wrong value - true', { id: true }],
      ['wrong value - false', { id: false }],
      ['wrong value - empty array', { id: [] }],
      ['wrong value - empty object', { id: {} }],
      ['uuid v1', { id: uuidV1 }],
      ['uuid v3', { id: uuidV3 }],
      ['uuid v5', { id: uuidV5 }],
      ['uuid v4 - not valid length', { id: uuidV4.slice(1) }],
      ['uuid v4 - not valid symbols', { id: `z${uuidV4.slice(1)}` }],
      ['uuid v4 - not valid groups length', { id: `${uuidV4.slice(1)}0` }],
      ['uuid v4 - not valid separators', { id: uuidV4.replace('-', '_') }],
    ];

    describe('should fail with validation error', () => {
      it.each(payloadWithError)('case %#: %s', async (caseTitle, payload) => {
        const req = mockRequest({ params: payload });
        const res = mockResponse();
        const next = mockNext();

        await idValidator('id')(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(getValidationErrors());
        expect(next.mock.results[0].value).toBeDefined();
        expect(next.mock.results[0].value.errors).toBeDefined();
        expect(next.mock.results[0].value.errors).toBeArray();
        expect(next.mock.results[0].value.errors.length).toBeGreaterThan(0);
      });
    });

    it('should success', async () => {
      const req = mockRequest({ params: { id: uuidV4 } });
      const res = mockResponse();
      const next = mockNext();

      await idValidator('id')(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.results[0].value).not.toBeDefined();
    });
  });

  describe('paginationValidator', () => {
    const payloadWithError = [
      ['limit - null', { limit: null }],
      ['limit - zero', { limit: 0 }],
      ['limit - negative number', { limit: -1 }],
      ['limit - empty string', { limit: '' }],
      ['limit - string', { limit: 'string' }],
      ['limit - true', { limit: true }],
      ['limit - false', { limit: false }],
      ['limit - empty array', { limit: [] }],
      ['limit - empty object', { limit: {} }],
      ['offset - null', { offset: null }],
      ['offset - negative number', { offset: -1 }],
      ['offset - empty string', { offset: '' }],
      ['offset - string', { offset: 'string' }],
      ['offset - true', { offset: true }],
      ['offset - false', { offset: false }],
      ['offset - empty array', { offset: [] }],
      ['offset - empty object', { offset: {} }],
    ];
    const payloadWithoutError = [
      ['limit, offset - optional', {}],
      ['limit - undefined', { limit: undefined }],
      ['offset - undefined', { offset: undefined }],
      ['limit - number', { limit: 1 }],
      ['offset - number', { offset: 5 }],
      ['offset - zero', { offset: 0 }],
      ['limit, offset - number', { limit: 10, offset: 10 }],
    ];

    describe('should fail with validation error', () => {
      it.each(payloadWithError)('case %#: %s', async (caseTitle, payload) => {
        const req = mockRequest({ query: payload });
        const res = mockResponse();
        const next = mockNext();

        await paginationValidator(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(getValidationErrors());
        expect(next.mock.results[0].value).toBeDefined();
        expect(next.mock.results[0].value.errors).toBeDefined();
        expect(next.mock.results[0].value.errors).toBeArray();
        expect(next.mock.results[0].value.errors.length).toBeGreaterThan(0);
      });
    });

    describe('should success', () => {
      it.each(payloadWithoutError)('case %#: %s', async (caseTitle, payload) => {
        const req = mockRequest({ query: payload });
        const res = mockResponse();
        const next = mockNext();

        await paginationValidator(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(next.mock.results[0].value).not.toBeDefined();
      });
    });
  });

  describe('payloadFieldsFilter', () => {
    const validProps = ['prop1', 'prop2'];
    const payloadWithError = [
      ['null', null],
      ['undefined', undefined],
      ['zero', 0],
      ['number', 1],
      ['empty string', ''],
      ['string', 'some string'],
      ['true', true],
      ['false', false],
      ['empty array', []],
      ['empty object', {}],
      ['not valid props', { prop3: 'value3', prop4: 'value4' }],
    ];
    const payloadWithoutError = [
      ['only prop1', { prop1: 'value1' }],
      ['only prop2', { prop2: 'value2' }],
      ['two props', { prop1: 'value1', prop2: 'value2' }],
      ['more then two props', { prop1: 'value1', prop2: 'value2', prop3: 'value3' }],
      ['only one valid prop', { prop1: 'value1', prop3: 'value3' }],
    ];

    describe('should fail with validation error', () => {
      it.each(payloadWithError)('case %#: %s', async (caseTitle, payload) => {
        const req = mockRequest({ body: payload });
        const res = mockResponse();
        const next = mockNext();

        await payloadFieldsFilter(validProps)(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(getValidationErrors());
        expect(next.mock.results[0].value).toBeDefined();
        expect(next.mock.results[0].value.errors).toBeDefined();
        expect(next.mock.results[0].value.errors).toBeArray();
        expect(next.mock.results[0].value.errors.length).toBeGreaterThan(0);
      });
    });

    describe('should success', () => {
      it.each(payloadWithoutError)('case %#: %s', async (caseTitle, payload) => {
        const req = mockRequest({ body: payload });
        const res = mockResponse();
        const next = mockNext();

        await payloadFieldsFilter(validProps)(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(next.mock.results[0].value).not.toBeDefined();

        expect(req.body).toBeDefined();
        expect(req.body).toBeObject();
        expect(validProps).toIncludeAllMembers(Object.keys(req.body));
      });
    });
  });
});

describe('auth', () => {
  describe('registerValidator', () => {
    const defaultPayload = {
      username: 'username',
      email: 'username@email.com',
      password: 'password',
      confirmPassword: 'password',
    };
    const payloadWithError = [
      ['other props', { prop1: 'value1', prop2: 'value2' }],
      ['only names', { firstName: 'John', lastName: 'Doe' }],
      ['without confirmPassword', { username: 'username', email: 'username@email.com', password: 'password' }],
      ['without password', { username: 'username', email: 'username@email.com', confirmPassword: 'password' }],
      ['without email', { username: 'username', password: 'password', confirmPassword: 'password' }],
      ['without username', { email: 'username@email.com', password: 'password', confirmPassword: 'password' }],
      ['different confirmPassword', { ...defaultPayload, confirmPassword: 'another password' }],
      ['username - null', { ...defaultPayload, username: null }],
      ['username - zero', { ...defaultPayload, username: 0 }],
      ['username - number', { ...defaultPayload, username: 1 }],
      ['username - negative number', { ...defaultPayload, username: -1 }],
      ['username - empty string', { ...defaultPayload, username: '' }],
      ['username - true', { ...defaultPayload, username: true }],
      ['username - false', { ...defaultPayload, username: false }],
      ['username - array', { ...defaultPayload, username: [] }],
      ['username - object', { ...defaultPayload, username: {} }],
      ['username - short string', { ...defaultPayload, username: 'u' }],
      ['email - null', { ...defaultPayload, email: null }],
      ['email - zero', { ...defaultPayload, email: 0 }],
      ['email - number', { ...defaultPayload, email: 1 }],
      ['email - negative number', { ...defaultPayload, email: -1 }],
      ['email - empty string', { ...defaultPayload, email: '' }],
      ['email - true', { ...defaultPayload, email: true }],
      ['email - false', { ...defaultPayload, email: false }],
      ['email - array', { ...defaultPayload, email: [] }],
      ['email - object', { ...defaultPayload, email: {} }],
      ['email - not valid', { ...defaultPayload, email: 'username_email.com' }],
      ['password - null', { ...defaultPayload, password: null }],
      ['password - zero', { ...defaultPayload, password: 0 }],
      ['password - number', { ...defaultPayload, password: 1 }],
      ['password - negative number', { ...defaultPayload, password: -1 }],
      ['password - empty string', { ...defaultPayload, password: '' }],
      ['password - true', { ...defaultPayload, password: true }],
      ['password - false', { ...defaultPayload, password: false }],
      ['password - array', { ...defaultPayload, password: [] }],
      ['password - object', { ...defaultPayload, password: {} }],
      ['password - short string', { ...defaultPayload, password: 'abcde' }],
      ['firstName - null', { ...defaultPayload, firstName: null }],
      ['firstName - zero', { ...defaultPayload, firstName: 0 }],
      ['firstName - number', { ...defaultPayload, firstName: 1 }],
      ['firstName - negative number', { ...defaultPayload, firstName: -1 }],
      ['firstName - empty string', { ...defaultPayload, firstName: '' }],
      ['firstName - true', { ...defaultPayload, firstName: true }],
      ['firstName - false', { ...defaultPayload, firstName: false }],
      ['firstName - array', { ...defaultPayload, firstName: [] }],
      ['firstName - object', { ...defaultPayload, firstName: {} }],
      ['lastName - null', { ...defaultPayload, lastName: null }],
      ['lastName - zero', { ...defaultPayload, lastName: 0 }],
      ['lastName - number', { ...defaultPayload, lastName: 1 }],
      ['lastName - negative number', { ...defaultPayload, lastName: -1 }],
      ['lastName - empty string', { ...defaultPayload, lastName: '' }],
      ['lastName - true', { ...defaultPayload, lastName: true }],
      ['lastName - false', { ...defaultPayload, lastName: false }],
      ['lastName - array', { ...defaultPayload, lastName: [] }],
      ['lastName - object', { ...defaultPayload, lastName: {} }],
    ];
    const payloadWithoutError = [
      ['default', defaultPayload],
      ['firstName', { ...defaultPayload, firstName: 'John' }],
      ['lastName', { ...defaultPayload, lastName: 'Doe' }],
      ['two additional props', { ...defaultPayload, firstName: 'John', lastName: 'Doe' }],
      ['more then 2 props', { ...defaultPayload, firstName: 'John', lastName: 'Doe', prop1: 'value1' }],
    ];

    describe('should fail with validation error', () => {
      it.each(payloadWithError)('case %#: %s', async (caseTitle, payload) => {
        const req = mockRequest({ body: payload });
        const res = mockResponse();
        const next = mockNext();

        await registerValidator(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(getValidationErrors());
        expect(next.mock.results[0].value).toBeDefined();
        expect(next.mock.results[0].value.errors).toBeDefined();
        expect(next.mock.results[0].value.errors).toBeArray();
        expect(next.mock.results[0].value.errors.length).toBeGreaterThan(0);
      });
    });

    describe('should success', () => {
      it.each(payloadWithoutError)('case %#: %s', async (caseTitle, payload) => {
        const req = mockRequest({ body: payload });
        const res = mockResponse();
        const next = mockNext();

        await registerValidator(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(next.mock.results[0].value).not.toBeDefined();
      });
    });
  });

  describe('loginValidator', () => {
    it.todo('should fail');
    it.todo('should success');
  });
});
