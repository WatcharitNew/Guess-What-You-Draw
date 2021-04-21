import { Tensor, InferenceSession } from "onnxjs";
const softmax = require('softmax-fn');

// def preprocess_onnx(inputImage):
//   outputImage = cv2.cvtColor(inputImage, cv2.COLOR_GRAY2RGB)
//   outputImage = cv2.resize(outputImage, (224,224))
//   #mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)
//   #outputImage = train_transformations(image=outputImage)['image']
//   outputImage = outputImage.astype(float)/255
//   outputImage = (outputImage - np.array([0.485, 0.456, 0.406])) / np.array([0.229, 0.224, 0.225])
//   outputArray = np.expand_dims(outputImage.transpose((2,0,1)) ,axis=0 )
//   print(outputArray.shape)
//   return outputArray

// def softmax(arr):
//   x = np.exp(arr)
//   y = np.sum(x)
//   return x/y

const resizeAndNormalizeImage = (imageGray: number[][]) => {
    const HEIGHT = imageGray.length;
    const WIDTH = imageGray[0].length;

    const blockHeight = 2;
    const blockWidth = 3;

    const resizedImage: number[][] = [];
    for(let i=0; i<HEIGHT; i+=blockHeight) {
        const resizedRow: number[] = [];
        for(let j=0; j<WIDTH; j+=blockWidth) {
            let sum=0;
            
            for(let ii=i; ii<i+blockHeight; ii++) {
                for(let jj=j; jj<j+blockWidth; jj++) sum+=imageGray[ii][jj];
            }

            resizedRow.push(sum/(blockHeight*blockWidth)/255);
        }
        resizedImage.push(resizedRow);
    }
    return resizedImage;
}

const grayToRGBAndTransformToZ = (imageGray: number[][]) => {
    const HEIGHT = imageGray.length;
    const WIDTH = imageGray[0].length;
    const imageR: number[][] = [];
    const imageG: number[][] = [];
    const imageB: number[][] = [];

    for(let i=0; i<HEIGHT; i++) {
        const imageRRow: number[] = [];
        const imageGRow: number[] = [];
        const imageBRow: number[] = [];
        for(let j=0; j<WIDTH; j++) {
            imageRRow.push((imageGray[i][j]-0.485)/0.229);
            imageGRow.push((imageGray[i][j]-0.456)/0.224);
            imageBRow.push((imageGray[i][j]-0.406)/0.225);
        }
        imageR.push(imageRRow);
        imageG.push(imageGRow);
        imageB.push(imageBRow);
    }

    return [imageR, imageG, imageB];
}

const flatten = (imageRGB: number[][][]) => {
    const flattenImage: number[] = [];
    const HEIGHT = imageRGB[0].length;
    const WIDTH = imageRGB[0][0].length;

    for(let channel=0; channel<3; channel++) {
        for(let i=0; i<HEIGHT; i++) {
            for(let j=0; j<WIDTH; j++) {
                flattenImage.push(imageRGB[channel][i][j]);
            }
        }
    }
    return flattenImage;
}

const preprocessImage = (imageGray: number[][]) => {
    const resizedAndNormalizedImage: number[][] = resizeAndNormalizeImage(imageGray);
    const imageRGB: number[][][] = grayToRGBAndTransformToZ(resizedAndNormalizedImage);
    const flattenImageRGB: number[] = flatten(imageRGB);
    const inputTensor = new onnx.Tensor(flattenImageRGB, 'float32', [1, 3, 224, 224]);
    return inputTensor;
}

const session = new InferenceSession();
// use the following in an async method
const url = '/50-doodleNet-v1-2.onnx';
session.loadModel(url);

const argMax = (array: number[]) => array.map((el, idx) => [el, idx]);

export const predictImage = async (imageGray: number[][]) => {
    // // creating an array of input Tensors is the easiest way. For other options see the API documentation
    const inputTensor: Tensor = preprocessImage(imageGray);
    
    // // // run this in an async method:
    const predictedLabel = await session.run([inputTensor]).then((outputMap) => {
        const pred = outputMap.values().next().value.data;
        const softmaxPred = softmax(pred);
        let max = -1;
        let maxId = -1;
        softmaxPred.forEach((value: number, idx: number) => {
            if(value > max) {
                max = value;
                maxId = idx;
            }
        });
        return maxId;
    });
    return predictedLabel;
}