"""User workspace - saved simulations, comparisons, notes"""
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Optional, Dict, List
from auth import get_current_user

workspace_router = APIRouter(prefix="/api/workspace")

db = None

def init_workspace(database):
    global db
    db = database


class SaveSimulationInput(BaseModel):
    title: str
    concept: Dict
    prediction: Dict
    notes: Optional[str] = None

class SaveComparisonInput(BaseModel):
    title: str
    concepts: List[Dict]
    notes: Optional[str] = None

class NoteInput(BaseModel):
    title: str
    content: str
    category: Optional[str] = "general"

class NoteUpdateInput(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None


@workspace_router.get("/simulations")
async def get_saved_simulations(request: Request):
    """Get user's saved simulations"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    sims = await db.saved_simulations.find(
        {"user_id": user["user_id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return {"simulations": sims, "total": len(sims)}


@workspace_router.post("/simulations")
async def save_simulation(data: SaveSimulationInput, request: Request):
    """Save a simulation to workspace"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    sim_id = str(uuid.uuid4())
    doc = {
        "sim_id": sim_id,
        "user_id": user["user_id"],
        "title": data.title,
        "concept": data.concept,
        "prediction": data.prediction,
        "notes": data.notes,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.saved_simulations.insert_one(doc)
    
    return {"message": "Simulation saved", "sim_id": sim_id}


@workspace_router.delete("/simulations/{sim_id}")
async def delete_simulation(sim_id: str, request: Request):
    """Delete a saved simulation"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    result = await db.saved_simulations.delete_one({"sim_id": sim_id, "user_id": user["user_id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Simulation not found")
    
    return {"message": "Simulation deleted"}


@workspace_router.get("/comparisons")
async def get_saved_comparisons(request: Request):
    """Get user's saved comparisons"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    comps = await db.saved_comparisons.find(
        {"user_id": user["user_id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return {"comparisons": comps, "total": len(comps)}


@workspace_router.post("/comparisons")
async def save_comparison(data: SaveComparisonInput, request: Request):
    """Save a comparison to workspace"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    comp_id = str(uuid.uuid4())
    doc = {
        "comp_id": comp_id,
        "user_id": user["user_id"],
        "title": data.title,
        "concepts": data.concepts,
        "notes": data.notes,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.saved_comparisons.insert_one(doc)
    
    return {"message": "Comparison saved", "comp_id": comp_id}


@workspace_router.delete("/comparisons/{comp_id}")
async def delete_comparison(comp_id: str, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    result = await db.saved_comparisons.delete_one({"comp_id": comp_id, "user_id": user["user_id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Comparison not found")
    return {"message": "Comparison deleted"}


@workspace_router.get("/notes")
async def get_notes(request: Request):
    """Get user's notes"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    notes = await db.user_notes.find(
        {"user_id": user["user_id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return {"notes": notes, "total": len(notes)}


@workspace_router.post("/notes")
async def create_note(data: NoteInput, request: Request):
    """Create a note"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    note_id = str(uuid.uuid4())
    doc = {
        "note_id": note_id,
        "user_id": user["user_id"],
        "title": data.title,
        "content": data.content,
        "category": data.category,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    await db.user_notes.insert_one(doc)
    
    return {"message": "Note created", "note_id": note_id}


@workspace_router.put("/notes/{note_id}")
async def update_note(note_id: str, data: NoteUpdateInput, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    update_fields = {"updated_at": datetime.now(timezone.utc).isoformat()}
    if data.title is not None:
        update_fields["title"] = data.title
    if data.content is not None:
        update_fields["content"] = data.content
    if data.category is not None:
        update_fields["category"] = data.category
    
    result = await db.user_notes.update_one(
        {"note_id": note_id, "user_id": user["user_id"]},
        {"$set": update_fields}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Note not found")
    
    return {"message": "Note updated"}


@workspace_router.delete("/notes/{note_id}")
async def delete_note(note_id: str, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    result = await db.user_notes.delete_one({"note_id": note_id, "user_id": user["user_id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"message": "Note deleted"}


@workspace_router.get("/dashboard")
async def get_workspace_dashboard(request: Request):
    """Get workspace overview"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    uid = user["user_id"]
    sim_count = await db.saved_simulations.count_documents({"user_id": uid})
    comp_count = await db.saved_comparisons.count_documents({"user_id": uid})
    note_count = await db.user_notes.count_documents({"user_id": uid})
    
    recent_sims = await db.saved_simulations.find(
        {"user_id": uid}, {"_id": 0}
    ).sort("created_at", -1).limit(5).to_list(5)
    
    return {
        "user": {"name": user.get("name"), "email": user.get("email")},
        "counts": {
            "simulations": sim_count,
            "comparisons": comp_count,
            "notes": note_count
        },
        "recent_simulations": recent_sims
    }
