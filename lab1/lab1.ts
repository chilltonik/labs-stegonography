import fs from 'fs'
import Jimp from 'jimp'
import { deflate } from 'zlib';

// если .format === 'jpg', у объекта есть дополнительное числовое свойство quality
// если .format === 'png', дополнительных свойств нет
export type ConversionOptions =
  | {format: 'jpg'; quality: 99 | 90 | 75 | 50}
  | {format: 'png'}
  | {format: 'deflate'}

export type CompressionInfo = {
  size: number
  compressedSize: number
  compressionRatio: number
}

export async function convert(filename: string, options: ConversionOptions): Promise<CompressionInfo> {
  // пример загрузки изображения, конвертации в буфер и оценки размера
  const bikeBmp = await Jimp.read(filename)

  const bmpBuffer = await bikeBmp.getBufferAsync(Jimp.MIME_BMP)
  const bmpSize = bmpBuffer.byteLength

  const jpeg95Buffer = await bikeBmp.quality(95).getBufferAsync(Jimp.MIME_JPEG)
  const jpeg95Size = jpeg95Buffer.byteLength

  // пример объекта, который нужно вернуть из этой функции:
  const compressionInfo: CompressionInfo = {
    size: bmpSize,
    compressedSize: jpeg95Size,
    compressionRatio: jpeg95Size / bmpSize,
  }

  let newSize: number = 0;

  if (options.format === 'jpg') {
    const {quality} = options
    const buffer = await bikeBmp.quality(options.quality).getBufferAsync(Jimp.MIME_JPEG);

    newSize = Number(buffer.byteLength);
    // TODO: исходный код к заданию 2 здесь, можно использовать число quality
    //throw new Error('Конвертация в JPG не реализована!')
  } else if (options.format === 'png') {
    // TODO: исходный код к заданию 2 здесь
    const buffer = await bikeBmp.getBufferAsync(Jimp.MIME_PNG);

    newSize = Number(buffer.byteLength);
    //throw new Error('Конвертация в PNG не реализована!')
  } else {
    // TODO: исходный код к заданию 2 здесь
    // тут необходимо использовать функцию zlib.deflate+utils.promisify или zlib.deflateSync
    const zlib = require("zlib");
    const deflate = zlib.deflateSync(bmpBuffer);
    newSize = Number(deflate.buffer.byteLength);

    //throw new Error('Конвертация в Deflate не реализована!')
  }
  compressionInfo.compressedSize = newSize;
  compressionInfo.compressionRatio = newSize / bmpSize;

  return compressionInfo;
}

export async function pngAndDeflate(filename: string): Promise<CompressionInfo> {
  const bikeBmp = await Jimp.read(filename)

  const bmpBuffer = await bikeBmp.getBufferAsync(Jimp.MIME_BMP)
  const bmpSize = Number(bmpBuffer.byteLength)

  const buffer = await bikeBmp.getBufferAsync(Jimp.MIME_PNG);

  const zlib = require("zlib");
  const deflate = zlib.deflateSync(buffer);
  const newSize: number = Number(deflate.buffer.byteLength);

  return {
    size: bmpSize,
    compressedSize: newSize,
    compressionRatio: newSize / bmpSize
  }
  //throw new Error('Конвертация PNG+Deflate не реализована!')
}
