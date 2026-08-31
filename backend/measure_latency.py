import time
import requests

url = "http://127.0.0.1:5000/api/chat"

questions = [
    "Do gold bangles require hallmarking?",
    "Tell me about gold rings",
    "What are the gold purity grades?",
    "Tell me about silver rings",
    "What is IS 1417?"
]

times = []

# Run multiple requests
for i in range(20):
    question = questions[i % len(questions)]

    start = time.perf_counter()

    response = requests.post(
        url,
        json={"message": question}
    )

    end = time.perf_counter()

    latency = end - start
    times.append(latency)

    print(
        f"Request {i + 1}: "
        f"{latency:.3f} seconds | "
        f"Status: {response.status_code}"
    )


# Sort response times
times.sort()

# Calculate p95
index = int(len(times) * 0.95) - 1
p95 = times[index]

print("\n--- RESULTS ---")
print(f"Total requests: {len(times)}")
print(f"Fastest: {times[0]:.3f} seconds")
print(f"Slowest: {times[-1]:.3f} seconds")
print(f"p95 latency: {p95:.3f} seconds")