"""Reproduce web exports from CC0 originals; originals are downloaded, never committed."""
import io,json,hashlib,pathlib,urllib.request
import rawpy
from PIL import Image,ImageOps
ROOT=pathlib.Path(__file__).resolve().parents[1]
sources=json.load(open('/tmp/sources.json')) if pathlib.Path('/tmp/sources.json').exists() else json.loads((ROOT/'src/data/samples.json').read_text())
for s in sources:
 p=pathlib.Path(f'/tmp/{s["id"]}.raw')
 if not p.exists():urllib.request.urlretrieve(s['url'].replace(' ','%20'),p)
 assert hashlib.sha256(p.read_bytes()).hexdigest()==s['sha256']
 with rawpy.imread(str(p)) as raw:
  thumb=raw.extract_thumb()
  if thumb.format!=rawpy.ThumbFormat.JPEG:raise RuntimeError('Expected embedded JPEG')
  s['jpegBytes']=len(thumb.data); s['rawBytes']=p.stat().st_size
  camera=ImageOps.exif_transpose(Image.open(io.BytesIO(thumb.data))).convert('RGB')
  rendered=Image.fromarray(raw.postprocess(use_camera_wb=True,no_auto_bright=True,output_bps=8))
  # Match Canon/Sony's active camera crop. LibRaw offsets are relative to the sensor.
  dims=raw.sizes
  if dims.crop_width and dims.crop_height:
   x=max(0,dims.crop_left_margin-dims.left_margin)
   y=max(0,dims.crop_top_margin-dims.top_margin)
   rendered=rendered.crop((x,y,x+dims.crop_width,y+dims.crop_height))
  elif s['id']==898:
   # Nikon preview excludes an 8px border on each side of the decoded sensor image.
   rendered=rendered.crop((8,8,rendered.width-8,rendered.height-8))
  size=(1200,round(1200*rendered.height/rendered.width))
  for name,img in [('jpeg',camera),('raw',rendered)]:
   img=img.resize(size,Image.Resampling.LANCZOS)
   img.save(ROOT/f'public/images/{s["id"]}-{name}.webp',quality=60)
   img.save(ROOT/f'public/images/{s["id"]}-{name}.jpg',quality=60,optimize=True)
 s['jpegBasis']='embedded camera preview (not a full-resolution standalone JPEG)'
 s['slug']={'6402':'canon-r6-mark-ii','2414':'sony-a7-iii','898':'nikon-d750'}[str(s['id'])]
(ROOT/'src/data/samples.json').write_text(json.dumps(sources,indent=2)+'\n')
(ROOT/'public/recipe.txt').write_text(f'''RAW vs JPEG MVP — reproducible recipe
Renderer: rawpy {rawpy.__version__} / LibRaw {rawpy.libraw_version}
CC0 sources and SHA-256 hashes: /samples.json
Left: embedded camera JPEG preview extracted without retouching.
Right: raw.postprocess(use_camera_wb=True, no_auto_bright=True, output_bps=8).
No exposure, highlight recovery, white-balance correction or denoising demonstration is claimed.
RAW cropped to the camera active area (Nikon: 8px border removed).
Both: resized to 1200px wide, same geometry; WebP quality=60, JPEG fallback quality=60.
The embedded preview is NOT a standalone full-resolution camera JPEG; different rendering,
preview resolution and processing affect this comparison. It does not establish format superiority.
Reproduce: pip install -r scripts/requirements.txt; python scripts/prepare_samples.py
''')
(ROOT/'public/samples.json').write_text(json.dumps(sources,indent=2)+'\n')
print([(s['model'],s['rawBytes'],s['jpegBytes']) for s in sources])
