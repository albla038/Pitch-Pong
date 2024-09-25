export function getRandomAngle() {
  const seed = Math.random();
  if (seed < 0.5) {
    return (3 / 4) * Math.PI + Math.random() * (5 / 4 - 3 / 4) * Math.PI;
  } else {
    return (-1 / 4) * Math.PI + Math.random() * (1 / 4 - -1 / 4) * Math.PI;
  }
}


function getPitch(
  frequencyArray: number[],
  sampleRate: number,
  binSize: number,

): number {
  const numHarmonics = 4; //antal harmoniska
  const hpsArray = frequencyArray.slice(); //skapa en kopia av frekvensarrayen för att undvika att ändra original data
//Utför hps genom att multiplicera  nedskalade spektra
  for(let harmonic = 2; harmonic <= numHarmonics; harmonic++){

    const downsampledArray = [];
    // Skapa nedskalad version av frekvensarrayen
    for (let i = 0; i < Math.floor(frequencyArray.length / harmonic); i++){
      downsampledArray[i] = frequencyArray[i * harmonic];

    }

    //multiplicera de nedskalade amplituderna med hps arrayen
    for(let i = 0; i < downsampledArray.length; i++){
      hpsArray[i] *= downsampledArray[i];
    }
  }

  const fundamentalFreq = (max * sampleRate) / binSize;

  return fundamentalFreq;
}