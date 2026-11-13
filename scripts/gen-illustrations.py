# Génère les illustrations des tutoriels avec ComfyUI local (Animagine XL 4.0),
# puis les convertit en WebP 800 px dans public/img/<id>.webp.
# Prérequis : ComfyUI lancé (http://127.0.0.1:8188). Lancer avec le Python de ComfyUI :
#   C:\IA\ComfyUI_windows_portable\python_embeded\python.exe scripts\gen-illustrations.py
# Aucune image ne contient de texte (les légendes sont dans l'application).
import json, os, sys, time, urllib.request
from PIL import Image

API = "http://127.0.0.1:8188"
OUT_COMFY = r"C:\IA\ComfyUI_windows_portable\ComfyUI\output"
HERE = os.path.dirname(os.path.abspath(__file__))
DEST = os.path.join(HERE, "..", "public", "img")
os.makedirs(DEST, exist_ok=True)

STYLE = "masterpiece, best quality, very aesthetic, watercolor illustration, storybook style, soft natural light, warm colors, detailed background, "
NEG = ("text, letters, words, caption, watermark, signature, logo, username, lowres, worst quality, low quality, blurry, bad anatomy, "
       "bad hands, extra fingers, deformed, nsfw, blood, gore, dark, horror, 3d, photo, realistic")

SCENES = {
    "creer-potager": "no humans, sunny vegetable garden with raised beds, wooden paths, watering can, tomatoes, lettuce, rows of seedlings, garden fence, countryside house",
    "methodes-culture": "no humans, square wooden raised bed garden, lasagna garden layers of straw and leaves, mound bed, vegetables, top-down view",
    "rotation": "no humans, four vegetable garden plots seen from above, potatoes, carrots, beans, onions, organized garden, sunny",
    "associations": "no humans, tomato plants with basil and marigold flowers, nasturtium, companion planting, garden bed, bees",
    "potager-balcon": "no humans, apartment balcony garden, terracotta pots, cherry tomatoes, herbs, strawberries in planters, city rooftops background",
    "connaitre-sol": "no humans, glass jar with layers of soil and water on a garden table, trowel, handful of earth, earthworms, garden background",
    "paillage": "no humans, vegetable bed covered with straw mulch, young plants, garden fork, morning light",
    "engrais-naturels": "no humans, garden compost heap, bucket of nettles, wooden barrel, manure wheelbarrow, vegetable garden",
    "engrais-verts": "no humans, field of purple phacelia flowers and green clover cover crop in a vegetable garden, bees",
    "compost-tas": "no humans, wooden compost bin full of vegetable peelings and autumn leaves, garden fork, kitchen scraps bucket",
    "bac-palettes": "no humans, compost bin built from wooden pallets in a garden corner, tools, hammer",
    "lombricompost": "no humans, worm composting bin with stacked trays on a kitchen balcony, earthworms in dark compost, vegetable peels",
    "bokashi": "no humans, kitchen with bokashi bucket, chopped vegetable scraps, bran, modern apartment kitchen",
    "arrosage-bien-arroser": "no humans, metal watering can pouring water at the base of tomato plants, morning dew, vegetable garden",
    "oyas": "no humans, unglazed terracotta clay pot buried in soil among vegetables, watering, garden bed",
    "arrosage-vacances": "no humans, upside down plastic bottles watering potted plants, cotton wicks in water basin, sunny balcony",
    "recuperateur-pluie": "no humans, rain water barrel connected to house gutter, rain drops, garden, green wooden tank",
    "semis-interieur": "no humans, seedling trays on a sunny windowsill, small sprouts in pots, grow light, labels",
    "semis-place": "no humans, garden rake, string line, seed furrow in fine soil, seed packets, vegetable garden in spring",
    "graines-maison": "no humans, seeds drying on plates, paper envelopes, glass jars of beans and seeds, rustic wooden table",
    "bouturage": "no humans, plant cuttings rooting in glass jars of water, small pots, pruning shears, windowsill",
    "taille-fruitiers": "no humans, apple tree in winter orchard, pruning shears and saw on a branch, cut branches on the ground",
    "greffe": "no humans, close-up of grafted fruit tree branch with raffia binding, grafting knife, orchard in spring",
    "serre": "no humans, inside a greenhouse full of tomato plants and seedlings, open door, sunlight, watering can",
    "chassis": "no humans, small cold frame made of old window over lettuce seedlings in a garden, early spring",
    "plantes-interieur-bases": "no humans, bright living room full of houseplants, monstera, pothos, snake plant, sunlight through window",
    "rempoter": "no humans, repotting a houseplant on a table, soil, terracotta pots, trowel, roots",
    "herbes-interieur": "no humans, kitchen windowsill with herb pots, basil, parsley, chives, microgreens tray",
    "hotel-insectes": "no humans, wooden insect hotel with bamboo tubes, ladybugs, bees, flowers, garden pond, bird nest box",
    "carre-potager-diy": "no humans, building a wooden raised garden bed, planks, drill, screws, soil, garden",
    "conserver-recoltes": "no humans, root cellar with wooden crates of potatoes, apples, onions braids, pumpkins, carrots in sand",
    "bocaux": "no humans, glass canning jars of tomato sauce and green beans on a kitchen table, large pot, rubber seals",
    "lactofermentation": "no humans, jars of sauerkraut and pickled vegetables, cabbage, carrots, salt, rustic kitchen",
    "securite-jardin": "no humans, gardening gloves, boots, hat, first aid kit, garden tools neatly arranged, sunny garden",
    "plantes-toxiques": "no humans, botanical illustration of foxglove, yew branch with red berries, oleander flowers, warning",
    "voisinage-regles": "no humans, garden hedge between two houses, fence, trees, countryside village",
    "poulailler": "no humans, wooden chicken coop with nest boxes and ramp, hens in a fenced grassy run, apple trees",
    "couvaison": "no humans, brooding hen in straw nest with fluffy yellow chicks, eggs, cozy barn",
    "integrer-animaux": "no humans, two groups of hens separated by a wire fence in a grassy run, chicken coop",
    "cultiver-pour-animaux": "no humans, garden with corn, sunflowers, pumpkins and beets, chickens and goat nearby, farm",
    "fumiers": "no humans, wheelbarrow of manure and straw, compost heap, barn, rabbit hutch, chickens",
    "animaux-auxiliaires": "no humans, ducks walking in a vegetable garden path, hens under apple trees, guinea fowl, orchard",
    "oeufs": "no humans, wicker basket full of fresh brown and white eggs, straw, rustic kitchen table",
    "abattage-volaille": "no humans, rustic farm kitchen table with knife, cutting board, large pot of water, bowls, clean and calm",
    "utiliser-carcasse": "no humans, large pot of homemade chicken broth with vegetables, carrots, onions, herbs, rustic kitchen",
    "conserver-viande": "no humans, freezer bags, glass jars of confit, kitchen counter, vacuum sealer, neat and clean",
    "lumiere-led": "no humans, indoor plant shelf under warm white LED grow light, pothos, herbs, cozy apartment, evening window",
    "potager-interieur": "no humans, apartment kitchen windowsill with cherry tomato plant in pot, chili peppers, basil, strawberries, grow light",
    "repousses-cuisine": "no humans, avocado seed in a glass of water with toothpicks, green onions regrowing in jars, pineapple top, kitchen counter",
    "hydroponie": "no humans, houseplants growing in glass vases with clay pebbles and water, visible white roots, bright room",
    "terrarium": "no humans, glass terrarium with moss, small ferns and fittonia, kokedama moss ball hanging, wooden table",
    "champignons-maison": "no humans, oyster mushrooms growing from a bag of coffee grounds on a kitchen counter, coffee cups",
    "choisir-plante": "no humans, plant shop with healthy potted houseplants on wooden shelves, price tags without text, bright",
    "eau-arrosage-interieur": "no humans, watering can and glass water carafe next to houseplants, rain water bottle, saucers, indoor",
    "plantes-par-piece": "no humans, cutaway view of an apartment with plants in bathroom, bedroom, living room, sunny window",
    "vacances-plantes-interieur": "no humans, houseplants grouped in a bathtub with wet towels, water basin with cotton wicks to pots, suitcase nearby",
    "preparer-lapin": "no humans, rustic farm kitchen with herbs, cutting board, knife, pot, calm atmosphere",
}

def gen(id_, scene, seed):
    g = {
        "1": {"class_type": "CheckpointLoaderSimple", "inputs": {"ckpt_name": "animagine-xl-4.0.safetensors"}},
        "2": {"class_type": "CLIPTextEncode", "inputs": {"text": STYLE + scene, "clip": ["1", 1]}},
        "3": {"class_type": "CLIPTextEncode", "inputs": {"text": NEG, "clip": ["1", 1]}},
        "4": {"class_type": "EmptyLatentImage", "inputs": {"width": 1216, "height": 832, "batch_size": 1}},
        "5": {"class_type": "KSampler", "inputs": {"model": ["1", 0], "positive": ["2", 0], "negative": ["3", 0], "latent_image": ["4", 0],
              "seed": seed, "steps": 26, "cfg": 5.0, "sampler_name": "euler_ancestral", "scheduler": "normal", "denoise": 1.0}},
        "6": {"class_type": "VAEDecode", "inputs": {"samples": ["5", 0], "vae": ["1", 2]}},
        "7": {"class_type": "SaveImage", "inputs": {"filename_prefix": f"racines/{id_}", "images": ["6", 0]}},
    }
    req = urllib.request.Request(API + "/prompt", data=json.dumps({"prompt": g}).encode(), headers={"Content-Type": "application/json"})
    pid = json.load(urllib.request.urlopen(req))["prompt_id"]
    while True:
        time.sleep(2)
        h = json.load(urllib.request.urlopen(f"{API}/history/{pid}"))
        if pid in h:
            imgs = h[pid]["outputs"]["7"]["images"]
            return os.path.join(OUT_COMFY, imgs[0]["subfolder"], imgs[0]["filename"])

only = set(sys.argv[1:])
done = []
for i, (id_, scene) in enumerate(SCENES.items()):
    if only and id_ not in only:
        continue
    dest = os.path.join(DEST, id_ + ".webp")
    if os.path.exists(dest) and not only:
        done.append(id_); continue
    t = time.time()
    src = gen(id_, scene, 1000 + i * 7)
    im = Image.open(src).convert("RGB")
    im.thumbnail((800, 800))
    im.save(dest, "WEBP", quality=80)
    done.append(id_)
    print(f"{id_} ({time.time() - t:.0f} s)", flush=True)

ids = sorted(f[:-5] for f in os.listdir(DEST) if f.endswith(".webp"))
with open(os.path.join(HERE, "..", "src", "data", "local-images.json"), "w", encoding="utf-8") as f:
    json.dump(ids, f)
print(f"{len(ids)} illustrations dans public/img")
