const assert = require('assert')
const { validator } = require('../src/validator')
const inputSchema = require('../src/validator/schemes/input.json')
const requestSchema = require('../src/validator/schemes/request.json')

describe('JSON Schemes', () => {
  const schemes = {}

  beforeEach(() => {
    schemes.inputSchema = {
      id: '199299',
      groupId: '63773',
      imageId: '63773',
      feedbackUrl: 'https://teste.com',
      watermarkOptions: {
        type: 'text',
        textOptions: {
          // eslint-disable-next-line quotes
          text: "Artes UP\n91 98888-8888",
          fontSize: 15,
          color: '#AAF122'
        }
      },
      position: {
        x: 370,
        y: 470,
        height: 80,
        width: 150
      }
    }

    schemes.requestSchema = [
      {
        justTest: true
      },
      {
        justTest: true
      }
    ]
  })

  it('validate the "input.json" schema', () => {
    assert.equal(true, validator.validate(schemes.inputSchema, inputSchema))
  })

  it('validate the "request.json" schema', () => {
    assert.equal(true, validator.validate(schemes.requestSchema, requestSchema))
  })
})
