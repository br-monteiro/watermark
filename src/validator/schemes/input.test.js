const assert = require('assert')
const { validator } = require('../index')
const schema = require('./input.json')

describe('JSON Schemes - input', () => {
  let data

  beforeEach(() => {
    data = {
      id: '199299',
      feedbackUrl: 'https://teste.com',
      baseImagePath: 'https://teste.com/',
      position: {
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
      textOptions: {
        // eslint-disable-next-line quotes
        text: "Artes UP\n91 98888-8888",
        fontSize: 15,
        color: '#AAF122'
      }
    }

    assert.equal(true, validator.validate(data, schema))
  })

  it('type image', () => {
    data.watermarkOptions = {
      type: 'image',
      imageOptions: {
        path: 'https://teste.com/'
      }
    }

    assert.equal(true, validator.validate(data, schema))
  })
})
