# -*- coding: utf-8 -*-
"""
Склеивает по-продуктовые print-PDF из booklets/catalog/pdf/ в единый
каталог на каждый язык: public/catalog.en.pdf и public/catalog.uk.pdf.

Порядок продуктов и список берём из booklets/catalog/build.py (PRODUCTS),
исключая группу components (моторы) — как на сайте.

Запуск:  python scripts/make_catalog_pdf.py
"""
import os, sys
from pypdf import PdfWriter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG_DIR = os.path.join(ROOT, "booklets", "catalog")
PDF_DIR = os.path.join(CATALOG_DIR, "pdf")
PUBLIC = os.path.join(ROOT, "public")
sys.path.insert(0, CATALOG_DIR)

import build  # PRODUCTS

LANGS = ("en", "uk")


def main():
    slugs = [p["slug"] for p in build.PRODUCTS if p.get("group") != "components"]
    for lang in LANGS:
        writer = PdfWriter()
        used = []
        for slug in slugs:
            src = os.path.join(PDF_DIR, f"{slug}.{lang}.pdf")
            if not os.path.exists(src):
                print(f"  ! пропущено (нет файла): {os.path.basename(src)}")
                continue
            writer.append(src)
            used.append(slug)
        out = os.path.join(PUBLIC, f"catalog.{lang}.pdf")
        with open(out, "wb") as f:
            writer.write(f)
        writer.close()
        print(f"catalog.{lang}.pdf: {len(used)} страниц -> {used}")


if __name__ == "__main__":
    main()
