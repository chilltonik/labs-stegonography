import Jimp from 'jimp'
import {TextEncoder, TextDecoder} from 'util'
import fs from "fs"
import {imageLSBEmbed, imageLSBExtract, imageBlockEmbed, imageBlockExtract} from '../lab2/lab2'
import {kjbEmbed, kjbExtract, multiply} from '../lab3/lab3'
jest.setTimeout(30000);

describe('lab4', () => {
//   it('1 bit per byte', async () => {

//     let messageLength = 10000;
//     for(let i = 0; i< 7; ++i){
//       const container = await Jimp.read(`container${i+1}.bmp`)

//       const extractedMessageAsUtf8 = imageLSBExtract(container, messageLength);
//       const textDecoder = new TextDecoder();
//       const decodedExtractedMessage = textDecoder.decode(extractedMessageAsUtf8);

//       fs.writeFileSync(`perbit${i+1}.txt`, decodedExtractedMessage);
//     }

//     for(let i = 8; i< 10; ++i){
//       const container = await Jimp.read(`container${i}.png`)

//       const extractedMessageAsUtf8 = imageLSBExtract(container, messageLength);
//       const textDecoder = new TextDecoder();
//       const decodedExtractedMessage = textDecoder.decode(extractedMessageAsUtf8);

//       fs.writeFileSync(`perbit${i+1}.txt`, decodedExtractedMessage);
//     }

//     const container = await Jimp.read(`container10.jpg`)

//       const extractedMessageAsUtf8 = imageLSBExtract(container, messageLength);
//       const textDecoder = new TextDecoder();
//       const decodedExtractedMessage = textDecoder.decode(extractedMessageAsUtf8);

//       fs.writeFileSync(`perbit10.txt`, decodedExtractedMessage);
//   })

//   it('LSB Block', async () => {

//     const config = {
//       width: 3,
//       height: 11,
//     }

//     let messageLength = 10000;
//     for(let i = 0; i< 7; ++i){
//       const container = await Jimp.read(`container${i+1}.bmp`)

//       const extractedMessageAsUtf8 = imageBlockExtract(container,config, messageLength);
//       const textDecoder = new TextDecoder();
//       const decodedExtractedMessage = textDecoder.decode(extractedMessageAsUtf8);

//       fs.writeFileSync(`perbit${i+1}.txt`, decodedExtractedMessage);
//     }
      
//     for(let i = 8; i< 10; ++i){
//       const container = await Jimp.read(`container${i}.png`)

//       const extractedMessageAsUtf8 = imageBlockExtract(container,config, messageLength);
//       const textDecoder = new TextDecoder();
//       const decodedExtractedMessage = textDecoder.decode(extractedMessageAsUtf8);

//       fs.writeFileSync(`perbit${i}.txt`, decodedExtractedMessage);
//     }

//     const container = await Jimp.read(`container10.jpg`)

//       const extractedMessageAsUtf8 = imageBlockExtract(container,config, messageLength);
//       const textDecoder = new TextDecoder();
//       const decodedExtractedMessage = textDecoder.decode(extractedMessageAsUtf8);

//       fs.writeFileSync(`perbit10.txt`, decodedExtractedMessage);
//   })







// it('ex', async () =>{
//   const container = await Jimp.read(`container${2}.bmp`)
//   const extractedMessageAsUtf8 = imageLSBExtract(container,10000)
//   const textDecoder = new TextDecoder();
//   const decodedExtractedMessage = textDecoder.decode(extractedMessageAsUtf8);
//   fs.writeFileSync(`perbit${2}.txt`, decodedExtractedMessage,"utf-8");
// } )

//   it('LSB Block', async () => {


//     let messageLength = 10000;
//     {
//       const container = await Jimp.read(`container${1}.bmp`)

//       const extractedMessageAsUtf8 = imageLSBExtract(container, messageLength);
//       const textDecoder = new TextDecoder();
//       const decodedExtractedMessage = textDecoder.decode(extractedMessageAsUtf8);

//       fs.writeFileSync(`perbit${1}.txt`, decodedExtractedMessage,"utf-8");
    
//   }
 
//     {
//       const container = await Jimp.read(`container${3}.png`)
//       const extractedMessageAsUtf8 = imageLSBExtract(container, messageLength);
//       const textDecoder = new TextDecoder();
//       const decodedExtractedMessage = textDecoder.decode(extractedMessageAsUtf8);
//       fs.writeFileSync(`perbit${3}.txt`, decodedExtractedMessage,"utf-8");
//   }
    
//   })

//   it('LSB Block', async () => {
//     const config = { width: 14, height: 9}

    
//       const container = await Jimp.read(`container${5}.png`)
//       const ex = imageBlockExtract(container,config,15000);
//       const textDecoder = new TextDecoder();
//       const dec = textDecoder.decode(ex);

//       fs.writeFileSync(`perBlock${5}.txt`,dec,"utf-8")
    
// })

// it('LSB Block2', async () => {
  
//   const config = { width: 14, height: 9}

//   const container = await Jimp.read(`container${4}.jpg`)
//   const ex = imageBlockExtract(container,config,15000);
//   const textDecoder = new TextDecoder();
//   const dec = textDecoder.decode(ex);

//   fs.writeFileSync(`perBlock${4}.txt`,dec,"utf-8")
  
// })

// it('KJB', async () => {

//     const container = await Jimp.read(`container${6}.jpg`)
//     const ex = kjbExtract(container,8);
//     const textDecoder = new TextDecoder();
//     const dec = textDecoder.decode(ex);

//     fs.writeFileSync(`perKJB${6}.txt`,dec,"utf-8")
  
// })

it('KJB2', async () => {
  
    const container = await Jimp.read(`container${7}.png`)
    const ex = kjbExtract(container,8,{ multiplicity: 10,} );
    const textDecoder = new TextDecoder();
    const dec = textDecoder.decode(ex);

    fs.writeFileSync(`perKJB${7}.txt`,dec,"utf-8")
  
})
// it('9', async () => {

//   let messageLength = 10000;
//       {
//         const container = await Jimp.read(`container${9}.bmp`)
  
//         const extractedMessageAsUtf8 = imageLSBExtract(container, messageLength);
//         const textDecoder = new TextDecoder();
//         const decodedExtractedMessage = textDecoder.decode(extractedMessageAsUtf8);
  
//         fs.writeFileSync(`perbit${9}.txt`, decodedExtractedMessage,"utf-8");

// }})

})