from repositories.bis_repository import (
    get_product_info,
    get_purity_grades,
    get_hallmark_components
)
from repositories.bis_repository import get_hallmarking_overview

data = get_hallmarking_overview("gold")

print(data)


print("\n--- GOLD RING ---")
print(get_product_info("gold ring"))


print("\n--- GOLD PURITIES ---")
for purity in get_purity_grades("gold"):
    print(purity)


print("\n--- SILVER HALLMARK COMPONENTS ---")
for component in get_hallmark_components("silver"):
    print(component)