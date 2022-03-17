import {jest, expect, describe, test, beforeEach} from '@jest/globals'
import config from '../../../server/config.js'
import { Controller } from '../../../server/controller.js'
import { Service } from '../../../server/service.js'
import TestUtil from '../__util/testUtil.js'

import fs from 'fs'
import fsPromises from 'fs/promises'

const{ 
  dir:{
    publicDirectory
  } 
} = config

describe('#Services - test suit for services functions',()=>{
  beforeEach(()=>{
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  test('createFileStream() ', async ()=>{
    const currentReadable = TestUtil.generateReadableStream(['data'])
    const myFile = 'file.mp3'
    
    jest.spyOn(
      fs,
      fs.createReadStream.name
    ).mockReturnValue(currentReadable)

    const service = new Service()

    const result = service.createFileStream(myFile)

    expect(result).toStrictEqual(currentReadable)
    expect(fs.createReadStream).toHaveBeenCalledWith(myFile)
  })

  test('getFileInfo() ', async ()=>{
    const service = new Service()
    const currentSong = 'mySong.mp3'
    
    jest.spyOn(
      fsPromises,
      fsPromises.access.name
    ).mockReturnValue()

    const result = await service.getFileInfo(currentSong)
    const expectedResult = {
      type: '.mp3',
      name: `${publicDirectory}/${currentSong}`
    }

    expect(result).toStrictEqual(expectedResult)
  })

  test('getFileStream() ', async ()=>{
    const currentReadable = TestUtil.generateReadableStream(['data'])
    const service = new Service()
    const currentSong = 'mySong.mp3'
    const currentSongFullPath = `${publicDirectory}/${currentSong}`

    const fileInfo ={
      type: '.mp3',
      name: currentSongFullPath
    }
    
    jest.spyOn(
      service,
      service.getFileInfo.name
    ).mockReturnValue(fileInfo)

    jest.spyOn(
      service,
      service.createFileStream.name
    ).mockReturnValue(currentReadable)

    const result = await service.getFileStream(currentSong)
    
    const expectedResult = {
      type: fileInfo.type,
      stream: currentReadable
    }

    expect(result).toStrictEqual(expectedResult)
    expect(service.createFileStream).toHaveBeenCalledWith(fileInfo.name)
    expect(service.getFileInfo).toHaveBeenCalledWith(currentSong)
  })


})