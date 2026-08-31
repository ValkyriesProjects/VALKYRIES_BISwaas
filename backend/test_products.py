from repositories.bis_repository import get_all_product_types

products = get_all_product_types()

for product in products:
    print(product["product_type"])