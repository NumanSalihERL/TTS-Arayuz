document.getElementById("btn").addEventListener("click", async () => {
    const text = document.getElementById("text").value;

    if (!text.trim()) {
        alert("Please enter some text.");
        return;
    }

    try {
        const response = await fetch("BACKEND_URL_HERE/tts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: text })
        });

        if (!response.ok) {
            throw new Error("Server error");
        }

        const audioBlob = await response.blob();
        document.getElementById("audio").src = URL.createObjectURL(audioBlob);

    } catch (error) {
        alert("Failed to generate voice.");
        console.error(error);
    }
});
