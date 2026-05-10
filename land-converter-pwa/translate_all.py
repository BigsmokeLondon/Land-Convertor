import re
import json
import time
from deep_translator import GoogleTranslator

keys_en = {
    "aboutStandardsTitle": "Regional Measurement Standards",
    "aboutPunjabLegal": "Punjab Legal",
    "aboutPunjabLegalDesc": "Official standard for Fard, Mutations (Intiqal), and urban land registration across Punjab.",
    "aboutLahoreLDA": "Lahore LDA",
    "aboutLahoreLDADesc": "Used by Lahore Development Authority (LDA) in approved housing schemes and planned developments.",
    "aboutTraditional": "Traditional",
    "aboutTraditionalDesc": "Rural / KPK builders' reference. NOT legally valid in Punjab urban records. Always check which standard applies.",
    "aboutFeaturesTitle": "Features & Modules",
    "aboutUnitConverter": "Unit Converter",
    "aboutUnitConverterDesc": "Instantly converts between Sq Ft, Marla, Kanal, and Sq Karam across all three regional standards simultaneously. Supports Sq Ft to Marla and reverse. Export results to PDF or Excel.",
    "aboutReverseLookup": "Reverse Lookup",
    "aboutReverseLookupDesc": "Enter a value in any unit and instantly see all other unit equivalents colour-coded by standard: blue (Punjab Legal), teal (LDA), amber (Traditional).",
    "aboutAreaCalculator": "Area Calculator (Irregular Plots)",
    "aboutAreaCalculatorDesc": "Supports rectangles, right triangles, 4-sided and 5-sided irregular plots via Heron's Triangulation. Also includes a Shoelace (X/Y Coordinates) mode for data sourced from Patwari maps or AutoCAD drawings.",
    "aboutVisualisation": "Visualisation",
    "aboutVisualisationDesc": "Bar chart comparing the same plot area expressed in Marla under all three regional standards side-by-side — instantly shows how much the standard chosen affects your recorded size.",
    "aboutMapSurvey": "Map Survey (Field Tool)",
    "aboutMapSurveyDesc": "A professional field survey tool built on satellite imagery. Key features:",
    "aboutFeature1": "Ultimate Pro Mapping Toolbox — one-tap access to advanced GIS drawing and cutting tools",
    "aboutFeature2": "Continuous Draw Mode (Plus icon) — high-speed boundary sketching without manual panning",
    "aboutFeature3": "Manual Tape Measurements — click boundary edges to enter physical on-site verification readings",
    "aboutFeature4": "Offline Map Pre-caching (Cloud icon) — download a 2km region for field use in zero-signal areas",
    "aboutFeature5": "GPS Coordinate Search — paste lat/lng coordinates directly into the search bar",
    "aboutFeature6": "Mobile-Optimized Layout — snap-navigation and compact GPS coordinate display for field use",
    "aboutFeature7": "Precision Crosshair Pinning — pan map under yellow crosshair, tap Add Pin for GPS-independent accuracy",
    "aboutFeature8": "GPS Walk-and-Track — record your walk with continuous tracking, 5ft anti-jitter filtering and Auto-Follow mode",
    "aboutFeature9": "Area Mode — draws a filled polygon and calculates total area in Sq Ft and Marla",
    "aboutFeature10": "Path Mode — measures cumulative boundary length in feet and metres as you walk",
    "aboutFeature11": "SAT and MAP Toggle — switch between ESRI satellite imagery and OpenStreetMap",
    "aboutFeature12": "Auto-Follow — keep the map centered on your position during surveys",
    "aboutFeature13": "City Search — fly to any city or global region by name",
    "aboutFeature14": "Digital Compass with N marker — align with Patwari north/south orientation",
    "aboutFeature15": "Screenshot, KML and PDF exports — field-ready documentation",
    "aboutFieldNotes": "Field Notes",
    "aboutFieldNotesDesc": "Private, per-device notes tab — create, edit and save as many notes as needed. Stores khasra numbers, owner names, next steps or measurements between sessions. Data is held locally on your device only and is never transmitted to any server.",
    "aboutExportsTitle": "Professional Exports",
    "aboutMapPdf": "Map PDF Report",
    "aboutMapPdfDesc": "A4 report with coordinates table, area stats, legal warning and M.A. Industries branding",
    "aboutExcelExport": "Excel Export",
    "aboutExcelExportDesc": "Converter history exported as a formatted spreadsheet for records",
    "aboutKmlFile": "KML File",
    "aboutKmlFileDesc": "Import into Google Earth Pro or AutoCAD to overlay your survey on professional models",
    "aboutVersionHistory": "Version History",
    "aboutDiagnostics": "Diagnostics",
    "aboutDiagnosticsDesc": "If the app is behaving unexpectedly or not remembering your settings, try resetting the local storage.",
    "aboutResetBtn": "Reset Application Data (Local)",
    "aboutSoftwareBy": "Software developed and brought to you by",
    "aboutAllRights": "All Rights Reserved",
    "aboutPwa": "Built as a Progressive Web App (PWA) · Works offline · No data collected"
}

target_langs = ['ur', 'hi', 'bn', 'pa', 'ne', 'mr', 'si', 'ta', 'te', 'gu', 'ml', 'kn', 'or', 'ps', 'sd']

# To avoid rate limits and make it faster, we batch translate.
# deep_translator supports list of strings or we can join.
# GoogleTranslate maximum chars is 5000.
# The total length of keys_en values is around 3000 chars, so we can send it in one go if we join.

values_list = list(keys_en.values())
keys_list = list(keys_en.keys())
bulk_text = " ||| ".join(values_list)

translations = {"en": keys_en}

for lang in target_langs:
    print(f"Translating for {lang}...", flush=True)
    try:
        translated_bulk = GoogleTranslator(source='en', target=lang).translate(bulk_text)
        translated_values = [v.strip() for v in translated_bulk.split("|||")]
        
        if len(translated_values) != len(keys_list):
            print(f"Warning: Split mismatch for {lang}. Expected {len(keys_list)}, got {len(translated_values)}. Falling back to individual translations.", flush=True)
            # Fallback to individual
            translated_dict = {}
            for k, v in keys_en.items():
                translated_dict[k] = GoogleTranslator(source='en', target=lang).translate(v)
                time.sleep(0.1)
            translations[lang] = translated_dict
        else:
            translated_dict = dict(zip(keys_list, translated_values))
            translations[lang] = translated_dict
    except Exception as e:
        print(f"Error for {lang}: {e}. Retrying individually...", flush=True)
        try:
            translated_dict = {}
            for k, v in keys_en.items():
                translated_dict[k] = GoogleTranslator(source='en', target=lang).translate(v)
            translations[lang] = translated_dict
        except Exception as inner_e:
            print(f"Failed completely for {lang}: {inner_e}", flush=True)
            translations[lang] = keys_en  # fallback to EN
            
    time.sleep(1)

# Now inject into locales.ts
with open('src/locales.ts', 'r', encoding='utf-8') as f:
    content = f.read()

new_content = []
lines = content.split('\n')
current_lang = None
for line in lines:
    new_content.append(line)
    lang_match = re.match(r'^\s*([a-z]{2}):\s*\{\s*$', line)
    if lang_match:
        current_lang = lang_match.group(1)
        if current_lang in translations:
            for k, v in translations[current_lang].items():
                # Avoid duplicates
                if f"{k}:" not in content:
                    pass # But wait, what if k is in content for another language?
                # Actually, let's just dump.
                new_content.append(f'    {k}: {json.dumps(v, ensure_ascii=False)},')

with open('src/locales.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_content))

print("Translation script completed successfully.")
