const usePitchDetection = () => {
  recordAndAnalyze();
};

async function recordAndAnalyze(): Promise<void> {
  try {
    // 1. Spela in ljudet
    const recordedBlob = await startRecording();

    // 2. Skapa AudioContext
    const audioContext = new window.AudioContext();

    // 3. Läs in Bloben som ArrayBuffer
    const arrayBuffer = await blobToArrayBuffer(recordedBlob);

    // 4. Dekoda ArrayBuffern till AudioBuffer
    const audioBuffer = await decodeAudioData(arrayBuffer, audioContext);

    // 5. Skapa källa och AnalyserNode
    const source = createSource(audioBuffer, audioContext);
    const analyser = setupAnalyser(source, audioContext);

    // 6. Starta frekvensanalysen
    analyzeFrequencies(analyser);

    // 7. Starta källan (spela upp ljudet)
    source.start(0);
  } catch (error) {
    console.error("Ett fel inträffade:", error);
  }
}

function startRecording(): Promise<Blob> {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream: MediaStream) => {
        const mediaRecorder = new MediaRecorder(stream);
        const chunks: BlobPart[] = [];

        mediaRecorder.ondataavailable = (event: BlobEvent) => {
          chunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/webm" });
          resolve(blob);
        };

        mediaRecorder.start();

        // Stoppa inspelningen efter t.ex. 5 sekunder
        setTimeout(() => {
          mediaRecorder.stop();
        }, 5000);
      })
      .catch(reject);
  });
}

function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}

function decodeAudioData(
  arrayBuffer: ArrayBuffer,
  audioContext: AudioContext,
): Promise<AudioBuffer> {
  return new Promise((resolve, reject) => {
    audioContext.decodeAudioData(
      arrayBuffer,
      (buffer) => {
        if (buffer) {
          resolve(buffer);
        } else {
          reject(new Error("Dekodning misslyckades"));
        }
      },
      reject,
    );
  });
}

function createSource(
  audioBuffer: AudioBuffer,
  audioContext: AudioContext,
): AudioBufferSourceNode {
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  return source;
}

function setupAnalyser(
  source: AudioBufferSourceNode,
  audioContext: AudioContext,
): AnalyserNode {
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;

  source.connect(analyser);
  // Om du inte vill spela upp ljudet, anslut inte till destinationen
  // source.connect(audioContext.destination);

  return analyser;
}

function analyzeFrequencies(analyser: AnalyserNode): void {
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function draw() {
    analyser.getByteFrequencyData(dataArray);

    // Bearbeta frekvensdatan här
    console.log(dataArray);

    // Fortsätt analysera om källan fortfarande spelar
    requestAnimationFrame(draw);
  }

  draw();
}

export default usePitchDetection;
