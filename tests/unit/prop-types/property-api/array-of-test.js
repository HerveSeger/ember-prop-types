/**
 * Unit test for the PropTypes.arrayOf validator
 */
import EmberObject from '@ember/object'
import {afterEach, beforeEach, describe} from 'mocha'
import sinon from 'sinon'

import {itValidatesTheProperty, spyOnValidateMethods} from 'dummy/tests/helpers/validator'
import PropTypesMixin, {PropTypes} from 'ember-prop-types/mixins/prop-types'

const stringTypeDef = {
  isRequired: {
    required: true,
    type: 'string'
  },
  required: false,
  type: 'string'
}

const requiredDef = {
  required: true,
  type: 'arrayOf',
  typeDef: stringTypeDef
}

const notRequiredDef = {
  isRequired: requiredDef,
  required: false,
  type: 'arrayOf',
  typeDef: stringTypeDef
}

const shapeTypeDefs = {
  fizz: {
    isRequired: {required: true, type: 'string'},
    required: false,
    type: 'string'
  },
  bang: {
    isRequired: {required: true, type: 'number'},
    required: false,
    type: 'number'
  }
}

const shapeTypeDef = {
  isRequired: {
    required: true,
    type: 'shape',
    typeDefs: shapeTypeDefs
  },
  required: false,
  type: 'shape',
  typeDefs: shapeTypeDefs
}

const requiredShapeDef = {
  required: true,
  type: 'arrayOf',
  typeDef: shapeTypeDef
}

const notRequiredShapeDef = {
  isRequired: requiredShapeDef,
  required: false,
  type: 'arrayOf',
  typeDef: shapeTypeDef
}

describe('Unit / validator / PropTypes.arrayOf', function () {
  const ctx = {propertyName: 'bar'}
  let sandbox, Foo

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    spyOnValidateMethods(sandbox)
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('when an array of a simple type (string)', function () {
    describe('when required', function () {
      beforeEach(function () {
        ctx.def = requiredDef
        Foo = EmberObject.extend(PropTypesMixin, {
          propTypes: {
            bar: PropTypes.arrayOf(PropTypes.string).isRequired
          }
        })
      })

      describe('when initialized with array of strings', function () {
        beforeEach(function () {
          ctx.instance = Foo.create({bar: ['alpha', 'bravo']})
        })

        itValidatesTheProperty(ctx, false)
      })

      describe('when initialized with array of booleans', function () {
        beforeEach(function () {
          ctx.instance = Foo.create({bar: [true, false]})
        })

        itValidatesTheProperty(
          ctx,
          false,
          'Expected property bar[0] to be a string',
          'Expected property bar to be an array of type string'
        )
      })

      describe('when initialized with a heterogenous array', function () {
        beforeEach(function () {
          ctx.instance = Foo.create({bar: ['alpha', false]})
        })

        itValidatesTheProperty(
          ctx,
          false,
          'Expected property bar[1] to be a string',
          'Expected property bar to be an array of type string'
        )
      })

      describe('when initialized without value', function () {
        beforeEach(function () {
          ctx.instance = Foo.create()
        })

        itValidatesTheProperty(ctx, false, 'Missing required property bar')
      })
    })

    describe('when not required', function () {
      beforeEach(function () {
        ctx.def = notRequiredDef
        Foo = EmberObject.extend(PropTypesMixin, {
          propTypes: {
            bar: PropTypes.arrayOf(PropTypes.string)
          }
        })
      })

      describe('when initialized with array of strings', function () {
        beforeEach(function () {
          ctx.instance = Foo.create({bar: ['alpha', 'bravo']})
        })

        itValidatesTheProperty(ctx, false)
      })

      describe('when initialized with array of booleans', function () {
        beforeEach(function () {
          ctx.instance = Foo.create({bar: [true, false]})
        })

        itValidatesTheProperty(
          ctx,
          false,
          'Expected property bar[0] to be a string',
          'Expected property bar to be an array of type string'
        )
      })

      describe('when initialized with a heterogenous array', function () {
        beforeEach(function () {
          ctx.instance = Foo.create({bar: ['alpha', false]})
        })

        itValidatesTheProperty(
          ctx,
          false,
          'Expected property bar[1] to be a string',
          'Expected property bar to be an array of type string'
        )
      })

      describe('when initialized without value', function () {
        beforeEach(function () {
          ctx.instance = Foo.create()
        })

        itValidatesTheProperty(ctx, false)
      })
    })
  })

  describe('when an array of a complex type (shape)', function () {
    describe('when required', function () {
      beforeEach(function () {
        ctx.def = requiredShapeDef
        Foo = EmberObject.extend(PropTypesMixin, {
          propTypes: {
            bar: PropTypes.arrayOf(PropTypes.shape({
              fizz: PropTypes.string,
              bang: PropTypes.number
            })).isRequired
          }
        })
      })

      describe('when initialized with array of valid shapes', function () {
        beforeEach(function () {
          ctx.instance = Foo.create({bar: [{fizz: 'alpha', bang: 1}, {fizz: 'bravo', bang: 2}]})
        })

        itValidatesTheProperty(ctx, false)
      })

      describe('when initialized with array of invalid shapes', function () {
        beforeEach(function () {
          ctx.instance = Foo.create({bar: [{foo: 'alpha'}, {bar: 2}]})
        })

        itValidatesTheProperty(
          ctx,
          false,
          'Property bar[0] has an unknown key: foo',
          'Expected property bar[0] to match given shape',
          'Expected property bar to be an array of type shape'
        )
      })

      describe('when initialized with a some valid some invalid shapes', function () {
        beforeEach(function () {
          ctx.instance = Foo.create({bar: [{fizz: 'alpha', bang: 1}, {foo: 'bar'}]})
        })

        itValidatesTheProperty(
          ctx,
          false,
          'Property bar[1] has an unknown key: foo',
          'Expected property bar[1] to match given shape',
          'Expected property bar to be an array of type shape'
        )
      })

      describe('when initialized without value', function () {
        beforeEach(function () {
          ctx.instance = Foo.create()
        })

        itValidatesTheProperty(ctx, false, 'Missing required property bar')
      })
    })

    describe('when not required', function () {
      beforeEach(function () {
        ctx.def = notRequiredShapeDef
        Foo = EmberObject.extend(PropTypesMixin, {
          propTypes: {
            bar: PropTypes.arrayOf(PropTypes.shape({
              fizz: PropTypes.string,
              bang: PropTypes.number
            }))
          }
        })
      })

      describe('when initialized with array of valid shapes', function () {
        beforeEach(function () {
          ctx.instance = Foo.create({bar: [{fizz: 'alpha', bang: 1}, {fizz: 'bravo', bang: 2}]})
        })

        itValidatesTheProperty(ctx, false)
      })

      describe('when initialized with array of invalid shapes', function () {
        beforeEach(function () {
          ctx.instance = Foo.create({bar: [{foo: 'alpha'}, {bar: 2}]})
        })

        itValidatesTheProperty(
          ctx,
          false,
          'Property bar[0] has an unknown key: foo',
          'Expected property bar[0] to match given shape',
          'Expected property bar to be an array of type shape'
        )
      })

      describe('when initialized with a some valid some invalid shapes', function () {
        beforeEach(function () {
          ctx.instance = Foo.create({bar: [{fizz: 'alpha', bang: 1}, {foo: 'bar'}]})
        })

        itValidatesTheProperty(
          ctx,
          false,
          'Property bar[1] has an unknown key: foo',
          'Expected property bar[1] to match given shape',
          'Expected property bar to be an array of type shape'
        )
      })

      describe('when initialized without value', function () {
        beforeEach(function () {
          ctx.instance = Foo.create()
        })

        itValidatesTheProperty(ctx, false)
      })
    })
  })
})
