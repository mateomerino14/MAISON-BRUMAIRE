"""Utilidades compartidas por los scripts que modelan las piezas de Maison Brumaire."""

import math
from pathlib import Path

import bpy  # isort: skip
import bmesh  # bpy debe cargarse antes que bmesh

MODELS_DIR = Path(__file__).resolve().parents[2] / "public" / "models"
LATHE_STEPS = 72
MERGE_DISTANCE = 1e-4
FULL_TURN = math.tau


def reset_scene() -> None:
    """Deja la escena vacía, sin objetos, mallas, curvas ni materiales."""
    bpy.ops.wm.read_factory_settings(use_empty=True)


def make_material(
    name: str,
    color: tuple[float, float, float],
    roughness: float,
    metallic: float = 0.0,
) -> bpy.types.Material:
    """Crea un material PBR que el exportador de glTF entiende."""
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    shader = material.node_tree.nodes["Principled BSDF"]
    shader.inputs["Base Color"].default_value = (*color, 1.0)
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Metallic"].default_value = metallic
    return material


def link_mesh(name: str, mesh: bpy.types.Mesh, material: bpy.types.Material) -> bpy.types.Object:
    """Agrega una malla a la escena con su material y sombreado suave."""
    mesh.materials.append(material)
    for polygon in mesh.polygons:
        polygon.use_smooth = True
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(obj)
    return obj


def lathe(name: str, profile: list[tuple[float, float]], material: bpy.types.Material) -> bpy.types.Object:
    """Gira un perfil (radio, altura) alrededor del eje Z para formar una pieza de revolución."""
    bm = bmesh.new()
    verts = [bm.verts.new((radius, 0.0, height)) for radius, height in profile]
    edges = [bm.edges.new((verts[i], verts[i + 1])) for i in range(len(verts) - 1)]
    bmesh.ops.spin(
        bm,
        geom=verts + edges,
        cent=(0.0, 0.0, 0.0),
        axis=(0.0, 0.0, 1.0),
        angle=FULL_TURN,
        steps=LATHE_STEPS,
        use_merge=True,
    )
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=MERGE_DISTANCE)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    return link_mesh(name, mesh, material)


def tube(
    name: str,
    points: list[tuple[float, float, float, float]],
    thickness: float,
    material: bpy.types.Material,
) -> bpy.types.Object:
    """Barre un círculo por una curva suave; el cuarto valor de cada punto escala el grosor."""
    curve = bpy.data.curves.new(f"{name}Curve", type="CURVE")
    curve.dimensions = "3D"
    curve.bevel_depth = thickness
    curve.bevel_resolution = 8
    curve.use_fill_caps = True
    spline = curve.splines.new("BEZIER")
    spline.bezier_points.add(len(points) - 1)
    for bezier_point, (x, y, z, scale) in zip(spline.bezier_points, points, strict=True):
        bezier_point.co = (x, y, z)
        bezier_point.handle_left_type = "AUTO"
        bezier_point.handle_right_type = "AUTO"
        bezier_point.radius = scale
    curve_obj = bpy.data.objects.new(f"{name}Path", curve)
    bpy.context.scene.collection.objects.link(curve_obj)
    depsgraph = bpy.context.evaluated_depsgraph_get()
    mesh = bpy.data.meshes.new_from_object(curve_obj.evaluated_get(depsgraph))
    bpy.data.objects.remove(curve_obj)
    return link_mesh(name, mesh, material)


def ring(
    name: str,
    radius: float,
    thickness: float,
    height: float,
    material: bpy.types.Material,
) -> bpy.types.Object:
    """Crea un aro fino, útil para los filetes dorados."""
    profile = [
        (radius, height - thickness),
        (radius + thickness, height),
        (radius, height + thickness),
        (radius - thickness, height),
        (radius, height - thickness),
    ]
    return lathe(name, profile, material)


def parent_all(root_name: str, children: list[bpy.types.Object]) -> bpy.types.Object:
    """Agrupa varias piezas bajo un objeto vacío para exportarlas juntas."""
    root = bpy.data.objects.new(root_name, None)
    bpy.context.scene.collection.objects.link(root)
    for child in children:
        child.parent = root
    return root


def export_glb(file_name: str) -> Path:
    """Exporta toda la escena como .glb a public/models."""
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    target = MODELS_DIR / file_name
    bpy.ops.export_scene.gltf(
        filepath=str(target),
        export_format="GLB",
        export_yup=True,
        export_apply=True,
    )
    return target
