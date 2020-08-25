const assert = require('assert')
const { validator } = require('../src/validator')
const inputSchema = require('../src/validator/schemes/input.json')

describe('JSON Schemes', () => {
  const schemes = {}

  beforeEach(() => {
    schemes.inputSchema = [{
      id: '199299',
      groupId: '63773',
      feedbackUrl: 'https://teste.com',
      watermarkOptions: {
        type: 'text',
        textOption: {
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
    }]
  })

  it('validate the "input.json" schema', () => {
    assert.equal(true, validator.validate(schemes.inputSchema, inputSchema))
  })
})
