import {jest, expect, describe, test, beforeEach} from '@jest/globals'
import config from '../../../server/config.js'
import { Controller } from '../../../server/controller.js'
import { Service } from '../../../server/service.js'
import TestUtil from '../__util/testUtil.js'

const{ pages } = config

describe('#Controller - test suite for controller calls',()=>{
  beforeEach(()=>{
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  test('getFilestream() - should get filestream', async ()=>{
    const mockFileStream = TestUtil.generateReadableStream(['data'])
    const controller = new Controller()
    const mockType = '.html'
    const mockFilename = 'test.html'
    
    jest.spyOn(
      Service.prototype,
      Service.prototype.getFileStream.name
    ).mockReturnValue({
      stream: mockFileStream,
      type: mockType
    })

    const{stream, type} = await controller.getFileStream(mockFilename)

  
    expect(stream).toStrictEqual(mockFileStream)

    expect(type).toStrictEqual(mockType)
  })
})