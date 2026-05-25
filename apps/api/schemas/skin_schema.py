# apps/api/schemas/skin_schema.py
# ============================================================
# Modèles Pydantic du skin — dérivés de packages/schemas/skin.schema.json
# Utilisés pour valider les requêtes PATCH /api/studio/:slug/skin
# ============================================================

from pydantic import BaseModel, Field
from typing import Optional, Literal
from enum import Enum


class ThemeTokens(BaseModel):
    bg:       str = Field(alias="--bg")
    surface:  str = Field(alias="--surface")
    surface2: str = Field(alias="--surface2")
    accent:   str = Field(alias="--accent")
    accent2:  str = Field(alias="--accent2")
    accent3:  str = Field(alias="--accent3")
    text:     str = Field(alias="--text")
    muted:    str = Field(alias="--muted")
    border:   str = Field(alias="--border")
    glow:     str = Field(alias="--glow")

    model_config = {"populate_by_name": True}


class Theme(BaseModel):
    light: ThemeTokens
    dark:  ThemeTokens


class Typography(BaseModel):
    font_mono:    str = Field(alias="--font-mono",    default="'DM Mono', monospace")
    font_heading: str = Field(alias="--font-heading", default="'Fraunces', serif")
    font_body:    Optional[str] = Field(alias="--font-body", default=None)

    model_config = {"populate_by_name": True}


class Layout(BaseModel):
    heroReversed:        bool = False
    skillsColumns:       int  = Field(default=4, ge=1, le=6)
    border_radius_base:  str  = Field(alias="--border-radius-base",  default="4px")
    border_radius_large: str  = Field(alias="--border-radius-large", default="50%")
    hero_gap:            str  = Field(alias="--hero-gap",            default="0px")

    model_config = {"populate_by_name": True}


class DecryptedText(BaseModel):
    short:  int = 400
    medium: int = 600
    long:   int = 900
    xlong:  int = 1200


class Stagger(BaseModel):
    skillsDelay:     int = 150
    experienceDelay: int = 100


class Animations(BaseModel):
    parallaxFactor: float = Field(default=0.3, ge=0.0, le=1.0)
    stagger:        Stagger       = Stagger()
    decryptedText:  DecryptedText = DecryptedText()


class Effects(BaseModel):
    noise_opacity: str = Field(alias="--noise-opacity", default="0.05")
    grid_opacity:  str = Field(alias="--grid-opacity",  default="0.6")

    model_config = {"populate_by_name": True}


class CursorType(str, Enum):
    default = "default"
    custom  = "custom"
    none    = "none"


class Cursor(BaseModel):
    type: CursorType = CursorType.default


class Assets(BaseModel):
    heroPhoto: Optional[str] = None
    favicon:   Optional[str] = None
    cvPdf:     Optional[str] = None


class Addons(BaseModel):
    customCursor:  bool = False
    bootSequence:  bool = False
    noiseOverlay:  bool = True
    networkCanvas: bool = False


class ArchitectureBlock(BaseModel):
    id:        str
    component: str
    visible:   bool = True
    props:     dict = {}


class SkinSchema(BaseModel):
    """Modèle complet d'un skin. Utilisé pour valider les PATCH /api/studio/:slug/skin."""
    theme:        Theme
    typography:   Typography           = Typography()
    layout:       Layout               = Layout()
    animations:   Animations           = Animations()
    effects:      Effects              = Effects()
    cursor:       Cursor               = Cursor()
    assets:       Assets               = Assets()
    addons:       Addons               = Addons()
    architecture: list[ArchitectureBlock] = []


class SkinPatchSchema(BaseModel):
    """Modèle pour les mises à jour partielles (PATCH). Toutes les clés optionnelles."""
    theme:        Optional[Theme]               = None
    typography:   Optional[Typography]          = None
    layout:       Optional[Layout]              = None
    animations:   Optional[Animations]          = None
    effects:      Optional[Effects]             = None
    cursor:       Optional[Cursor]              = None
    assets:       Optional[Assets]              = None
    addons:       Optional[Addons]              = None
    architecture: Optional[list[ArchitectureBlock]] = None
