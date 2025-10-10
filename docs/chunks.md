```
    useEffect(() => {
        const evtSource = new EventSource("/api/prompt-a-modal");

        evtSource.onmessage = (e) => {
        if (e.data === "[DONE]") {
            evtSource.close();
        } else {
            console.log("Chunk:", e.data);
            setData((prevVal) => prevVal + e.data);
        }
        };

        return () => evtSource.close();

    }, []);

    useEffect(() => {
        (async () => {
        const response = await fetch("/api/prompt-a-modal");

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            console.log("Chunk:", chunk);
        }
        })();

    }, []);
```
