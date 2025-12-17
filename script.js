const btn = document.getElementById("btn");
const audio = document.getElementById("audio");
const download = document.getElementById("download");

btn.addEventListener("click", async () => {
    const text = document.getElementById("text").value;

    if (!text.trim()) {
        alert("Please enter some text.");
        return;
    }

    audio.hidden = true;
    download.hidden = true;

    try {
        const response = await fetch("api-url yazcaz", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });

        if (!response.ok) {
            throw new Error("Server error");
        }

        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);

        audio.src = audioUrl;
        audio.hidden = false;

        download.href = audioUrl;
        download.hidden = false;

    } catch (err) {
        alert("Audio generation failed.");
        console.error(err);
    }
});
