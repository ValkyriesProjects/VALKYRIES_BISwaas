from services.chat_service import process_question

questions = [
    "Do gold bangles require hallmarking?",
    "Tell me about gold rings",
    "Are gold earrings hallmarked?",
    "Tell me about silver rings"
]

for question in questions:
    print("\nQUESTION:", question)
    print(process_question(question))
print("\nQUESTION: Tell me about gold hallmarking")
print(process_question("Tell me about gold hallmarking"))

print("\nQUESTION: Tell me about silver hallmarking")
print(process_question("Tell me about silver hallmarking"))