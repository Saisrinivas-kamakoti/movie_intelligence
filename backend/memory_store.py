"""In-memory database fallback for local development and preview deployments."""
from __future__ import annotations

from types import SimpleNamespace
from typing import Any, Dict, Iterable, List, Optional, Tuple


def _matches(document: Dict[str, Any], query: Dict[str, Any]) -> bool:
    for key, value in query.items():
        if document.get(key) != value:
            return False
    return True


def _project(document: Dict[str, Any], projection: Optional[Dict[str, int]]) -> Dict[str, Any]:
    if not projection:
        return dict(document)

    include_keys = [key for key, enabled in projection.items() if enabled and key != "_id"]
    if include_keys:
        return {key: document.get(key) for key in include_keys if key in document}

    result = dict(document)
    for key, enabled in projection.items():
        if not enabled and key in result:
            result.pop(key, None)
    return result


class MemoryCursor:
    def __init__(self, documents: Iterable[Dict[str, Any]], projection: Optional[Dict[str, int]] = None):
        self._documents = [_project(document, projection) for document in documents]

    def sort(self, field: str, direction: int):
        reverse = direction < 0
        self._documents.sort(key=lambda item: item.get(field, ""), reverse=reverse)
        return self

    def limit(self, count: int):
        self._documents = self._documents[:count]
        return self

    async def to_list(self, count: int):
        return self._documents[:count]


class MemoryCollection:
    def __init__(self):
        self._documents: List[Dict[str, Any]] = []

    async def insert_one(self, document: Dict[str, Any]):
        self._documents.append(dict(document))
        return SimpleNamespace(inserted_id=document.get("id"))

    async def find_one(self, query: Dict[str, Any], projection: Optional[Dict[str, int]] = None):
        for document in self._documents:
            if _matches(document, query):
                return _project(document, projection)
        return None

    def find(self, query: Optional[Dict[str, Any]] = None, projection: Optional[Dict[str, int]] = None):
        query = query or {}
        filtered = [document for document in self._documents if _matches(document, query)]
        return MemoryCursor(filtered, projection)

    async def update_one(self, query: Dict[str, Any], update: Dict[str, Any]):
        for document in self._documents:
            if _matches(document, query):
                document.update(update.get("$set", {}))
                return SimpleNamespace(matched_count=1, modified_count=1)
        return SimpleNamespace(matched_count=0, modified_count=0)

    async def delete_one(self, query: Dict[str, Any]):
        for index, document in enumerate(self._documents):
            if _matches(document, query):
                self._documents.pop(index)
                return SimpleNamespace(deleted_count=1)
        return SimpleNamespace(deleted_count=0)

    async def delete_many(self, query: Dict[str, Any]):
        remaining = [document for document in self._documents if not _matches(document, query)]
        deleted_count = len(self._documents) - len(remaining)
        self._documents = remaining
        return SimpleNamespace(deleted_count=deleted_count)

    async def count_documents(self, query: Dict[str, Any]):
        return sum(1 for document in self._documents if _matches(document, query))


class MemoryDatabase:
    def __init__(self):
        self._collections: Dict[str, MemoryCollection] = {}

    def __getattr__(self, item: str) -> MemoryCollection:
        if item.startswith("_"):
            raise AttributeError(item)
        return self._collections.setdefault(item, MemoryCollection())


class MemoryClient:
    def close(self):
        return None
