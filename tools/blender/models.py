"""Modela y exporta la tetera, la lata, la taza y la hoja de té de Maison Brumaire.

Uso: `python3 tools/blender/models.py` (con el módulo bpy) o
`blender --background --python tools/blender/models.py`.
"""

import math
import sys
from pathlib import Path

import bpy  # isort: skip
import bmesh  # bpy debe cargarse antes que bmesh

sys.path.insert(0, str(Path(__file__).resolve().parent))

from common import (
    export_glb,
    lathe,
    link_mesh,
    make_material,
    parent_all,
    reset_scene,
    ring,
    tube,
)

PORCELAIN = (0.94, 0.92, 0.87)
GOLD = (0.80, 0.62, 0.32)
BRASS = (0.62, 0.47, 0.24)
TEA = (0.42, 0.17, 0.04)
LEAF = (0.18, 0.27, 0.12)

TEA_FULL_RADIUS = 0.42
TEA_FULL_HEIGHT = 0.46
LABEL_SEGMENTS = 64
LEAF_LENGTH_STEPS = 16
LEAF_WIDTH_STEPS = 6


def porcelain() -> bpy.types.Material:
    """Porcelana brillante para la tetera y la taza."""
    return make_material("Porcelain", PORCELAIN, roughness=0.16)


def gold() -> bpy.types.Material:
    """Dorado pulido de los filetes."""
    return make_material("Gold", GOLD, roughness=0.22, metallic=1.0)


def build_teapot() -> Path:
    """Tetera redonda con tapa, pico, asa y filetes dorados."""
    reset_scene()
    body_material = porcelain()
    trim_material = gold()
    body = lathe(
        "Body",
        [
            (0.0, 0.0),
            (0.56, 0.0),
            (0.62, 0.03),
            (0.76, 0.16),
            (0.86, 0.36),
            (0.89, 0.52),
            (0.86, 0.70),
            (0.76, 0.88),
            (0.60, 1.01),
            (0.46, 1.07),
            (0.44, 1.08),
        ],
        body_material,
    )
    lid = lathe(
        "Lid",
        [
            (0.45, 1.075),
            (0.43, 1.10),
            (0.37, 1.17),
            (0.24, 1.225),
            (0.09, 1.25),
            (0.0, 1.255),
        ],
        body_material,
    )
    knob = lathe(
        "Knob",
        [
            (0.0, 1.25),
            (0.05, 1.26),
            (0.055, 1.30),
            (0.10, 1.34),
            (0.09, 1.39),
            (0.05, 1.425),
            (0.0, 1.43),
        ],
        trim_material,
    )
    knob.parent = lid
    spout = tube(
        "Spout",
        [
            (0.66, 0.0, 0.34, 1.0),
            (1.02, 0.0, 0.44, 0.78),
            (1.24, 0.0, 0.78, 0.55),
            (1.40, 0.0, 1.02, 0.45),
        ],
        0.14,
        body_material,
    )
    handle = tube(
        "Handle",
        [
            (-0.76, 0.0, 0.94, 1.0),
            (-1.16, 0.0, 0.92, 1.0),
            (-1.22, 0.0, 0.55, 1.0),
            (-0.84, 0.0, 0.28, 1.0),
        ],
        0.055,
        body_material,
    )
    trims = [
        ring("TrimBelly", 0.885, 0.018, 0.52, trim_material),
        ring("TrimBase", 0.60, 0.015, 0.03, trim_material),
        ring("TrimNeck", 0.455, 0.014, 1.075, trim_material),
    ]
    lid_trim = ring("TrimLid", 0.31, 0.012, 1.19, trim_material)
    lid_trim.parent = lid
    parent_all("Teapot", [body, lid, spout, handle, *trims])
    return export_glb("teapot.glb")


def build_label() -> bpy.types.Object:
    """Cilindro abierto con UV rectas, para pintarle la etiqueta desde el código."""
    radius = 0.487
    bottom = 0.16
    top = 0.88
    mesh = bpy.data.meshes.new("Label")
    bm = bmesh.new()
    uv_layer = bm.loops.layers.uv.new("UVMap")
    rows = []
    for height in (bottom, top):
        row = []
        for i in range(LABEL_SEGMENTS + 1):
            angle = math.tau * i / LABEL_SEGMENTS
            row.append(bm.verts.new((radius * math.sin(angle), radius * math.cos(angle), height)))
        rows.append(row)
    for i in range(LABEL_SEGMENTS):
        face = bm.faces.new((rows[0][i], rows[0][i + 1], rows[1][i + 1], rows[1][i]))
        u0 = i / LABEL_SEGMENTS
        u1 = (i + 1) / LABEL_SEGMENTS
        for loop, uv in zip(face.loops, ((u0, 0.0), (u1, 0.0), (u1, 1.0), (u0, 1.0)), strict=True):
            loop[uv_layer].uv = uv
    bm.normal_update()
    bm.to_mesh(mesh)
    bm.free()
    return link_mesh("Label", mesh, make_material("Label", (1.0, 1.0, 1.0), roughness=0.45))


def build_tin() -> Path:
    """Lata de té con tapa separable y etiqueta pintable."""
    reset_scene()
    metal = make_material("TinMetal", BRASS, roughness=0.32, metallic=1.0)
    body = lathe(
        "TinBody",
        [
            (0.0, 0.0),
            (0.45, 0.0),
            (0.48, 0.025),
            (0.48, 0.96),
            (0.465, 0.985),
            (0.0, 0.985),
        ],
        metal,
    )
    lid = lathe(
        "TinLid",
        [
            (0.0, 1.20),
            (0.44, 1.20),
            (0.49, 1.18),
            (0.50, 1.15),
            (0.50, 0.95),
            (0.485, 0.94),
            (0.475, 0.95),
        ],
        metal,
    )
    label = build_label()
    trim_material = gold()
    trims = [
        ring("TinTrimTop", 0.484, 0.008, 0.90, trim_material),
        ring("TinTrimBottom", 0.484, 0.008, 0.14, trim_material),
    ]
    parent_all("Tin", [body, lid, label, *trims])
    return export_glb("tin.glb")


def build_cup() -> Path:
    """Taza con plato y un disco de té que se llena desde el código."""
    reset_scene()
    body_material = porcelain()
    trim_material = gold()
    cup = lathe(
        "Cup",
        [
            (0.0, 0.06),
            (0.17, 0.06),
            (0.19, 0.08),
            (0.30, 0.16),
            (0.40, 0.33),
            (0.45, 0.50),
            (0.46, 0.515),
            (0.445, 0.52),
            (0.43, 0.49),
            (0.385, 0.33),
            (0.29, 0.18),
            (0.0, 0.12),
        ],
        body_material,
    )
    handle = tube(
        "CupHandle",
        [
            (-0.41, 0.0, 0.42, 1.0),
            (-0.62, 0.0, 0.42, 1.0),
            (-0.60, 0.0, 0.22, 1.0),
            (-0.33, 0.0, 0.19, 1.0),
        ],
        0.035,
        body_material,
    )
    saucer = lathe(
        "Saucer",
        [
            (0.0, 0.0),
            (0.42, 0.0),
            (0.62, 0.035),
            (0.72, 0.075),
            (0.715, 0.085),
            (0.6, 0.06),
            (0.3, 0.06),
            (0.0, 0.06),
        ],
        body_material,
    )
    rim = ring("CupRim", 0.455, 0.008, 0.515, trim_material)
    tea_mesh = bpy.data.meshes.new("Tea")
    bm = bmesh.new()
    bmesh.ops.create_circle(bm, cap_ends=True, radius=TEA_FULL_RADIUS, segments=48)
    bmesh.ops.translate(bm, verts=bm.verts, vec=(0.0, 0.0, TEA_FULL_HEIGHT))
    bm.to_mesh(tea_mesh)
    bm.free()
    tea = link_mesh("Tea", tea_mesh, make_material("Tea", TEA, roughness=0.05))
    parent_all("TeaCup", [cup, handle, saucer, rim, tea])
    return export_glb("cup.glb")


def build_leaf() -> Path:
    """Hoja de té curvada, pensada para repetirse con instancias."""
    reset_scene()
    mesh = bpy.data.meshes.new("Leaf")
    bm = bmesh.new()
    grid = []
    for i in range(LEAF_LENGTH_STEPS + 1):
        u = i / LEAF_LENGTH_STEPS
        half_width = 0.22 * math.sin(math.pi * u) ** 0.75
        row = []
        for j in range(LEAF_WIDTH_STEPS + 1):
            v = j / LEAF_WIDTH_STEPS * 2.0 - 1.0
            curl = 0.06 * v * v
            arch = 0.08 * math.sin(math.pi * u)
            row.append(bm.verts.new((v * half_width, u - 0.5, arch + curl)))
        grid.append(row)
    for i in range(LEAF_LENGTH_STEPS):
        for j in range(LEAF_WIDTH_STEPS):
            bm.faces.new((grid[i][j], grid[i][j + 1], grid[i + 1][j + 1], grid[i + 1][j]))
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-4)
    bm.to_mesh(mesh)
    bm.free()
    link_mesh("Leaf", mesh, make_material("Leaf", LEAF, roughness=0.55))
    return export_glb("leaf.glb")


if __name__ == "__main__":
    for builder in (build_teapot, build_tin, build_cup, build_leaf):
        print(f"Exportado: {builder()}")
