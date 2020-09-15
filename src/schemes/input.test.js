const assert = require('assert')
const { validator } = require('../validator')
const schema = require('./input.json')

describe('JSON Schemes - input', () => {
  let data

  beforeEach(() => {
    data = {
      transactionId: '31313e1ggnkerkn',
      feedbackUrl: 'https://teste.com/queue',
      watermarkPath: 'images/bucket-name/stamp.png',
      images: [
        {
          positions: {
            x: 370,
            y: 470,
            height: 80,
            width: 150
          },
          baseImagePath: 'images/bucket-name/background.png',
          s3ImagePath: 'images/bucket-name/background-processed.png'
        }
      ]
    }
  })

  it('type image', () => {
    assert.strictEqual(true, validator.validate(data, schema))
    assert.deepStrictEqual([], validator.getErrors())
  })
})
