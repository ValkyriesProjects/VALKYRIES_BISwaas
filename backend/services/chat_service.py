from repositories.bis_repository import (
    get_product_info,
    get_purity_grades,
    get_hallmark_components,
    get_standard_by_number,
    get_all_product_types,
    get_hallmarking_overview
)


def process_question(question):
    question = question.lower()
        # GOLD HALLMARKING OVERVIEW
    

    # Find a product type mentioned in the user's question
    products = get_all_product_types()

    # Common alternative words for products
    product_aliases = {
        "gold ring": ["gold ring", "gold rings", "ring made of gold"],
        "gold necklace": ["gold necklace", "gold necklaces"],
        "gold chain": ["gold chain", "gold chains"],
        "gold bangle": ["gold bangle", "gold bangles"],
        "gold earrings": ["gold earring", "gold earrings"],
        "gold pendant": ["gold pendant", "gold pendants"],

        "silver ring": ["silver ring", "silver rings"],
        "silver chain": ["silver chain", "silver chains"]
    }

    for product in products:
        product_name = product["product_type"].lower()

        aliases = product_aliases.get(product_name, [product_name])

        for alias in aliases:
            if alias in question:
                data = get_product_info(product["product_type"])

                if data:
                    return {
                        "answer": (
                            f"{data['product_type'].title()} is subject to "
                            f"{data['hallmarking_required']} "
                            f"hallmarking requirements."
                        ),
                        "product": data
                    }
    if (
            "gold" in question
            and ("hallmark" in question or "hallmarking" in question)
        ):
            data = get_hallmarking_overview("gold")
    
            return {
                "answer": "Here is a complete BIS overview of gold hallmarking.",
                "topic": "Gold Hallmarking",
                "overview": data
            }
    
        # SILVER HALLMARKING OVERVIEW
    if (
            "silver" in question
            and ("hallmark" in question or "hallmarking" in question)
        ):
            data = get_hallmarking_overview("silver")
    
            return {
                "answer": "Here is a complete BIS overview of silver hallmarking.",
                "topic": "Silver Hallmarking",
                "overview": data
            }            

    # GOLD PURITY
    purity_keywords = [
        "gold purity",
        "gold purities",
        "purity grades",
        "gold grades",
        "gold fineness",
        "gold purity levels",
        "carat"
    ]

    if any(keyword in question for keyword in purity_keywords):
        data = get_purity_grades("gold")

        return {
            "answer": "These are the BIS-recognized gold purity grades.",
            "purities": data
        }

    # SILVER HALLMARK
    silver_keywords = [
        "silver hallmark",
        "silver hallmark contain",
        "silver hallmark components",
        "silver marking"
    ]

    if any(keyword in question for keyword in silver_keywords):
        data = get_hallmark_components("silver")

        return {
            "answer": "These are the components of a silver hallmark.",
            "hallmark_components": data
        }

    # IS 1417
    if "is 1417" in question or "is1417" in question:
        data = get_standard_by_number("IS 1417:2016")

        if not data:
            return {
                "answer": "I could not find information about IS 1417:2016."
            }

        return {
            "answer": (
                f"{data['is_number']} is "
                f"{data['standard_title']}."
            ),
            "standard": data
        }

    # DEFAULT RESPONSE
    return {
        "answer": (
            "I currently have database information about gold hallmarking, "
            "gold purity grades, silver hallmark components, and BIS standards."
        )
    }