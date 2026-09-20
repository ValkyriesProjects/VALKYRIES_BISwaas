import os
import sys

backend_path = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "backend")
)

sys.path.insert(0, backend_path)

from app import app