export function getRandomAngle() {
  const seed = Math.random();
  if (seed < 0.5) {
    return (3 / 4) * Math.PI + Math.random() * (5 / 4 - 3 / 4) * Math.PI;
  } else {
    return (-1 / 4) * Math.PI + Math.random() * (1 / 4 - -1 / 4) * Math.PI;
  }
}

export function getPitch(
  frequencyArray: number[],
  sampleRate: number,
  binSize: number,
): number {
  const numHarmonics = 5; //antal harmoniska
  const hpsArray = frequencyArray.slice(); //skapa en kopia av frekvensarrayen för att undvika att ändra original data
  //Utför hps genom att multiplicera  nedskalade spektra
  for (let harmonic = 2; harmonic <= numHarmonics; harmonic++) {
    const downsampledArray = [];
    // Skapa nedskalad version av frekvensarrayen
    for (let i = 0; i < Math.floor(frequencyArray.length / harmonic); i++) {
      downsampledArray[i] = frequencyArray[i * harmonic];
    }

    //multiplicera de nedskalade amplituderna med hps arrayen
    for (let i = 0; i < downsampledArray.length; i++) {
      hpsArray[i] *= downsampledArray[i];
    }
  }
  const index = hpsArray.indexOf(Math.max(...hpsArray));
  const fundamentalFreq = (index * (sampleRate / 2)) / binSize;

  return fundamentalFreq;
}

// export function getPitch(
//   frequencyArray: number[],
//   sampleRate: number,
//   binSize: number,
// ): number {
//   const output1 = [];
//   for (let i = 0; i < frequencyArray.length; i += 2) {
//     output1.push(frequencyArray[i]);
//   }

//   const output2 = [];
//   for (let i = 0; i < frequencyArray.length; i += 3) {
//     output2.push(frequencyArray[i]);
//   }

//   const output3 = [];
//   for (let i = 0; i < frequencyArray.length; i += 4) {
//     output3.push(frequencyArray[i]);
//   }

//   let output4: number[] = [];
//   for (let i = 0; i < output3.length; i++) {
//     output4[i] = frequencyArray[i] * output1[i] * output2[i] * output3[i];
//   }

//   const max = Math.max(...output4);
//   const index = output4.indexOf(max);

//   return (index * (sampleRate / 2)) / binSize;
// }
