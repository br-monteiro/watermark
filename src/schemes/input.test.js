const assert = require('assert')
const { validator } = require('../validator')
const schema = require('./input.json')

describe('JSON Schemes - input', () => {
  let data

  beforeEach(() => {
    data = {
      id: '199299',
      feedbackUrl: 'https://teste.com',
      baseImagePath: 'images/bucket-name/test.png',
      positions: {
        x: 370,
        y: 470,
        height: 80,
        width: 150
      }
    }
  })

  it('type text', () => {
    data.watermarkOptions = {
      type: 'text',
      details: {
        // eslint-disable-next-line quotes
        text: "Artes UP\n91 98888-8888",
        size: 15,
        color: '#AAF122'
      }
    }

    assert.strictEqual(true, validator.validate(data, schema))
  })

  it('type image', () => {
    data.watermarkOptions = {
      type: 'image',
      details: {
        path: 'images/bucket-name/test.png'
      }
    }

    assert.strictEqual(true, validator.validate(data, schema))
  })
})
