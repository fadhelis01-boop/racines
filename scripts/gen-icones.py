# Icônes illustrées (aquarelle, fond blanc, sans texte) qui remplacent les pictogrammes.
# Lancer avec le Python de ComfyUI, ComfyUI démarré :
#   C:\IA\ComfyUI_windows_portable\python_embeded\python.exe scripts\gen-icones.py
import json, os, sys, time, urllib.request
from PIL import Image, ImageOps

API = "http://127.0.0.1:8188"
OUT_COMFY = r"C:\IA\ComfyUI_windows_portable\ComfyUI\output"
HERE = os.path.dirname(os.path.abspath(__file__))
DEST = os.path.join(HERE, "..", "public", "ico")
os.makedirs(DEST, exist_ok=True)

STYLE = "masterpiece, best quality, simple watercolor botanical illustration, single object, centered, isolated on plain white background, vivid saturated colors, bold clean outline, icon, no humans, "
NEG = "text, letters, words, watermark, signature, logo, frame, border, multiple objects, busy background, scenery, lowres, blurry, worst quality, photo, 3d, dark background, humans, hands"

ICONES = {
    # navigation
    "aujourdhui": "small cottage house with a garden and a sunrise",
    "calendrier": "spiral-bound paper desk calendar showing a grid of small squares, red ring binding",
    "plantes": "young seedling sprout with two green leaves in soil",
    "sante": "green leaf with a small red cross bandage",
    "jardin": "wicker basket full of fresh vegetables",
    "mesplantes": "monstera houseplant in a terracotta pot",
    "creer": "metal garden spade stuck in brown soil next to a paper seed packet",
    "tutoriels": "open garden book with pressed leaves",
    "animaux": "brown hen chicken standing",
    "identifier": "magnifying glass over a green leaf",
    "associations": "tomato plant and basil plant side by side",
    "reglages": "garden watering can and small gear",
    "lexique": "old botanical dictionary book with a fern",
    "recherche": "magnifying glass",
    "plus": "three garden tools: trowel, fork and rake",
    "diagnostic": "stethoscope around a potted plant",
    "photo": "vintage camera with a flower",
    "potager-interieur": "kitchen windowsill pots with herbs and cherry tomatoes",
    # catégories
    "legume": "carrot, tomato and lettuce together",
    "aromatique": "bunch of fresh herbs, basil, thyme and parsley",
    "fruit": "strawberries and raspberries",
    "arbre": "small apple tree with red apples",
    "fleur": "bouquet of colorful garden flowers",
    "engrais-vert": "purple phacelia flower and clover",
    "interieur": "potted houseplant pothos with trailing leaves",
    "ornement": "red rose flower with leaves",
    "sauvage": "dandelion flower and seed head",
    "toxique": "foxglove purple flower spike with a warning red border circle",
    # rubriques
    "demarrer": "wooden raised garden bed with young plants",
    "sol": "cross-section of rich brown soil with an earthworm",
    "compost": "wooden compost bin with vegetable peels",
    "arrosage": "green metal watering can with water drops",
    "semis": "seedling tray with sprouts",
    "serre": "small glass greenhouse",
    "balcon": "balcony railing with flower pots",
    "fabriquer": "hammer, saw and wooden planks",
    "recolte": "harvest basket with apples and pumpkins",
    "boucherie": "kitchen knife and wooden cutting board",
    "securite": "gardening gloves and a first aid box",
    # actions du calendrier
    "semisAbri": "seed tray under a small plastic dome",
    "semisPlace": "hand sowing seeds into a soil furrow, only seeds and soil",
    "plantation": "young plant seedling with root ball being planted",
    "recolte-action": "freshly harvested vegetables in a crate",
    "taille": "pruning shears with a small branch",
    "floraison": "pink cosmos flowers",
    # types de problèmes
    "champignon": "single green leaf covered with white powdery mildew patches and brown spots",
    "bacterie": "potato with scab spots",
    "virus": "mottled mosaic yellow green leaf",
    "ravageur": "red ladybug beetle eating small green aphids on a green stem, macro",
    "physiologique": "wilted drooping plant in a pot",
    "carence": "single yellow leaf with bright green veins",
    "mammifere": "small field vole mouse",
    # profils
    "maison-jardin": "country house with vegetable garden and fruit trees",
    "petit-jardin": "small courtyard garden with raised beds",
    "appartement": "apartment window with houseplants on the sill",
    "meteo": "sun partly behind a rain cloud",
    "lune": "crescent moon with stars",
    "taches": "wooden clipboard with a paper checklist with check marks and a pencil",
    "fumier": "wheelbarrow of manure and straw",
    "abeille": "one cute honey bee insect with yellow and black striped body and transparent wings, close-up",
}

def gen(nom, sujet, seed):
    g = {
        "1": {"class_type": "CheckpointLoaderSimple", "inputs": {"ckpt_name": "animagine-xl-4.0.safetensors"}},
        "2": {"class_type": "CLIPTextEncode", "inputs": {"text": STYLE + sujet, "clip": ["1", 1]}},
        "3": {"class_type": "CLIPTextEncode", "inputs": {"text": NEG, "clip": ["1", 1]}},
        "4": {"class_type": "EmptyLatentImage", "inputs": {"width": 832, "height": 832, "batch_size": 1}},
        "5": {"class_type": "KSampler", "inputs": {"model": ["1", 0], "positive": ["2", 0], "negative": ["3", 0], "latent_image": ["4", 0], "seed": seed, "steps": 22, "cfg": 5.0, "sampler_name": "euler_ancestral", "scheduler": "normal", "denoise": 1.0}},
        "6": {"class_type": "VAEDecode", "inputs": {"samples": ["5", 0], "vae": ["1", 2]}},
        "7": {"class_type": "SaveImage", "inputs": {"filename_prefix": f"racines_ico/{nom}", "images": ["6", 0]}},
    }
    req = urllib.request.Request(API + "/prompt", data=json.dumps({"prompt": g}).encode(), headers={"Content-Type": "application/json"})
    pid = json.load(urllib.request.urlopen(req))["prompt_id"]
    while True:
        time.sleep(1.5)
        h = json.load(urllib.request.urlopen(f"{API}/history/{pid}"))
        if pid in h:
            im = h[pid]["outputs"]["7"]["images"][0]
            return os.path.join(OUT_COMFY, im["subfolder"], im["filename"])

def detoure(path, dest):
    # Recadre sur le sujet (fond blanc) puis carré 192 px, fond transparent approximatif
    im = Image.open(path).convert("RGB")
    gris = ImageOps.invert(im.convert("L")).point(lambda v: 255 if v > 18 else 0)
    box = gris.getbbox() or (0, 0, im.width, im.height)
    im = im.crop(box)
    c = max(im.width, im.height)
    carre = Image.new("RGB", (c, c), (255, 255, 255))
    carre.paste(im, ((c - im.width) // 2, (c - im.height) // 2))
    carre = carre.resize((192, 192), Image.LANCZOS).convert("RGBA")
    px = carre.load()
    for y in range(192):
        for x in range(192):
            r, g, b, a = px[x, y]
            if r > 242 and g > 242 and b > 242:
                px[x, y] = (255, 255, 255, 0)
    carre.save(dest, "WEBP", quality=85)

only = set(sys.argv[1:])
for i, (nom, sujet) in enumerate(ICONES.items()):
    dest = os.path.join(DEST, nom + ".webp")
    if (os.path.exists(dest) and not only) or (only and nom not in only):
        continue
    t = time.time()
    detoure(gen(nom, sujet, 7000 + i * 13 if only else 5000 + i * 11), dest)
    print(f"{nom} ({time.time() - t:.0f} s)", flush=True)

noms = sorted(f[:-5] for f in os.listdir(DEST) if f.endswith(".webp"))
with open(os.path.join(HERE, "..", "src", "data", "local-icones.json"), "w", encoding="utf-8") as f:
    json.dump(noms, f)
print(f"{len(noms)} icônes dans public/ico")
