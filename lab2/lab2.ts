import Jimp from 'jimp'
import {TextEncoder, TextDecoder} from 'util'

/**
 * Функция, которая позволяет итерироваться по произвольному буферу побитово
 */
export function* readBufferBitByBit(input: ArrayBuffer): IterableIterator<0 | 1> {
  for (const byte of new Uint8Array(input)) {
    // В byte находится битовое представление числа в 8 битах, например "0110 1001"
    for (let offset = 7; offset >= 0; offset--) {
      // В mask будут последовательно находитсья числа с единицей в разряде с номером offset:
      // 1000 0000, 0100 0000, 0010 0000 и т.д., до 0000 0001
      const mask = 1 << offset

      // Результат побитового "И" byte и mask будет 0 тогда и только тогда, когда бит
      // в разряде с номером offset в byte был нулём; в противном случае этот бит был 1
      // Например, для offset = 7 mask = 1000 0000, byte & mask = 0000 0000 === 0,
      // а для offset = 6 mask = 0100 0000, byte & mask = 0100 0000 !== 0
      if ((mask & byte) !== 0) {
        yield 1
      } else {
        yield 0
      }
    }
  }
}

export type Bit = 0 | 1
export type ByteAsBitArray = [Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit]

export function byteToBitArray(byte: number): ByteAsBitArray {
  return Array.from(readBufferBitByBit(Uint8Array.from([byte]))) as ByteAsBitArray
}

export function bitArrayToByte(bitArray: ByteAsBitArray) {
  let byte = 0
  for (let offset = 7; offset >= 0; offset--) {
    const bitIndex = 7 - offset
    const bit = bitArray[bitIndex]
    const mask = 1 << offset
    if (bit) {
      byte |= mask
    }
  }
  return byte
}

export type LSBBitsPerImageByte = 1 | 2 | 3 | 4 | 5 | 6 | 7

export function imageLSBEmbed(
  container: Jimp,
  message: ArrayBuffer,
  bitsPerImageByte: LSBBitsPerImageByte = 1,
): Jimp {
  // создаём копию контейнера, чтобы не модифицировать исходный
  const modifiedContainer = container.clone()

  const messageBitIterator = readBufferBitByBit(message)

  for (let row = 0; row < modifiedContainer.getHeight(); row++) {
    for (let column = 0; column < modifiedContainer.getWidth(); column++) {
      const pixelColor = Jimp.intToRGBA(container.getPixelColor(column, row))
      let lastIteratorResult: IteratorResult<Bit> = {value: 0, done: false}
      for (const channelName of ['r', 'g', 'b'] as const) {
        const channelByte = pixelColor[channelName]
        const channelByteAsBitArray = byteToBitArray(channelByte) // массив из 8 нулей или единиц по яркости канала, его можно менять
        // channelByteAsBitArray[7] = 0 // <-- переставить последний бит в 0

        // через итератор можно читать биты сообщения
        // next() на итераторе можно вызывать сколько угодно раз, когда итератор закончится, у него в
        // value будет undefined, а в done: true
       
        // nextBit тут либо 0, либо 1, либо undefined, что можно трактовать как 0
         
          for(let i = 7; i >= 8 - bitsPerImageByte; --i){
            if (!lastIteratorResult.done) {
            lastIteratorResult = messageBitIterator.next()
            const nextBit = lastIteratorResult.value
            channelByteAsBitArray[i] = nextBit;
            }else{
              break;
            }
          }
        // Код к заданиям 2 и 3 тут
        // тут в зависимости от значения (или нескольких значений) nextBit мы должны что-то сделать с channelByteAsBitArray

        const modifiedChannelByte = bitArrayToByte(channelByteAsBitArray) // преобразуем массив бит после изменений обратно в число
        pixelColor[channelName] = modifiedChannelByte // записываем число в соответствующую компоненту pixelColor (r, g или b)
      }
      // внести модифицированный цвет обратно в пиксель контейнера
      const modifiedColor = Jimp.rgbaToInt(pixelColor.r, pixelColor.g, pixelColor.b, pixelColor.a)
      modifiedContainer.setPixelColor(modifiedColor, column, row)

      if (lastIteratorResult.done) {
        // сюда попадём, когда в сообщении больше не останется битов, т.е. если к этому моменту сообщение полностью
        // встроено в контейнер, его можно сразу вернуть
        return modifiedContainer
      }
    }
  }

  if (!messageBitIterator.next().done) {
    // сюда можем попасть, если итерация по координатам пикселя закончилась, а в
    // побитовом итераторе всё ещё остались значения для встраивания
    throw new Error('Сообщение слишком большое, чтобы быть встроенным в этот контейнер')
  }

  // редкий случай, сюда можем попасть, если размер изображения идеально точно подошёл под размер сообщения
  return modifiedContainer
}

export function imageLSBExtract(
  container: Jimp,
  byteLength: number,
  bitsPerImageByte: LSBBitsPerImageByte = 1,
): ArrayBuffer {
  const byteArray: number[] = []

  const modifiedContainer = container.clone()
  
  const bitArray: ByteAsBitArray = [0, 0, 0, 0, 0, 0, 0, 0]

  let bitIndex = 0, byteLengthCount = 0;
  for (let row = 0; row < modifiedContainer.getHeight(); row++) {
    for (let column = 0; column < modifiedContainer.getWidth(); column++) {
      const pixelColor = Jimp.intToRGBA(container.getPixelColor(column, row))
      let nextBit: 0 | 1 = 1;
      for (const channelName of ['r', 'g', 'b'] as const) {
        const channelByte = pixelColor[channelName]
        const channelByteAsBitArray = byteToBitArray(channelByte) 

        for(let i = 7; i >= 8 - bitsPerImageByte; --i){
          nextBit = channelByteAsBitArray[i];
          bitArray[bitIndex] =  nextBit;
          
          ++bitIndex;
          if(bitIndex == 8){
            bitIndex = 0;
            ++byteLengthCount
            const byte = bitArrayToByte(bitArray)
            byteArray.push(byte)
           
            if(byteLengthCount === byteLength){
              return Uint8Array.from(byteArray).buffer
            }
            
          }
        }
        
      }
      
    }
  }
  return Uint8Array.from(byteArray).buffer
}

export function imageBlockEmbed(
  container: Jimp,
  message: ArrayBuffer,
  blockSize: {width: number; height: number},
): Jimp {
  const modifiedContainer = container.clone()

  const messageBitIterator = readBufferBitByBit(message)

  for (let row = 0; row < container.getHeight(); row += blockSize.height) {
    for (let column = 0; column < container.getWidth(); column += blockSize.width) {
      if (
        row + blockSize.height >= container.getHeight() ||
        column + blockSize.width >= container.getWidth()
      ) {
        // пропустить блок, если он не полный (т.е. выходит за ширину или за высоту изображения)
        continue
      }

      let xoredByte = 0
      for (let x = column; x < column + blockSize.width; x++) {
        for (let y = row; y < row + blockSize.height; y++) {
          const color = Jimp.intToRGBA(container.getPixelColor(x, y))
          for (const component of ['r', 'g', 'b'] as const) {
            xoredByte ^= color[component]
          }
        }
      }

      let parityBit = 0
      for (const bit of byteToBitArray(xoredByte)) {
        parityBit ^= bit
      }

      const iteratorResult = messageBitIterator.next()
      if (iteratorResult.done) {
        // сюда попадём, когда в сообщении больше не останется битов, т.е. сообщение полностью
        // встроено в контейнер и можно его вернуть
        return modifiedContainer
      }

      const nextBit = iteratorResult.value // nextBit тут либо 0, либо 1

      // если бит четности совпадает с тем битом, который нужно встроить, можно ничего не делать
      if (parityBit !== nextBit) {
        let x = Math.floor(Math.random() * (row + blockSize.height - row) ) + row;
        let y = Math.floor(Math.random() * (column + blockSize.width - column)) + column;

        const pixelColor = Jimp.intToRGBA(container.getPixelColor(y, x));
        
        const channelByte = pixelColor['b'];
        const channelByteAsBitArray = byteToBitArray(channelByte) ;
        channelByteAsBitArray[0] = channelByteAsBitArray[0] === 0 ? 1 : 0;
        const modifiedChannelByte = bitArrayToByte(channelByteAsBitArray) 
        pixelColor['b'] = modifiedChannelByte
        const modifiedColor = Jimp.rgbaToInt(pixelColor.r, pixelColor.g, pixelColor.b, pixelColor.a);
        modifiedContainer.setPixelColor(modifiedColor, y, x);
      }
      const a = 6;
    }
  }

  if (!messageBitIterator.next().done) {
    // сюда можем попасть, если итерация по координатам пикселя закончилась, а в
    // побитовом итераторе всё ещё остались значения для встраивания
    throw new Error('Сообщение слишком большое, чтобы быть встроенным в этот контейнер')
  }

  // редкий случай, сюда можем попасть, если размер изображения идеально точно подошёл под размер сообщения
  return modifiedContainer
}

export function imageBlockExtract(
  container: Jimp,
  blockSize: {width: number; height: number},
  length: number,
) {
  const byteArray: number[] = []

  // тут нужно побитово прочитать биты четности, пока не будет получено length байт в массиве
  // Код к заданию 6 тут

  let byteCount = 0, bitCount = 0;
  const bitArray: ByteAsBitArray = [0, 0, 0, 0, 0, 0, 0, 0]

  for (let row = 0; row < container.getHeight(); row += blockSize.height) {
    for (let column = 0; column < container.getWidth(); column += blockSize.width) {
      if (
        row + blockSize.height >= container.getHeight() ||
        column + blockSize.width >= container.getWidth()
      ) {
        continue
      }

      let xoredByte = 0
      for (let x = column; x < column + blockSize.width; ++x) {
        for (let y = row; y < row + blockSize.height; ++y) {
          const color = Jimp.intToRGBA(container.getPixelColor(x, y))
          for (const component of ['r', 'g', 'b'] as const) {
            xoredByte ^= color[component]
          }
        }
      }

      let parityBit : Bit = 0
      for (const bit of byteToBitArray(xoredByte)) {
        parityBit ^= bit
      }

      bitArray[bitCount] = <Bit>parityBit;

      ++bitCount;
      if(bitCount == 8){
        bitCount = 0;
        ++byteCount;
        const byte = bitArrayToByte(bitArray)
        byteArray.push(byte)
      }
      if (byteCount == length) {
        return Uint8Array.from(byteArray).buffer
      }
    }
  }
  return Uint8Array.from(byteArray).buffer
}
