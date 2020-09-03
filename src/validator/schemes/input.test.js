const assert = require('assert')
const { validator } = require('../index')
const schema = require('./input.json')

describe('JSON Schemes - input', () => {
  let data

  beforeEach(() => {
    data = {
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
  })

  it('validate the "input.json" schema', () => {
    assert.equal(true, validator.validate(data, schema))
  })
})
