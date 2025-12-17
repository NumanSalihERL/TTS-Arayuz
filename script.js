const btn = document.getElementById("btn");
const audio = document.getElementById("audio");
const downloadWav = document.getElementById("download-wav");
const downloadMp3 = document.getElementById("download-mp3");
const info = document.getElementById("info");
const durationEl = document.getElementById("duration");
const sizeEl = document.getElementById("size");
const loading = document.getElementById("loading");

btn.addEventListener("click", async () => {
    const text = document.getElementById("text").value.trim();
    if (!text) {
        alert("Please enter some text.");
        return;
    }

    //RESET UI
    loading.style.display = "flex";
    audio.style.display = "none";
    info.style.display = "none";
    downloadWav.style.display = "none";
    downloadMp3.style.display = "none";
    btn.disabled = true;

     //API YAZILACAK YER
    try {
        const response = await fetch("api-url yazcaz", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });

        if (!response.ok) throw new Error("Server error");

        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);

        //GENERATE BİTTİ
        loading.style.display = "none";

        audio.src = audioUrl;
        audio.style.display = "block";

        sizeEl.innerText = `File size: ${(blob.size / 1024).toFixed(2)} KB`;

        audio.onloadedmetadata = () => {
            durationEl.innerText = `Duration: ${audio.duration.toFixed(2)} sec`;
            info.style.display = "block";
        };

        downloadWav.href = audioUrl;
        downloadWav.download = "tts_audio.wav";
        downloadWav.style.display = "block";

        const mp3Blob = await wavToMp3(blob);
        const mp3Url = URL.createObjectURL(mp3Blob);

        downloadMp3.href = mp3Url;
        downloadMp3.download = "tts_audio.mp3";
        downloadMp3.style.display = "block";

    } catch (err) {
        loading.style.display = "none";
        alert("Audio generation failed.");
        console.error(err);
    } finally {
        btn.disabled = false;
    }
});

async function wavToMp3(wavBlob) {
    const arrayBuffer = await wavBlob.arrayBuffer();
    const audioCtx = new AudioContext();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    const pcm = audioBuffer.getChannelData(0);
    const encoder = new lamejs.Mp3Encoder(1, audioBuffer.sampleRate, 128);
    const mp3Data = [];

    let samples = new Int16Array(pcm.length);
    for (let i = 0; i < pcm.length; i++) {
        samples[i] = pcm[i] * 32767;
    }

    const chunk = 1152;
    for (let i = 0; i < samples.length; i += chunk) {
        const mp3buf = encoder.encodeBuffer(samples.subarray(i, i + chunk));
        if (mp3buf.length > 0) mp3Data.push(mp3buf);
    }

    const end = encoder.flush();
    if (end.length > 0) mp3Data.push(end);

    return new Blob(mp3Data, { type: "audio/mp3" });
}
