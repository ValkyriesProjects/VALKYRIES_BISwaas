import re


TOPIC_SYNONYMS = {
    "jeweller_registration": [
        "jeweller registration",
        "jewellery registration",
        "jewelry registration",
        "register as a jeweller",
        "register as jeweller",
        "register jeweller",
        "bis registration",
        "jeweller registration process"
    ],

    "hallmarking_process": [
        "hallmarking process",
        "hallmarking procedure",
        "hallmark process",
        "get jewellery hallmarked",
        "get jewelry hallmarked",
        "jewellery hallmarked",
        "jewelry hallmarked",
        "hallmark jewellery",
        "hallmark jewelry",
        "how to hallmark",
        "how do i hallmark",
        "hallmarking"
    ],

    "testing_and_certification": [
        "testing and certification",
        "testing certification",
        "gold testing",
        "silver testing",
        "test gold",
        "test silver",
        "gold tested",
        "silver tested",
        "how is gold tested",
        "how is silver tested",
        "purity testing",
        "purity test",
        "assaying",
        "assay",
        "certification"
    ],

    "huid": [
        "huid",
        "huid number",
        "hallmark unique identification",
        "verify huid",
        "huid verification"
    ],

    "consumer_verification": [
        "verify jewellery",
        "verify jewelry",
        "verify gold",
        "verify silver",
        "check hallmark",
        "check gold",
        "check silver",
        "genuine gold",
        "genuine silver",
        "jewellery verification",
        "jewelry verification",
        "consumer verification",
        "verify my jewellery",
        "verify my jewelry",
        "verify my gold"
    ]
}
def normalize_query(query):
    """
    Convert the user's question into a simpler form.
    """

    query = query.lower().strip()

    # Remove unnecessary punctuation
    query = re.sub(r"[^\w\s]", " ", query)

    # Remove extra spaces
    query = re.sub(r"\s+", " ", query)

    return query


def identify_topic(query):
    """
    Identify the hallmarking topic from the user's
    natural-language question.
    """

    query = normalize_query(query)

    for topic, synonyms in TOPIC_SYNONYMS.items():
        for synonym in synonyms:
            if synonym in query:
                return topic

    return None