"""Open drone-assembled.glb, rotate propeller around a chosen world axis, re-export."""
import bpy
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GLB = ROOT / "public" / "models" / "drone-assembled.glb"

# Which axis to rotate around and how many degrees
ROT_AXIS = 'Z'   # 'X', 'Y', or 'Z'
ROT_DEG  = 90.0

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(GLB))

# Find the propeller mesh
prop = None
for o in bpy.data.objects:
    if o.type != 'MESH':
        continue
    if 'prop' in o.name.lower():
        prop = o
        break
if prop is None:
    meshes = [o for o in bpy.data.objects if o.type == 'MESH']
    prop = min(meshes, key=lambda o: len(o.data.vertices))

print(f"Rotating '{prop.name}' {ROT_DEG}° around world {ROT_AXIS}")
print(f"Before euler (deg): ({math.degrees(prop.rotation_euler.x):.1f}, "
      f"{math.degrees(prop.rotation_euler.y):.1f}, {math.degrees(prop.rotation_euler.z):.1f})")

bpy.ops.object.select_all(action='DESELECT')
prop.select_set(True)
bpy.context.view_layer.objects.active = prop

prop.rotation_mode = 'XYZ'
rad = math.radians(ROT_DEG)
if ROT_AXIS == 'X':
    prop.rotation_euler.x += rad
elif ROT_AXIS == 'Y':
    prop.rotation_euler.y += rad
elif ROT_AXIS == 'Z':
    prop.rotation_euler.z += rad

print(f"After  euler (deg): ({math.degrees(prop.rotation_euler.x):.1f}, "
      f"{math.degrees(prop.rotation_euler.y):.1f}, {math.degrees(prop.rotation_euler.z):.1f})")

bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(
    filepath=str(GLB),
    use_selection=True,
    export_format='GLB',
    export_apply=True,
    export_yup=True,
)
print(f"Wrote {GLB}")
