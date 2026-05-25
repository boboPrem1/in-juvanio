# apps/api/schemas/data_schema.py
# ============================================================
# Modèles Pydantic des données de contenu — dérivés de packages/schemas/data.schema.json
# Utilisés pour valider les réponses GET /api/v1/portfolio/:slug
# ============================================================

from pydantic import BaseModel, EmailStr
from typing import Optional, Literal


# ── Meta ───────────────────────────────────────────────────

class Contact(BaseModel):
    email:           EmailStr
    phone:           Optional[str] = None
    linkedin:        Optional[str] = None
    linkedin_handle: Optional[str] = None
    github:          Optional[str] = None
    github_handle:   Optional[str] = None
    pypi:            Optional[str] = None
    pypi_handle:     Optional[str] = None
    cv:              Optional[str] = None


class Meta(BaseModel):
    name:      str
    available: bool
    contact:   Contact


# ── Experience ─────────────────────────────────────────────

class JobChange(BaseModel):
    type:   Literal["add", "mod", "del"]
    symbol: Literal["+", "M", "-"]
    text:   str


class Job(BaseModel):
    hash:          str
    date:          str
    company:       str
    isRoleSplit:   bool
    role:          str
    desc:          str
    changes:       list[JobChange]
    rolePrefix:    Optional[str] = None
    roleHighlight: Optional[str] = None
    roleSuffix:    Optional[str] = None
    badge:         Optional[Literal["LEAD", "CTO", "FREELANCE", "INTERN"]] = None


# ── Skills ─────────────────────────────────────────────────

class SkillItem(BaseModel):
    name:  str
    level: str
    width: str  # ex: "85%"


class SkillRack(BaseModel):
    rackId: Optional[str] = None
    icon:   Optional[str] = None
    leds:   Optional[list[Literal["green", "yellow", "red", "off"]]] = None
    title:  str
    tags:   Optional[list[str]]      = None
    items:  Optional[list[SkillItem]] = None


# ── Sections I18n (structure libre par langue) ──────────────

class I18nSection(BaseModel):
    """Section générique multi-langue. Chaque langue est un dict libre."""
    model_config = {"extra": "allow"}


# ── Data root ──────────────────────────────────────────────

class PortfolioDataSchema(BaseModel):
    """
    Modèle complet des données de contenu d'un portfolio.
    Utilisé pour valider et sérialiser les réponses GET /api/v1/portfolio/:slug.
    """
    meta:       Meta
    navbar:     dict  # I18n libre
    footer:     dict  # I18n libre
    hero:       dict  # I18n libre
    tenxyte:    Optional[dict] = None  # I18n libre
    skills:     dict  # I18n avec structure SkillRack
    experience: dict  # I18n avec liste de Job
    formation:  dict  # I18n libre
    contact:    dict  # I18n libre

    model_config = {"extra": "forbid"}
