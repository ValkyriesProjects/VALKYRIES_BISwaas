import os
import mysql.connector


def get_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        port=int(os.getenv("DB_PORT", "4000")),
        ssl_disabled=False
    )


def get_standard_by_number(is_number):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT *
        FROM standards
        WHERE is_number = %s
    """

    cursor.execute(query, (is_number,))
    result = cursor.fetchone()

    cursor.close()
    connection.close()

    return result


def get_product_info(product_type):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT
            pt.product_type,
            pt.metal_type,
            hr.hallmarking_required,
            hr.required_since,
            hr.huid_required,
            hr.coverage_note,
            hr.penalty_note,
            s.is_number AS applicable_standard,
            s.standard_title,
            s.official_source,
            s.last_verified
        FROM product_types pt
        JOIN hallmarking_rules hr
            ON pt.metal_type = hr.metal_type
            AND pt.article_type = hr.article_type
        JOIN standards s
            ON hr.standard_id = s.id
        WHERE pt.product_type = %s
    """

    cursor.execute(query, (product_type,))
    result = cursor.fetchone()

    cursor.close()
    connection.close()

    return result


def get_purity_grades(metal_type):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT purity_label, fineness_value, notes
        FROM purity_grades
        WHERE metal_type = %s
        ORDER BY fineness_value
    """

    cursor.execute(query, (metal_type,))
    results = cursor.fetchall()

    cursor.close()
    connection.close()

    return results


def get_hallmark_components(metal_type):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT component_name, description, example_value
        FROM hallmark_components
        WHERE metal_type = %s
    """

    cursor.execute(query, (metal_type,))
    results = cursor.fetchall()

    cursor.close()
    connection.close()
    return results
def get_all_product_types():
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT product_type
        FROM product_types
    """

    cursor.execute(query)
    results = cursor.fetchall()

    cursor.close()
    connection.close()

    return results
def get_hallmarking_overview(metal_type):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    # Get hallmarking rules + standard information
    query = """
        SELECT
            hr.metal_type,
            hr.article_type,
            hr.hallmarking_required,
            hr.required_since,
            hr.huid_required,
            hr.coverage_note,
            hr.penalty_note,
            hr.last_verified,

            s.is_number,
            s.standard_title,
            s.applicability,
            s.required_documents,
            s.procedures,
            s.testing_certification,
            s.official_source

        FROM hallmarking_rules hr
        JOIN standards s
            ON hr.standard_id = s.id
        WHERE hr.metal_type = %s
    """

    cursor.execute(query, (metal_type,))
    rules = cursor.fetchall()

    # Get purity grades
    query = """
        SELECT
            purity_label,
            fineness_value,
            notes
        FROM purity_grades
        WHERE metal_type = %s
        ORDER BY fineness_value
    """

    cursor.execute(query, (metal_type,))
    purities = cursor.fetchall()

    # Get hallmark components
    query = """
        SELECT
            component_name,
            description,
            example_value
        FROM hallmark_components
        WHERE metal_type = %s
    """

    cursor.execute(query, (metal_type,))
    components = cursor.fetchall()

    cursor.close()
    connection.close()

    return {
        "metal": metal_type,
        "rules": rules,
        "purities": purities,
        "hallmark_components": components
    }
