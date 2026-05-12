from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from auth import get_current_user
import models, schemas

router = APIRouter()


def tags_to_str(tags: List[str]) -> str:
    return ",".join(tags)


def resource_to_schema(resource: models.Resource) -> schemas.ResourceOut:
    return schemas.ResourceOut(
        id=resource.id,
        title=resource.title,
        url=resource.url,
        description=resource.description,
        tags=[t for t in resource.tags.split(",") if t] if resource.tags else [],
        created_at=resource.created_at,
        updated_at=resource.updated_at,
        owner_id=resource.owner_id,
    )


@router.post("/", response_model=schemas.ResourceOut, status_code=status.HTTP_201_CREATED)
def create_resource(
    resource_data: schemas.ResourceCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    resource = models.Resource(
        title=resource_data.title,
        url=resource_data.url,
        description=resource_data.description,
        tags=tags_to_str(resource_data.tags),
        owner_id=current_user.id,
    )
    db.add(resource)
    db.commit()
    db.refresh(resource)
    return resource_to_schema(resource)


@router.get("/", response_model=List[schemas.ResourceOut])
def get_resources(
    search: Optional[str] = Query(None, description="Search by title"),
    tags: Optional[str] = Query(None, description="Filter by tags (comma-separated)"),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    query = db.query(models.Resource).filter(models.Resource.owner_id == current_user.id)

    if search:
        query = query.filter(models.Resource.title.ilike(f"%{search}%"))

    if tags:
        tag_list = [t.strip().lower() for t in tags.split(",") if t.strip()]
        for tag in tag_list:
            query = query.filter(models.Resource.tags.ilike(f"%{tag}%"))

    resources = query.order_by(models.Resource.created_at.desc()).all()
    return [resource_to_schema(r) for r in resources]


@router.get("/{resource_id}", response_model=schemas.ResourceOut)
def get_resource(
    resource_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    resource = db.query(models.Resource).filter(
        models.Resource.id == resource_id,
        models.Resource.owner_id == current_user.id,
    ).first()
    if not resource:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")
    return resource_to_schema(resource)


@router.put("/{resource_id}", response_model=schemas.ResourceOut)
def update_resource(
    resource_id: int,
    resource_data: schemas.ResourceUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    resource = db.query(models.Resource).filter(
        models.Resource.id == resource_id,
        models.Resource.owner_id == current_user.id,
    ).first()
    if not resource:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")

    if resource_data.title is not None:
        resource.title = resource_data.title
    if resource_data.url is not None:
        resource.url = resource_data.url
    if resource_data.description is not None:
        resource.description = resource_data.description
    if resource_data.tags is not None:
        resource.tags = tags_to_str(resource_data.tags)

    db.commit()
    db.refresh(resource)
    return resource_to_schema(resource)


@router.delete("/{resource_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resource(
    resource_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    resource = db.query(models.Resource).filter(
        models.Resource.id == resource_id,
        models.Resource.owner_id == current_user.id,
    ).first()
    if not resource:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")

    db.delete(resource)
    db.commit()
