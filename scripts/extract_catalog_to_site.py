# -*- coding: utf-8 -*-
"""
Извлекает данные продуктов из booklets/catalog/build.py (PRODUCTS),
исключает компоненты (моторы) и пишет двуязычные src/data/products.json
и src/data/categories.json для Astro-сайта.

Также копирует фото и GLB-модели в public/.

Запуск:  python scripts/extract_catalog_to_site.py
"""
import os, sys, json, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG_DIR = os.path.join(ROOT, "booklets", "catalog")
sys.path.insert(0, CATALOG_DIR)

import build  # booklets/catalog/build.py

LANGS = ("en", "uk")

CATEGORIES = [
    {"id": "all",    "slug": "all",    "name": {"en": "All Products",      "uk": "Усі вироби"}},
    {"id": "ground", "slug": "ground", "name": {"en": "Ground Systems",     "uk": "Наземні системи"}},
    {"id": "air",    "slug": "air",    "name": {"en": "Aerial Systems",     "uk": "Літальні системи"}},
    {"id": "sea",    "slug": "sea",    "name": {"en": "Underwater Systems", "uk": "Підводні системи"}},
]


def basename_web(path):
    return "/" + path.split("/")[-1] if path else None


def stats_to_specs(stats):
    """stats: [(num, unit, label)] -> {label: 'num unit'}"""
    out = {}
    for num, unit, label in stats:
        val = f"{num} {unit}".strip()
        out[label] = val
    return out


def conv_badges(badges):
    return [{"text": t, "primary": bool(p)} for (t, p) in badges]


def conv_stats(stats):
    return [{"value": n, "unit": u, "label": l} for (n, u, l) in stats]


def conv_groups(groups):
    return [{"title": title, "rows": [{"k": k, "v": v} for (k, v) in rows]}
            for (title, rows) in groups]


def main():
    products = []
    copied_imgs, copied_models = [], []

    public_products = os.path.join(ROOT, "public", "products")
    public_models = os.path.join(ROOT, "public", "models")
    os.makedirs(public_products, exist_ok=True)
    os.makedirs(public_models, exist_ok=True)

    for p in build.PRODUCTS:
        if p.get("group") == "components":
            continue  # моторы исключаем

        # фото
        img_web = "/products" + basename_web(p["photo"]) if p.get("photo") else "/products/placeholder.svg"
        src_img = os.path.join(CATALOG_DIR, p["photo"]) if p.get("photo") else None
        if src_img and os.path.exists(src_img):
            dst = os.path.join(public_products, os.path.basename(p["photo"]))
            shutil.copy2(src_img, dst)
            copied_imgs.append(os.path.basename(p["photo"]))

        # 3D-модель
        model_web = None
        if p.get("model3d"):
            src_model = os.path.join(CATALOG_DIR, p["model3d"])
            if os.path.exists(src_model):
                dst = os.path.join(public_models, os.path.basename(p["model3d"]))
                shutil.copy2(src_model, dst)
                copied_models.append(os.path.basename(p["model3d"]))
                model_web = "/models/" + os.path.basename(p["model3d"])

        entry = {
            "id": p["slug"],
            "category": p.get("group", ""),
            "image": img_web,
            "images": [img_web],
            "name": {l: p["name"] for l in LANGS},
            "tag": {l: p["i18n"][l]["tag"] for l in LANGS},
            "description": {l: p["i18n"][l]["desc"] for l in LANGS},
            "badges": {l: conv_badges(p["i18n"][l]["badges"]) for l in LANGS},
            "stats": {l: conv_stats(p["i18n"][l]["stats"]) for l in LANGS},
            "specs": {l: stats_to_specs(p["i18n"][l]["stats"]) for l in LANGS},
            "specGroups": {l: conv_groups(p["i18n"][l]["spec_groups"]) for l in LANGS},
            "included": {l: list(p["i18n"][l]["included"]) for l in LANGS},
        }
        if model_web:
            entry["model3d"] = model_web
        products.append(entry)

    data_dir = os.path.join(ROOT, "src", "data")
    with open(os.path.join(data_dir, "products.json"), "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
    with open(os.path.join(data_dir, "categories.json"), "w", encoding="utf-8") as f:
        json.dump(CATEGORIES, f, ensure_ascii=False, indent=2)

    print(f"products: {len(products)}")
    print(f"images copied: {copied_imgs}")
    print(f"models copied: {copied_models}")


if __name__ == "__main__":
    main()
