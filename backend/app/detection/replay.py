"""
Replay Attack Detection Module
Maintains in-memory consumed transaction set to prevent reuse of quantum states.
"""
import threading
from typing import Set, Dict, Any

_lock = threading.Lock()
consumed_transactions: Set[str] = set()

def check_replay_attack(transaction_id: str, consume: bool = True) -> Dict[str, Any]:
    """
    Checks if transaction_id has already been consumed.
    If consume=True and not consumed, records transaction_id into consumed_transactions set.
    """
    with _lock:
        already_consumed = transaction_id in consumed_transactions
        if not already_consumed and consume:
            consumed_transactions.add(transaction_id)

    is_valid = not already_consumed
    
    return {
        "valid": is_valid,
        "transaction_id": transaction_id,
        "already_consumed": already_consumed,
        "threat_flag": "REPLAY_ATTACK_DETECTED" if already_consumed else None,
        "description": "Unique transaction ID validated" if is_valid else f"CRITICAL: Replay attack detected! Transaction ID {transaction_id} already consumed."
    }

def reset_replay_cache() -> None:
    """
    Resets the in-memory consumed transaction set (useful for test suites).
    """
    with _lock:
        consumed_transactions.clear()
