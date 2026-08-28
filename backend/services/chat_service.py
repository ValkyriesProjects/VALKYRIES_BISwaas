from repositories.bis_repository import search_bis
from services.query_processor import identify_topic


def process_question(question):
    # Step 1: Identify the hallmarking topic
    topic = identify_topic(question)

    if not topic:
        return {
            "answer": (
                "I could not identify the hallmarking topic in your question. "
                "You can ask about jeweller registration, hallmarking process, "
                "testing and certification, HUID, or consumer verification."
            ),
            "applicable_standards": [],
            "eligibility": "",
            "application": "",
            "fees": "",
            "required_documents": [],
            "testing_and_certification": "",
            "procedure": [],
            "validity": "",
            "official_references": []
        }

    # Step 2: Search the BIS knowledge base
    results = search_bis(topic)

    if not results:
        return {
            "answer": (
                f"I identified your question as related to '{topic}', "
                "but I could not find relevant BIS information."
            ),
            "applicable_standards": [],
            "eligibility": "",
            "application": "",
            "fees": "",
            "required_documents": [],
            "testing_and_certification": "",
            "procedure": [],
            "validity": "",
            "official_references": []
        }

    # Step 3: Use the relevant BIS record
    record = results[0]

    # Step 4: Build a natural-language answer
    answer = record["answer"]

    return {
        "answer": answer,

        "topic": record["topic"],

        "applicable_standards": record["applicable_IS_numbers"],

        "eligibility": record["eligibility"],

        "application": record["application"],

        "fees": record["fees"],

        "required_documents": record["documents"],

        "testing_and_certification": record["testing_and_certification"],

        "procedure": record["procedure"],

        "validity": record["validity"],

        "official_references": record["official_references"]
    }