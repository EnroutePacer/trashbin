from dataclasses import dataclass
from datetime import datetime

@dataclass
class MoveRecord:
    src: str
    dst: str
    timestamp: str = datetime.now().isoformat()