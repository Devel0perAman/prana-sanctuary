#!/usr/bin/env python3
"""
PRANA Sanctuary - original artwork + looping hero film, generated from code (copyright-free, ours).
These are PLACEHOLDER-QUALITY ILLUSTRATIONS: swap any file in public/media with a real photo of the same
name (e.g. g-shala.webp) and the site picks it up with no code change.

  python3 scripts/make_media.py            # everything (stills + video)
  python3 scripts/make_media.py stills     # only stills
  python3 scripts/make_media.py video      # only hero video
"""
import math, os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import gaussian_filter, gaussian_filter1d

OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'media')
os.makedirs(OUT, exist_ok=True)
RNG = np.random.default_rng(7)

def hexc(h):
    h = h.lstrip('#'); return np.array([int(h[i:i+2], 16) for i in (0, 2, 4)], np.float32) / 255

# ---------- palette (matches the Stitch screens) ----------
SAGE = hexc('#e9f4d4'); OLIVE = hexc('#2c3a22'); MOSS = hexc('#5b7048'); RUST = hexc('#8f3b1f')
CREAM = hexc('#f6ead0'); GOLD = hexc('#e8b86a'); PEACH = hexc('#f3c9a4'); DEEP = hexc('#141c10')

# ---------- primitives ----------
def vgrad(w, h, stops):
    """stops: [(pos 0..1, hex)] -> (h,w,3)"""
    ys = np.linspace(0, 1, h)[:, None]
    pos = [p for p, _ in stops]; cols = np.stack([hexc(c) for _, c in stops])
    out = np.stack([np.interp(ys[:, 0], pos, cols[:, i]) for i in range(3)], -1)
    return np.repeat(out[:, None, :], w, 1).astype(np.float32)

def glow(w, h, cx, cy, r, col, k=1.0, power=2.0):
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.sqrt((x - cx) ** 2 + (y - cy) ** 2) / r
    a = np.clip(1 - d, 0, 1) ** power * k
    return a[..., None] * (hexc(col) if isinstance(col, str) else col)

def over(base, color, mask):
    m = mask[..., None] if mask.ndim == 2 else mask
    c = hexc(color) if isinstance(color, str) else color
    return base * (1 - m) + c * m

def fbm1(n, octaves=5, seed=0, rough=0.5):
    r = np.random.default_rng(seed); out = np.zeros(n, np.float32); amp = 1; tot = 0
    for o in range(octaves):
        pts = r.random(max(2, int(n / (n / (2 ** (o + 1)) + 1)) + 2)).astype(np.float32)
        out += amp * np.interp(np.linspace(0, len(pts) - 1, n), np.arange(len(pts)), pts)
        tot += amp; amp *= rough
    return out / tot

def smooth_noise2(w, h, scale, seed=0, tile_x=False):
    r = np.random.default_rng(seed)
    gw, gh = max(2, int(w / scale)), max(2, int(h / scale))
    g = r.random((gh, gw)).astype(np.float32)
    img = Image.fromarray((g * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
    a = np.asarray(img, np.float32) / 255
    if tile_x:  # make seamless horizontally: blend with a rolled copy
        ramp = np.linspace(0, 1, w, dtype=np.float32)[None, :]
        a = a * (1 - ramp) + np.roll(a, w // 2, 1) * ramp
        a = (a - a.min()) / (a.max() - a.min() + 1e-6)
    return a

def fractal2(w, h, base=160, octs=4, seed=0, tile_x=False):
    out = np.zeros((h, w), np.float32); amp = 1; tot = 0
    for o in range(octs):
        out += amp * smooth_noise2(w, h, max(8, base / 2 ** o), seed + o, tile_x); tot += amp; amp *= .5
    out /= tot
    return (out - out.min()) / (out.max() - out.min() + 1e-6)

def ridge_mask(w, h, base, amp, seed, octaves=5, rough=0.52, slope=0.0):
    n = fbm1(w, octaves, seed, rough); top = base - amp * n + slope * np.linspace(-1, 1, w)
    y = np.arange(h)[:, None]
    soft = np.clip((y - top[None, :]) / 1.4 + .5, 0, 1)
    return soft.astype(np.float32), top

def grain(img, amt=.022, seed=None):
    r = np.random.default_rng(seed) if seed is not None else RNG
    return img + r.normal(0, amt, img.shape[:2]).astype(np.float32)[..., None]

def vignette(img, k=.35):
    h, w = img.shape[:2]; y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.sqrt(((x - w / 2) / (w / 2)) ** 2 + ((y - h / 2) / (h / 2)) ** 2)
    return img * (1 - k * np.clip(d - .35, 0, 1.2)[..., None] ** 1.6)

def blur(img, s):
    return np.stack([gaussian_filter(img[..., i], s) for i in range(3)], -1)

def save(img, name, w=None, kinds=('webp',), q=80, sm=True):
    img = np.clip(img, 0, 1); im = Image.fromarray((img * 255).astype(np.uint8))
    for k in kinds:
        if k == 'webp': im.save(os.path.join(OUT, name + '.webp'), 'WEBP', quality=q, method=6)
        else: im.save(os.path.join(OUT, name + '.jpg'), 'JPEG', quality=84, optimize=True, progressive=True)
    if sm:
        s = im.resize((max(320, im.width // 3), max(200, int(im.height * max(320, im.width // 3) / im.width))), Image.LANCZOS)
        s.save(os.path.join(OUT, name + '-sm.webp'), 'WEBP', quality=72, method=6)

# ---------- human figures (smooth tapered limbs, silhouette) ----------
POSES = {
 'prayer': dict(head=(.5,.12), neck=(.5,.2), sh=((.4,.23),(.6,.23)), pel=(.5,.55), el=((.39,.37),(.61,.37)), wr=((.49,.3),(.51,.3)),
                kn=((.45,.76),(.55,.76)), an=((.44,.96),(.56,.96)), toe=((.41,1.),(.59,1.)), torso=(.075,.065)),
 'tree': dict(head=(.5,.12), neck=(.5,.2), sh=((.42,.23),(.58,.23)), pel=(.5,.55), el=((.4,.07),(.6,.07)), wr=((.49,-.04),(.51,-.04)),
              kn=((.2,.66),(.52,.77)), an=((.47,.72),(.52,.96)), toe=((.45,.75),(.55,1.)), torso=(.072,.062)),
 'warrior': dict(head=(.5,.12), neck=(.5,.2), sh=((.44,.23),(.56,.23)), pel=(.5,.52), el=((.28,.23),(.72,.23)), wr=((.1,.23),(.9,.23)),
                 kn=((.27,.68),(.72,.74)), an=((.2,.96),(.95,.96)), toe=((.14,1.),(1.,1.)), torso=(.072,.064)),
 'lotus': dict(head=(.5,.2), neck=(.5,.3), sh=((.41,.34),(.59,.34)), pel=(.5,.68), el=((.36,.53),(.64,.53)), wr=((.32,.72),(.68,.72)),
               kn=((.2,.78),(.8,.78)), an=((.6,.83),(.4,.83)), toe=((.7,.83),(.3,.83)), torso=(.085,.095)),
 'lotusprayer': dict(head=(.5,.2), neck=(.5,.3), sh=((.41,.34),(.59,.34)), pel=(.5,.68), el=((.38,.5),(.62,.5)), wr=((.49,.42),(.51,.42)),
               kn=((.2,.78),(.8,.78)), an=((.6,.83),(.4,.83)), toe=((.7,.83),(.3,.83)), torso=(.085,.095)),
 'child': dict(head=(.2,.8), neck=(.3,.74), sh=((.36,.7),(.36,.7)), pel=(.72,.68), el=((.18,.9),(.18,.9)), wr=((.02,.95),(.02,.95)),
               kn=((.7,.92),(.7,.92)), an=((.95,.95),(.95,.95)), toe=((1.,.97),(1.,.97)), torso=(.07,.1)),
 'dog': dict(head=(.13,.75), neck=(.2,.66), sh=((.22,.58),(.22,.58)), pel=(.55,.3), el=((.12,.78),(.12,.78)), wr=((.04,.95),(.04,.95)),
             kn=((.76,.64),(.76,.64)), an=((.93,.93),(.93,.93)), toe=((.99,.97),(.99,.97)), torso=(.07,.085)),
}

def figure_mask(w, h, pose, cx, base, height, flip=False, breathe=0.0, ss=3):
    """returns float mask (h,w) with the figure standing on y=base, `height` px tall."""
    P = POSES[pose]; S = height
    bw = int(S * 1.25) + 8; bh = int(S * 1.25) + 8
    im = Image.new('L', (bw * ss, bh * ss), 0); d = ImageDraw.Draw(im)
    ox, oy = bw * ss / 2, (S * .12) * ss + 4 * ss
    def pt(p):
        x = (p[0] - .5) * (-1 if flip else 1) * S * ss + ox
        return (x, p[1] * S * ss + oy)
    def cap(a, b, ra, rb):
        (x1, y1), (x2, y2) = pt(a), pt(b); ra *= S * ss; rb *= S * ss
        ang = math.atan2(y2 - y1, x2 - x1); nx, ny = -math.sin(ang), math.cos(ang)
        d.polygon([(x1 + nx * ra, y1 + ny * ra), (x2 + nx * rb, y2 + ny * rb), (x2 - nx * rb, y2 - ny * rb), (x1 - nx * ra, y1 - ny * ra)], fill=255)
        d.ellipse([x1 - ra, y1 - ra, x1 + ra, y1 + ra], fill=255); d.ellipse([x2 - rb, y2 - rb, x2 + rb, y2 + rb], fill=255)
    tw, tw2 = P['torso']; tw += breathe
    sh_l, sh_r = P['sh']; shc = ((sh_l[0] + sh_r[0]) / 2, (sh_l[1] + sh_r[1]) / 2)
    cap(P['neck'], P['pel'], tw * .9, tw2)                      # torso
    cap(sh_l, sh_r, .036, .036)                                  # shoulder line
    cap(P['neck'], P['head'], .02, .02)                          # neck
    hx, hy = pt(P['head']); r = .052 * S * ss
    d.ellipse([hx - r * .9, hy - r * 1.08, hx + r * .9, hy + r * 1.08], fill=255)  # head
    for i in (0, 1):
        cap(P['sh'][i], P['el'][i], .03, .025); cap(P['el'][i], P['wr'][i], .024, .017)       # arms
        wx, wy = pt(P['wr'][i]); rr = .02 * S * ss; d.ellipse([wx - rr, wy - rr, wx + rr, wy + rr], fill=255)
        cap(P['pel'], P['kn'][i], .05, .037); cap(P['kn'][i], P['an'][i], .034, .021); cap(P['an'][i], P['toe'][i], .02, .013)  # legs
    im = im.resize((bw, bh), Image.LANCZOS)
    a = np.asarray(im, np.float32) / 255
    # place into full canvas with feet at `base`
    full = np.zeros((h, w), np.float32)
    top = int(base - (S * 1.0 + S * .12 + 4) + S * .0)  # oy offset => feet at oy+S
    top = int(base - (oy / ss + S)); left = int(cx - bw / 2)
    y0, x0 = max(0, top), max(0, left); y1, x1 = min(h, top + bh), min(w, left + bw)
    if y1 > y0 and x1 > x0: full[y0:y1, x0:x1] = a[y0 - top:y1 - top, x0 - left:x1 - left]
    return full

def put_fig(img, pose, cx, base, height, color=DEEP, alpha=.96, flip=False, rim=None, breathe=0.0):
    h, w = img.shape[:2]; m = figure_mask(w, h, pose, cx, base, height, flip, breathe) * alpha
    img = over(img, color, m)
    if rim is not None:   # warm rim light on one edge
        sh = np.roll(figure_mask(w, h, pose, cx, base, height, flip, breathe), (-2, -3 if not flip else 3), (0, 1))
        edge = np.clip(figure_mask(w, h, pose, cx, base, height, flip, breathe) - sh, 0, 1) * .5
        img = img + edge[..., None] * hexc(rim) * .8
    return img

# ---------- scenes ----------
def sky_sun(w, h, top, mid, hor, sun_xy, sun_r, sun_col, hz=.62):
    img = vgrad(w, h, [(0, top), (hz * .55, mid), (hz, hor), (1, hor)])
    sx, sy = sun_xy
    img += glow(w, h, sx, sy, sun_r * 7, sun_col, .55, 2.2) + glow(w, h, sx, sy, sun_r * 2.2, '#fff0c8', .7, 2) + glow(w, h, sx, sy, sun_r, '#fffaf0', 1, 1.2)
    return img

def mist_band(w, h, y, thick, seed, k=.5, col='#f6ead0', tile=False):
    n = fractal2(w, h, 140, 4, seed, tile)
    yy = np.arange(h)[:, None].astype(np.float32)
    band = np.exp(-((yy - y) / thick) ** 2)
    return np.clip(band * (.35 + n * .9) * k, 0, 1)

def ridges(img, specs, w, h, mist=True, seed0=10):
    for i, (base, amp, col_top, col_bot, mk) in enumerate(specs):
        m, top = ridge_mask(w, h, base, amp, seed0 + i * 3, 6, .55)
        g = vgrad(w, h, [(0, col_top), (1, col_bot)]); g = g.copy()
        # atmospheric gradient inside the ridge: lighter at the crest
        crest = np.clip(1 - (np.arange(h)[:, None] - top[None, :]) / (h * .35), 0, 1)[..., None]
        layer = g * (1 - .25 * crest) + hexc(col_top) * .25 * crest
        img = img * (1 - m[..., None]) + layer * m[..., None]
        if mist: img = over(img, '#f1e3c0', mist_band(w, h, base + 8, h * .05, seed0 + 50 + i, mk))
    return img

def scene_dawn(w, h, fig=None, seed=0, sun=(.62, .5), warm=1.0, ground=True):
    img = sky_sun(w, h, '#27402f', '#b9a36a' if warm else '#8aa58a', '#f6d79b', (w * sun[0], h * sun[1]), h * .045, '#ffd48a')
    img = ridges(img, [(h * .55, h * .13, '#9bab7e', '#6f8d62', .55), (h * .63, h * .12, '#6e8a5c', '#476343', .6), (h * .73, h * .1, '#44603b', '#2d4529', .6),
                       (h * .86, h * .09, '#27391f', '#16230f', .35)], w, h, True, seed + 5)
    if fig:
        for (pose, cx, base, ht, flip) in fig: img = put_fig(img, pose, cx * w, base * h, ht * h, DEEP, .96, flip, '#ffd6a0')
    img = grain(vignette(img, .3), .018, seed)
    return img

def scene_window(w, h, fig=None, seed=0, mats=True, warm='#f1c98c', n_win=4, light=1.0, flip=False):
    """architectural shala interior: arched windows, light shafts, plank floor, mats"""
    hz = h * .58
    img = vgrad(w, h, [(0, '#8a6a46'), (.55, '#d9b98a'), (.58, '#c79f6b'), (1, '#7d5a38')])
    # back wall glow + arched windows
    ww = w * .78 / n_win; x0 = w * .11; wt = h * .12; wb = hz - h * .02
    win = np.zeros((h, w), np.float32)
    pil = Image.new('L', (w, h), 0); d = ImageDraw.Draw(pil)
    for i in range(n_win):
        a = x0 + i * ww + ww * .12; b = x0 + (i + 1) * ww - ww * .12
        d.rectangle([a, wt + (b - a) / 2, b, wb], fill=255); d.pieslice([a, wt, b, wt + (b - a)], 180, 360, fill=255)
    win = np.asarray(pil, np.float32) / 255
    outside = vgrad(w, h, [(0, '#e9f2c9'), (.5, '#cfe3a7'), (1, '#8fb571')])
    outside += glow(w, h, w * .5, hz * .6, w * .4, '#fffbe6', .45, 1.4)
    img = img * (1 - win[..., None]) + outside * win[..., None]
    # muntins
    pil2 = Image.new('L', (w, h), 0); d2 = ImageDraw.Draw(pil2)
    for i in range(n_win):
        a = x0 + i * ww + ww * .12; b = x0 + (i + 1) * ww - ww * .12; cx = (a + b) / 2
        d2.line([cx, wt, cx, wb], fill=255, width=max(2, int(w / 300))); d2.line([a, (wt + wb) / 2, b, (wt + wb) / 2], fill=255, width=max(2, int(w / 300)))
        d2.arc([a, wt, b, wt + (b - a)], 180, 360, fill=255, width=max(3, int(w / 260))); d2.rectangle([a, wt + (b - a) / 2, b, wb], outline=255, width=max(3, int(w / 260)))
    mu = np.asarray(pil2.filter(ImageFilter.GaussianBlur(.6)), np.float32) / 255
    img = over(img, '#4a3320', mu * .85)
    # light shafts onto floor
    shaft = Image.new('L', (w, h), 0); d3 = ImageDraw.Draw(shaft)
    for i in range(n_win):
        a = x0 + i * ww + ww * .12; b = x0 + (i + 1) * ww - ww * .12
        sk = (i - (n_win - 1) / 2) * w * .22 * (-1 if flip else 1)
        d3.polygon([(a, wb), (b, wb), (b + sk + ww * .35, h * 1.02), (a + sk - ww * .15, h * 1.02)], fill=255)
    sf = gaussian_filter(np.asarray(shaft, np.float32) / 255, w * .01)
    img += sf[..., None] * hexc(warm) * .38 * light
    # perspective plank floor
    fl = Image.new('L', (w, h), 0); d4 = ImageDraw.Draw(fl); vx = w / 2
    for k in range(-24, 25):
        d4.line([(vx + k * w * .016, hz), (vx + k * w * .17, h)], fill=255, width=1)
    for j in range(1, 14):
        y = hz + (h - hz) * (j / 14) ** 1.7; d4.line([(0, y), (w, y)], fill=120, width=1)
    fln = gaussian_filter(np.asarray(fl, np.float32) / 255, .7)
    img = over(img, '#5a3f26', fln * .28 * (np.arange(h)[:, None] > hz))
    # ceiling beams
    for k in range(-5, 6):
        pass
    ceil = Image.new('L', (w, h), 0); d5 = ImageDraw.Draw(ceil)
    for j in range(0, 6):
        y = hz * .5 * (1 - (j / 6) ** 1.8)
        d5.rectangle([0, y - h * .012, w, y + h * .006], fill=255)
    cn = gaussian_filter(np.asarray(ceil, np.float32) / 255, 1.2)
    img = over(img, '#3f2b19', cn * .35 * (np.arange(h)[:, None] < hz * .55))
    # mats in perspective
    if mats:
        cols = ['#7e9a68', '#b24f2e', '#efe3c6', '#6f8a5a']
        pm = Image.new('RGB', (w, h), (0, 0, 0)); pd = ImageDraw.Draw(pm); mm = Image.new('L', (w, h), 0); md = ImageDraw.Draw(mm)
        for row in range(5):
            t = (row + 1) / 6; y = hz + (h - hz) * t ** 1.5 * .95 + h * .02; sc = .4 + t * 1.7
            for c in range(-3, 4):
                cx = w / 2 + c * w * .15 * sc; mw = w * .055 * sc; mh = h * .022 * sc
                md.ellipse([cx - mw, y - mh, cx + mw, y + mh], fill=255)
                col = cols[(row + c) % 4]; pd.ellipse([cx - mw, y - mh, cx + mw, y + mh], fill=tuple(int(v * 255) for v in hexc(col)))
        mmk = np.asarray(mm, np.float32)[..., None] / 255; img = img * (1 - mmk * .92) + (np.asarray(pm, np.float32) / 255) * mmk * .92
    if fig:
        for (pose, cx, base, ht, flip) in fig: img = put_fig(img, pose, cx * w, base * h, ht * h, '#2b1e12', .94, flip, '#ffe1b0')
    img = grain(vignette(img, .38), .02, seed)
    return img

def scene_dome(w, h, seed=0):
    img = vgrad(w, h, [(0, '#2b3a25'), (.5, '#c9894a'), (1, '#e9b56d')])
    cx, cy = w * .5, h * .46; R = h * .55
    pil = Image.new('L', (w, h), 0); d = ImageDraw.Draw(pil)
    rings = 7
    for r in range(1, rings + 1):
        rr = R * r / rings; d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], outline=255, width=max(2, int(w / 400)))
    for k in range(24):
        a = k * math.tau / 24; d.line([cx, cy, cx + R * math.cos(a), cy + R * math.sin(a)], fill=255, width=max(2, int(w / 400)))
    for r in range(1, rings):
        for k in range(24):
            a0 = k * math.tau / 24; a1 = (k + 1) * math.tau / 24; r0 = R * r / rings; r1 = R * (r + 1) / rings
            if (k + r) % 2 == 0: d.line([cx + r0 * math.cos(a0), cy + r0 * math.sin(a0), cx + r1 * math.cos(a1), cy + r1 * math.sin(a1)], fill=200, width=max(1, int(w / 500)))
    lat = np.asarray(pil.filter(ImageFilter.GaussianBlur(.8)), np.float32) / 255
    y, x = np.mgrid[0:h, 0:w]; dist = np.sqrt((x - cx) ** 2 + (y - cy) ** 2)
    inside = (dist < R).astype(np.float32)
    panes = vgrad(w, h, [(0, '#f7e3b0'), (1, '#c4a56a')]) + glow(w, h, cx, cy, R, '#fff6d8', .8, 1.5)
    panes = panes * (.8 + .2 * fractal2(w, h, 60, 3, seed)[..., None])
    img = img * (1 - inside[..., None]) + panes * inside[..., None]
    img = over(img, '#3a2a18', lat * .85 * inside)
    img += glow(w, h, cx, cy + R * .6, R * 1.3, '#ffd9a0', .25, 1.6)
    # floor + mats ring
    fl = (np.arange(h)[:, None] > h * .8).astype(np.float32) * np.ones((1, w), np.float32)
    img = over(img, '#6a4a2c', gaussian_filter(fl, 4) * .85)
    for k in range(9):
        a = k * math.tau / 9; mx = cx + w * .33 * math.cos(a); my = h * .9 + h * .06 * math.sin(a) + h * .03
        e = np.exp(-(((x - mx) / (w * .05)) ** 2 + ((y - my) / (h * .02)) ** 2) ** 1.5)
        img = over(img, ['#7e9a68', '#b24f2e', '#efe3c6'][k % 3], e * .9)
    img = put_fig(img, 'lotus', cx, h * .93, h * .18, '#2b1e12', .94, False, '#ffe1b0')
    return grain(vignette(img, .4), .02, seed)

def scene_water(w, h, seed=0):
    hz = h * .5
    img = vgrad(w, h, [(0, '#2a2650'), (.25, '#8a4f6a'), (.46, '#f09a5a'), (.5, '#f7c27a'), (.52, '#7a4f6a'), (.75, '#3a2f55'), (1, '#1d1a35')])
    img += glow(w, h, w * .5, hz, w * .5, '#ffb066', .55, 2)
    # far shore + ghat arches
    m, top = ridge_mask(w, h, hz, h * .035, seed + 3, 5)
    shore = m * (np.arange(h)[:, None] < hz + 3)
    img = over(img, '#2a2040', shore * .9)
    pil = Image.new('L', (w, h), 0); d = ImageDraw.Draw(pil)
    for k in range(8):
        a = w * (.06 + k * .12); d.rectangle([a, hz - h * .055, a + w * .09, hz + 2], fill=255); d.pieslice([a + w * .01, hz - h * .08, a + w * .08, hz - h * .025], 180, 360, fill=255)
        d.polygon([(a + w * .045, hz - h * .12), (a + w * .01, hz - h * .08), (a + w * .08, hz - h * .08)], fill=255)
    img = over(img, '#241a38', np.asarray(pil, np.float32) / 255 * .95)
    # water ripples
    n = gaussian_filter(RNG.random((h, w)).astype(np.float32), (1, 18)); n = (n - n.mean()) * 10
    ripple = np.clip(n, -1, 1) * (np.arange(h)[:, None] > hz)
    refl = np.flipud(img[:int(hz * 2) - h if False else 0:0]) if False else None
    img = img + ripple[..., None] * .05 * hexc('#ffc88a')
    # diyas
    pts = []
    for i in range(110):
        t = RNG.random(); y = hz + h * .04 + (h - hz - h * .05) * t ** 1.4; x = RNG.random() * w; pts.append((x, y, .5 + t * 1.6))
    pts.sort(key=lambda p: p[1])
    for (x, y, s) in pts:
        img += glow(w, h, x, y, 14 * s, '#ffb347', .8, 2.5)
        streak = np.exp(-(((np.mgrid[0:h, 0:w][1] - x) / (3 * s)) ** 2 + ((np.mgrid[0:h, 0:w][0] - (y + 24 * s)) / (26 * s)) ** 2))
        img += streak[..., None] * hexc('#ff9a3d') * .22
    # silhouettes of people sitting on the ghat steps
    for k, cx in enumerate([.18, .3, .43, .57, .7, .83]):
        img = put_fig(img, 'lotusprayer' if k % 2 else 'lotus', w * cx, hz + h * .1, h * .16 * (1 - .0 * k), '#171227', .97, False)
    return grain(vignette(img, .35), .02, seed)

def scene_bowls(w, h, seed=0, cool=False):
    img = vgrad(w, h, [(0, '#2a1d14'), (.5, '#4a321f'), (1, '#1d130c')])
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    for i in range(22):  # bokeh
        img += glow(w, h, RNG.random() * w, RNG.random() * h * .55, h * (.03 + RNG.random() * .07), '#f2b565', .18 + RNG.random() * .25, 1.0)
    img += glow(w, h, w * .5, h * .55, w * .55, '#d89a55', .35, 1.8)
    table = (y > h * .62).astype(np.float32); img = over(img, '#5a3b22', gaussian_filter(table, 2) * .95)
    for k in range(60):  # wood grain
        yy = h * .62 + RNG.random() * h * .38
        img = over(img, '#3b2614', np.exp(-((y - yy) / 1.2) ** 2) * (y > h * .62) * .16)
    bowls = [(.3, .72, .17, .1), (.52, .68, .22, .13), (.76, .74, .14, .08)]
    for (bx, by, br, bh_) in bowls:
        cx, cy, r = w * bx, h * by, w * br * .5
        sh = np.exp(-(((x - cx) / (r * 1.4)) ** 2 + ((y - (cy + r * .55)) / (r * .22)) ** 2)); img = img * (1 - sh[..., None] * .5)
        body = ((((x - cx) / r) ** 2 + ((y - (cy + r * .15)) / (r * .78)) ** 2) < 1) & (y > cy)
        body = body.astype(np.float32); body = gaussian_filter(body, 1.2)
        shade = vgrad(w, h, [(0, '#f0c070'), (.4, '#b9803a'), (1, '#6b4420')])
        shade += glow(w, h, cx - r * .4, cy + r * .2, r * 1.1, '#fff0b8', .4, 1.5)
        img = img * (1 - body[..., None]) + shade * body[..., None]
        rim = (((x - cx) / r) ** 2 + ((y - cy) / (r * .26)) ** 2 < 1).astype(np.float32); rim = gaussian_filter(rim, 1)
        inner = vgrad(w, h, [(0, '#3a2412'), (1, '#8b5b2a')]); img = img * (1 - rim[..., None]) + inner * rim[..., None]
        ring = np.clip(1 - np.abs(np.sqrt(((x - cx) / r) ** 2 + ((y - cy) / (r * .26)) ** 2) - 1) * 14, 0, 1) * (y < cy + r * .3)
        img = over(img, '#ffe6a8', ring * .85)
    img = over(img, '#c8a46c', gaussian_filter((np.abs((y - (h * .8 + (x - w * .2) * -.06))) < h * .008).astype(np.float32) * ((x > w * .18) & (x < w * .55)), 1.2) * .9)  # mallet
    return grain(vignette(img, .5), .025, seed)

def scene_botanical(w, h, seed=0, fig=None, deep=False):
    r = np.random.default_rng(seed)
    img = vgrad(w, h, [(0, '#bfd4a0'), (.5, '#7a9a62'), (1, '#2b4125')]) if not deep else vgrad(w, h, [(0, '#9bb887'), (.5, '#527048'), (1, '#1c2e19')])
    img += glow(w, h, w * .6, h * .15, w * .6, '#fff3c8', .5, 1.6)
    # tree trunks
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    for i in range(7):
        tx = r.random() * w; tw_ = w * (.01 + r.random() * .025)
        img = over(img, '#2a3a22', np.exp(-(((x - tx) / tw_) ** 8)) * (.18 + r.random() * .25))
    # leaves (blurred, layered by depth)
    for layer, (n, sz, bl, col, k) in enumerate([(26, .16, 14, '#8fb06d', .5), (24, .13, 7, '#5f8553', .55), (22, .11, 2, '#2f5030', .75), (14, .22, 5, '#1f3a22', .85)]):
        pil = Image.new('L', (w, h), 0); d = ImageDraw.Draw(pil)
        for i in range(n):
            cx, cy = r.random() * w, r.random() * h; L = h * sz * (.5 + r.random()); ang = r.random() * math.tau
            pts = []
            for t in np.linspace(0, 1, 18):
                wd = math.sin(t * math.pi) * L * .16
                pts.append((cx + math.cos(ang) * L * t - math.sin(ang) * wd, cy + math.sin(ang) * L * t + math.cos(ang) * wd))
            for t in np.linspace(1, 0, 18):
                wd = -math.sin(t * math.pi) * L * .16
                pts.append((cx + math.cos(ang) * L * t - math.sin(ang) * wd, cy + math.sin(ang) * L * t + math.cos(ang) * wd))
            d.polygon(pts, fill=255)
        m = gaussian_filter(np.asarray(pil, np.float32) / 255, bl) * k
        img = over(img, col, m)
    img += mist_band(w, h, h * .55, h * .12, seed + 4, .4)[..., None] * hexc('#eef2d8')
    if fig:
        for (pose, cx, base, ht, flip) in fig: img = put_fig(img, pose, cx * w, base * h, ht * h, '#12200f', .93, flip, '#e8f0b0')
    return grain(vignette(img, .35), .02, seed)

def lotus(img, cx, cy, size, col1='#f7d6dd', col2='#e8a0b4', ang0=0):
    h, w = img.shape[:2]; pil = Image.new('L', (w * 2 // 2, h), 0)
    for ring, (n, L, wd) in enumerate([(9, 1.0, .26), (7, .84, .24), (5, .62, .22)]):
        m = Image.new('L', (w, h), 0); d = ImageDraw.Draw(m)
        for i in range(n):
            a = ang0 + i * math.tau / n + ring * .3; pts = []
            for t in np.linspace(0, 1, 16):
                ww_ = math.sin(t ** .8 * math.pi) * size * L * wd; pts.append((cx + math.cos(a) * size * L * t - math.sin(a) * ww_, cy + (math.sin(a) * size * L * t + math.cos(a) * ww_) * .45))
            for t in np.linspace(1, 0, 16):
                ww_ = -math.sin(t ** .8 * math.pi) * size * L * wd; pts.append((cx + math.cos(a) * size * L * t - math.sin(a) * ww_, cy + (math.sin(a) * size * L * t + math.cos(a) * ww_) * .45))
            d.polygon(pts, fill=255)
        mk = gaussian_filter(np.asarray(m, np.float32) / 255, 1.1)
        grd = vgrad(w, h, [(0, col1), (1, col2)])
        img = img * (1 - mk[..., None] * .96) + grd * mk[..., None] * .96
    return img

def scene_pond(w, h, seed=0):
    img = vgrad(w, h, [(0, '#8fb09a'), (.35, '#cfe0bf'), (.4, '#6f9a84'), (1, '#1f3c33')])
    img += glow(w, h, w * .7, h * .12, w * .5, '#fff7d0', .5, 1.6)
    m, top = ridge_mask(w, h, h * .38, h * .06, seed + 2, 6)
    img = over(img, '#3b5f48', m * (np.arange(h)[:, None] < h * .42) * .85)
    r = np.random.default_rng(seed)
    n = gaussian_filter(r.random((h, w)).astype(np.float32), (1.5, 24)); img += (n - n.mean())[..., None] * hexc('#dff0d8') * .6 * (np.arange(h)[:, None, None] > h * .4)
    for i in range(14):  # pads
        cx, cy = r.random() * w, h * (.45 + r.random() * .5); rx = w * (.03 + r.random() * .06)
        y, x = np.mgrid[0:h, 0:w].astype(np.float32); e = (((x - cx) / rx) ** 2 + ((y - cy) / (rx * .32)) ** 2 < 1).astype(np.float32); e = gaussian_filter(e, 1)
        img = over(img, '#2f6a4a' if i % 2 else '#3f7d57', e * .92)
    for (fx, fy, s) in [(.3, .62, .18), (.62, .72, .24), (.82, .55, .13), (.14, .86, .2)]:
        img = lotus(img, w * fx, h * fy, w * s * .5)
    return grain(vignette(img, .3), .018, seed)

def scene_pavilion(w, h, seed=0):
    img = scene_botanical(w, h, seed, None, True)
    pil = Image.new('L', (w, h), 0); d = ImageDraw.Draw(pil); cx, by = w * .5, h * .72
    d.polygon([(cx - w * .36, by - h * .28), (cx - w * .26, by - h * .36), (cx + w * .26, by - h * .36), (cx + w * .36, by - h * .28), (cx + w * .3, by - h * .26), (cx - w * .3, by - h * .26)], fill=255)
    for px in (-.27, -.1, .1, .27): d.rectangle([cx + w * px - w * .008, by - h * .27, cx + w * px + w * .008, by], fill=255)
    d.rectangle([cx - w * .32, by, cx + w * .32, by + h * .03], fill=255)
    m = gaussian_filter(np.asarray(pil, np.float32) / 255, .8)
    img = over(img, '#2d1f13', m * .96)
    inside = np.zeros((h, w), np.float32); inside[int(by - h * .26):int(by), int(cx - w * .26):int(cx + w * .26)] = 1; inside = gaussian_filter(inside, 6)
    img = img * (1 - inside[..., None] * .5 * (1 - m[..., None])) + hexc('#ffcf8a') * inside[..., None] * .4 * (1 - m[..., None])
    img = put_fig(img, 'lotus', cx, by + h * .01, h * .2, '#1a120a', .95, False, '#ffd49a')
    return img

def scene_ripples(w, h, seed=0):
    img = vgrad(w, h, [(0, '#12302f'), (.5, '#2a5e55'), (1, '#0d201f')])
    y, x = np.mgrid[0:h, 0:w].astype(np.float32); cx, cy = w * .5, h * .5
    d = np.sqrt((x - cx) ** 2 + ((y - cy) * 1.25) ** 2)
    rings = (np.sin(d / (w * .018)) * .5 + .5) ** 3 * np.exp(-d / (w * .45))
    img += rings[..., None] * hexc('#9bd8c0') * .55 + glow(w, h, cx, cy, w * .35, '#d9ffe9', .55, 2)
    img = put_fig(img, 'lotusprayer', cx, cy + h * .22, h * .46, '#06120f', .92, False, '#9bd8c0')
    return grain(vignette(img, .4), .02, seed)

def scene_ayur(w, h, seed=0):
    img = vgrad(w, h, [(0, '#6a4a2c'), (1, '#4a321c')]); r = np.random.default_rng(seed)
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    for i in range(70): img = over(img, '#3b2614', np.exp(-((y - r.random() * h) / 1.4) ** 2) * .22)
    def disc(cx, cy, rad, col, rim=None, k=1.0):
        nonlocal img
        sh = np.exp(-(((x - cx - rad * .15) / (rad * 1.15)) ** 2 + ((y - cy - rad * .2) / (rad * 1.15)) ** 2) ** 1.2); img = img * (1 - sh[..., None] * .3)
        m = gaussian_filter((((x - cx) ** 2 + (y - cy) ** 2) < rad ** 2).astype(np.float32), 1.1)
        if rim: img = over(img, rim, m)
        m2 = gaussian_filter((((x - cx) ** 2 + (y - cy) ** 2) < (rad * .86) ** 2).astype(np.float32), 1.1)
        img = over(img, col, m2 * k)
    for (fx, fy, rad, col, rim) in [(.3, .42, .2, '#d9a441', '#8a5a26'), (.62, .32, .14, '#a24a2a', '#5d2b17'), (.72, .65, .17, '#7e9a58', '#3d5028'), (.25, .76, .12, '#e8dcc0', '#9a8a6a'), (.5, .62, .12, '#c9802e', '#6a4218')]:
        disc(w * fx, h * fy, min(w, h) * rad, col, rim)
        img += glow(w, h, w * fx - rad * w * .2, h * fy - rad * h * .25, min(w, h) * rad, '#fff0c0', .2, 1.5)
    for i in range(34):  # leaves/herbs
        cx, cy = r.random() * w, r.random() * h; a = r.random() * math.tau; L = 26 + r.random() * 40
        e = np.exp(-((((x - cx) * math.cos(a) + (y - cy) * math.sin(a)) / L) ** 2 + (((y - cy) * math.cos(a) - (x - cx) * math.sin(a)) / (L * .3)) ** 2))
        img = over(img, '#4f7a3a' if i % 3 else '#8aa64a', e * .85)
    img += glow(w, h, w * .2, h * .1, w * .8, '#ffe6b0', .25, 1.6)
    return grain(vignette(img, .4), .022, seed)

def scene_deck(w, h, seed=0):
    img = scene_dawn(w, int(h * .78), None, seed, (.7, .45))
    img = np.vstack([img, np.zeros((h - img.shape[0], w, 3), np.float32)])
    y = np.arange(h)[:, None]; dk = (y >= h * .78)
    plank = vgrad(w, h, [(0, '#7a5434'), (1, '#3b2614')])
    for i in range(0, 12): plank = over(plank, '#2a1a0c', np.exp(-((y - (h * .78 + (h * .22) * (i / 12) ** 1.4)) / 1.2) ** 2) * np.ones((1, w), np.float32) * .6)
    img = np.where(dk[..., None], plank, img)
    img = put_fig(img, 'warrior', w * .35, h * .93, h * .5, DEEP, .97, False, '#ffd6a0')
    img = put_fig(img, 'tree', w * .66, h * .93, h * .5, DEEP, .97, False, '#ffd6a0')
    return grain(vignette(img, .3), .018, seed)

def bust(w, h, kind, seed=0):
    pal = [('#e9f1d2', '#9bb27c'), ('#f6e3c6', '#c99a62'), ('#dce8d9', '#6f8f78'), ('#f1d9c4', '#b8714b')][seed % 4]
    img = vgrad(w, h, [(0, pal[0]), (1, pal[1])]) + glow(w, h, w * .5, h * .35, w * .6, '#fffbe8', .45, 1.4)
    skin = [('#8a5a3a'), ('#b97d55'), ('#a3694a'), ('#c48a62')][seed % 4]
    pil = Image.new('L', (w * 2, h * 2), 0); d = ImageDraw.Draw(pil); W, H = w * 2, h * 2
    cx = W * .5
    d.ellipse([cx - W * .25, H * 1.05 - W * .46, cx + W * .25, H * 1.05 + W * .46], fill=255)   # shoulders
    d.rectangle([cx - W * .07, H * .52, cx + W * .07, H * .78], fill=255)  # neck
    d.ellipse([cx - W * .15, H * .26, cx + W * .15, H * .6], fill=255)    # head
    body = np.asarray(pil.resize((w, h), Image.LANCZOS), np.float32) / 255
    robe = [('#f4ead2'), ('#d9a65c'), ('#8fa271'), ('#a24a2a')][(seed + 1) % 4]
    sh = np.zeros((h, w), np.float32); sh[int(h * .76):, :] = 1
    img = over(img, '#2a2016', gaussian_filter(body, 6) * .15)
    img = over(img, skin, body); img = over(img, robe, body * gaussian_filter(sh, 3))
    hair = Image.new('L', (W, H), 0); hd = ImageDraw.Draw(hair)
    if kind == 'bun': hd.ellipse([cx - W * .16, H * .22, cx + W * .16, H * .46], fill=255); hd.ellipse([cx - W * .06, H * .14, cx + W * .06, H * .26], fill=255)
    elif kind == 'long': hd.ellipse([cx - W * .17, H * .23, cx + W * .17, H * .5], fill=255); hd.rectangle([cx - W * .17, H * .36, cx - W * .1, H * .72], fill=255); hd.rectangle([cx + W * .1, H * .36, cx + W * .17, H * .72], fill=255)
    elif kind == 'beard': hd.ellipse([cx - W * .155, H * .25, cx + W * .155, H * .4], fill=255); hd.ellipse([cx - W * .1, H * .46, cx + W * .1, H * .64], fill=255)
    else: hd.pieslice([cx - W * .16, H * .24, cx + W * .16, H * .5], 180, 360, fill=255)
    hm = np.asarray(hair.resize((w, h), Image.LANCZOS), np.float32) / 255
    img = over(img, '#241a12' if seed % 2 == 0 else '#efe9dc', hm * .95)
    img += glow(w, h, w * .5, h * .38, w * .45, '#fff3d0', .22, 2)
    return grain(vignette(img, .25), .016, seed)

def scene_map(w, h, seed=0):
    f = fractal2(w, h, 220, 4, seed)
    bands = np.digitize(f, np.linspace(.15, .9, 9)).astype(np.float32) / 9
    ramp = np.stack([np.interp(bands, [0, .5, 1], [a, b, c]) for a, b, c in zip(hexc('#dfe9c8'), hexc('#bfd0a0'), hexc('#8aa070'))], -1)
    edge = np.abs(np.gradient(bands, axis=0)) + np.abs(np.gradient(bands, axis=1))
    img = ramp * (1 - np.clip(edge * 6, 0, 1)[..., None] * .35) + (np.clip(edge * 6, 0, 1)[..., None]) * hexc('#6e8656') * .35
    # river
    xs = np.linspace(0, w, 200); ys = h * (.55 + .18 * np.sin(xs / w * 7) + .05 * np.sin(xs / w * 19))
    pil = Image.new('L', (w, h), 0); d = ImageDraw.Draw(pil); d.line(list(zip(xs, ys)), fill=255, width=max(4, h // 40))
    r = gaussian_filter(np.asarray(pil, np.float32) / 255, 1.2); img = over(img, '#9cc3cf', r)
    # roads
    pil = Image.new('L', (w, h), 0); d = ImageDraw.Draw(pil)
    d.line([(0, h * .2), (w * .35, h * .3), (w * .6, h * .25), (w, h * .4)], fill=255, width=max(2, h // 90)); d.line([(w * .4, h * .3), (w * .5, h * .9)], fill=255, width=max(2, h // 90))
    img = over(img, '#fffdf2', gaussian_filter(np.asarray(pil, np.float32) / 255, .8) * .9)
    # pin
    px, py = w * .54, h * .48
    img += glow(w, h, px, py, w * .09, '#ffffff', .6, 2)
    img = over(img, '#8f3b1f', np.clip(1 - np.sqrt((np.mgrid[0:h, 0:w][1] - px) ** 2 + (np.mgrid[0:h, 0:w][0] - py) ** 2) / (h * .045), 0, 1) ** .3 * .98)
    img = over(img, '#ffffff', np.clip(1 - np.sqrt((np.mgrid[0:h, 0:w][1] - px) ** 2 + (np.mgrid[0:h, 0:w][0] - py) ** 2) / (h * .016), 0, 1) ** .3)
    return img

def scene_group(w, h, seed=0):
    f = [('lotus', .22, .86, .26, False), ('warrior', .5, .93, .5, False), ('tree', .78, .93, .46, False), ('lotusprayer', .38, .96, .24, False), ('prayer', .66, .93, .42, False)]
    return scene_window(w, h, f, seed, True, '#f6d49a', 3, 1.1)


def scene_bridge(w, h, seed=0, warm=1.0, dusk=False):
    """Rishikesh-style iron suspension footbridge over the Ganga, hills behind, soft light on the water."""
    top, mid, hor = ('#2a2f55', '#c07a6a', '#f6c98f') if dusk else ('#27402f', '#b9a36a', '#f6d79b')
    img = sky_sun(w, h, top, mid, hor, (w * .72, h * .4), h * .05, '#ffd48a', hz=.5)
    img = ridges(img, [(h * .36, h * .12, '#9bab7e', '#6f8d62', .55), (h * .45, h * .1, '#6e8a5c', '#476343', .6), (h * .52, h * .06, '#44603b', '#2d4529', .5)], w, h, True, seed + 5)
    hz = h * .56
    water = vgrad(w, h, [(0, '#7aa39a'), (.35, '#4d7c78'), (1, '#1f3d3c')])
    wm = (np.arange(h)[:, None] >= hz).astype(np.float32) * np.ones((1, w), np.float32)
    img = img * (1 - wm[..., None]) + water * wm[..., None]
    n = gaussian_filter(RNG.random((h, w)).astype(np.float32), (1.2, 22)); n = (n - n.mean()) * 9
    img += (np.clip(n, -1, 1) * wm)[..., None] * .06 * hexc('#ffe2a8')
    img += glow(w, h, w * .72, hz + h * .12, w * .22, '#ffd9a0', .35, 2) * wm[..., None]
    ss = 2; pil = Image.new('L', (w * ss, h * ss), 0); d = ImageDraw.Draw(pil)
    X = lambda x: x * w * ss; Y = lambda y: y * h * ss
    deck_y = .50; sag = .045
    # towers
    for tx in (.14, .86):
        d.rectangle([X(tx - .012), Y(.17), X(tx + .012), Y(deck_y + .1)], fill=255)
        d.rectangle([X(tx - .022), Y(.15), X(tx + .022), Y(.175)], fill=255)
        d.polygon([(X(tx - .02), Y(.15)), (X(tx), Y(.12)), (X(tx + .02), Y(.15))], fill=255)
    # main cables (catenary-like dip) and hangers
    pts = []
    for i in range(61):
        t = i / 60; x = .14 + t * .72
        y = .175 + (deck_y - .08 - .175) * (1 - (2 * t - 1) ** 2)
        pts.append((X(x), Y(y)))
    d.line(pts, fill=255, width=int(2.6 * ss))
    for (px, py) in pts[::2]: d.line([(px, py), (px, Y(deck_y))], fill=255, width=int(1.2 * ss))
    # deck + rail
    d.line([(X(.0), Y(deck_y + .004)), (X(1.0), Y(deck_y + .004))], fill=255, width=int(5 * ss))
    d.line([(X(.0), Y(deck_y - .018)), (X(1.0), Y(deck_y - .018))], fill=255, width=int(1.6 * ss))
    # walkers
    for wx in (.33, .41, .56, .63, .7):
        d.ellipse([X(wx) - 3 * ss, Y(deck_y) - 24 * ss, X(wx) + 3 * ss, Y(deck_y) - 18 * ss], fill=255)
        d.rounded_rectangle([X(wx) - 3.6 * ss, Y(deck_y) - 18 * ss, X(wx) + 3.6 * ss, Y(deck_y) - 2 * ss], radius=3 * ss, fill=255)
    m = np.asarray(pil.resize((w, h), Image.LANCZOS), np.float32) / 255
    img = over(img, '#16230f', m * .95)
    return grain(vignette(img, .3), .018, seed)

def scene_og(w, h):
    img = scene_dawn(w, h, [('lotus', .5, .9, .22, False)], 3)
    return img

# ---------- stills ----------
def stills():
    S = {
      'hero-poster': lambda: scene_dawn(1920, 1080, [('lotus', .7, .86, .16, False)], 1, (.38, .5)),
      'og': lambda: scene_og(1200, 630),
      'home-about': lambda: scene_window(1000, 1250, [('lotusprayer', .5, .88, .3, False)], 2, True, '#f1c98c', 2),
      'hatha': lambda: scene_dawn(900, 675, [('tree', .5, .9, .4, False)], 4, (.3, .5)),
      'vinyasa': lambda: scene_deck(900, 675, 5),
      'yin': lambda: scene_window(900, 675, [('child', .5, .93, .22, False)], 6, True, '#f1c98c', 3),
      'pranayama': lambda: scene_bowls(900, 675, 7),
      'course-foundations': lambda: scene_window(1200, 900, [('lotusprayer', .5, .92, .3, False)], 8, True, '#f4d9a0', 3),
      'course-pranayama': lambda: scene_ripples(1200, 900, 9),
      'course-vinyasa': lambda: scene_dawn(1200, 900, [('warrior', .5, .9, .42, False)], 10, (.7, .48)),
      'course-yin': lambda: scene_window(1200, 900, [('child', .5, .93, .22, False)], 11, True, '#e8d3a0', 4, .8),
      'course-asana': lambda: scene_deck(1200, 900, 12),
      'course-sequencing': lambda: scene_group(1200, 900, 13),
      'career-hero': lambda: scene_window(900, 1100, [('warrior', .5, .93, .46, False)], 14, True, '#f1c98c', 2),
      'career-syllabus': lambda: scene_window(1000, 750, [('lotusprayer', .38, .94, .26, False), ('lotus', .68, .94, .24, True)], 15, True, '#f1c98c', 3),
      'founder': lambda: scene_window(900, 1100, [('lotusprayer', .5, .9, .3, False)], 16, True, '#f1c98c', 2),
      'space-shala': lambda: scene_window(900, 1100, None, 17, True, '#f1c98c', 3),
      'space-dome': lambda: scene_dome(900, 1100, 18),
      'space-tea': lambda: scene_pavilion(900, 1100, 19),
      'life-deck': lambda: scene_deck(1400, 900, 20),
      'life-tea': lambda: scene_ayur(900, 700, 21),
      'life-bowls': lambda: scene_bowls(900, 700, 22),
      'life-yin': lambda: scene_window(900, 700, [('child', .5, .93, .2, False)], 23, True, '#f1c98c', 3),
      'life-garden': lambda: scene_botanical(900, 700, 24, [('prayer', .45, .96, .6, False)]),
      'life-pond': lambda: scene_pond(900, 700, 25),
      'g-bhavana': lambda: scene_dawn(1000, 1100, [('tree', .5, .9, .44, False)], 26, (.3, .52)),
      'g-shala': lambda: scene_window(1000, 1100, None, 27, True, '#f1c98c', 3),
      'g-bowls': lambda: scene_bowls(1000, 1100, 28),
      'g-aarti': lambda: scene_water(1000, 1100, 29),
      'g-ayur': lambda: scene_ayur(1000, 1100, 30),
      'g-cohort': lambda: scene_group(1000, 1100, 31),
      'g-vagus': lambda: scene_ripples(1000, 1100, 32),
      'g-yin': lambda: scene_window(1000, 1100, [('child', .5, .93, .2, False)], 33, True, '#e8d3a0', 4, .8),
      'g-garden': lambda: scene_botanical(1000, 1100, 34, [('prayer', .5, .95, .55, False)]),
      'rk-bridge': lambda: scene_bridge(1600, 900, 70),
      'rk-bridge-dusk': lambda: scene_bridge(1400, 900, 71, dusk=True),
      'rk-aarti': lambda: scene_water(1400, 900, 72),
      'rk-ganga': lambda: scene_dawn(1400, 900, [('lotus', .2, .9, .16, False)], 73, (.7, .5)),
      'rk-hills': lambda: scene_dawn(1600, 700, [('tree', .3, .9, .3, False)], 74, (.5, .5)),
      'rk-yogapeeth': lambda: scene_window(1000, 1100, [('warrior', .5, .93, .46, False)], 75, True, '#f6d49a', 3),
      'rk-cafe': lambda: scene_pavilion(1000, 800, 76),
      'rk-spice': lambda: scene_ayur(1000, 800, 77),
      'rk-grove': lambda: scene_botanical(1000, 800, 78, [('lotusprayer', .5, .95, .3, False)]),
      'rk-cave': lambda: scene_dome(1000, 800, 79),
      'rk-ridge': lambda: scene_dawn(1000, 1100, [('prayer', .5, .9, .4, False)], 80, (.4, .55)),
      'rk-rooms': lambda: scene_window(1000, 800, None, 81, True, '#f1c98c', 2),
      'tour360': lambda: scene_dome(1100, 760, 35),
      'cta-bg': lambda: scene_dawn(1600, 700, None, 36, (.75, .55)),
      'map': lambda: scene_map(900, 500, 37),
      'contact-hero': lambda: scene_window(1600, 700, [('lotusprayer', .72, .92, .26, False)], 40, True, '#f1c98c', 4),
      'courses-hero': lambda: scene_dawn(1600, 700, [('lotus', .74, .9, .2, False)], 41, (.3, .5)),
      'about-hero': lambda: scene_dawn(1600, 700, [('tree', .7, .9, .34, False)], 42, (.62, .5)),
      'day-dawn': lambda: scene_dawn(900, 700, [('lotus', .5, .9, .22, False)], 43, (.5, .55)),
      'day-sadhana': lambda: scene_window(900, 700, [('warrior', .5, .93, .5, False)], 44, True, '#f6d49a', 3),
      'day-chai': lambda: scene_pavilion(900, 700, 45),
      'day-lunch': lambda: scene_ayur(900, 700, 46),
      'day-sound': lambda: scene_bowls(900, 700, 47, True),
      'day-nidra': lambda: scene_pond(900, 700, 48),
      'event-1': lambda: scene_water(900, 700, 49),
      'event-2': lambda: scene_dome(900, 700, 50),
      'event-3': lambda: scene_botanical(900, 700, 51, [('lotusprayer', .5, .95, .3, False)]),
      'about-kitchen': lambda: scene_ayur(1000, 800, 52),
      'about-land': lambda: scene_pond(1000, 800, 53),
      'about-lineage': lambda: scene_dawn(1000, 800, [('tree', .5, .9, .4, False)], 54, (.3, .5)),
      'step-1': lambda: scene_window(900, 700, None, 55, True, '#f1c98c', 3),
      'step-2': lambda: scene_deck(900, 700, 56),
      'step-3': lambda: scene_dawn(900, 700, [('lotus', .5, .88, .24, False)], 57, (.5, .5)),
      'person-0': lambda: bust(400, 400, 'long', 5), 'person-1': lambda: bust(400, 400, 'beard', 6), 'person-2': lambda: bust(400, 400, 'bun', 7),
      'person-3': lambda: bust(400, 400, 'bald', 4), 'person-4': lambda: bust(400, 400, 'bun', 8), 'person-5': lambda: bust(400, 400, 'long', 9),
      'faculty-0': lambda: bust(500, 600, 'long', 0), 'faculty-1': lambda: bust(500, 600, 'beard', 1),
      'faculty-2': lambda: bust(500, 600, 'bun', 2), 'faculty-3': lambda: bust(500, 600, 'bald', 3),
      'faculty-4': lambda: bust(500, 600, 'long', 1), 'faculty-5': lambda: bust(500, 600, 'beard', 2),
    }
    only = [a for a in sys.argv[2:]]
    for name, fn in S.items():
        if only and name not in only: continue
        print('  still', name, flush=True)
        img = fn()
        if name == 'hero-poster': save(img, name, kinds=('webp', 'jpg'))
        elif name == 'og': save(img, name, kinds=('jpg',), sm=False)
        elif name == 'map': save(img, name, sm=False)
        else: save(img, name)

# ---------- hero film (seamless 12 s loop, 24 fps) ----------
def video():
    W, H, FPS, SEC = 1280, 720, 24, 12; N = FPS * SEC
    print('  video: rendering', N, 'frames', flush=True)
    sky = sky_sun(W, H, '#27402f', '#b9a36a', '#f6d79b', (W * .34, H * .47), H * .045, '#ffd48a')
    ridge_specs = [(H * .55, H * .13, '#9bab7e', '#6f8d62', .55), (H * .63, H * .12, '#6e8a5c', '#476343', .6), (H * .74, H * .1, '#44603b', '#2d4529', .6)]
    far = ridges(sky.copy(), ridge_specs[:1], W, H, False, 15)
    mid = ridges(far.copy(), ridge_specs[1:2], W, H, False, 15 + 3) if False else None
    # build layered scene without mist first; mist added per-frame as moving layers
    base1 = ridges(sky.copy(), ridge_specs[:1], W, H, False, 15)
    mA = fractal2(W, H, 170, 4, 41, True); mB = fractal2(W, H, 120, 4, 43, True); mC = fractal2(W, H, 260, 3, 47, True)
    yy = np.arange(H)[:, None].astype(np.float32)
    bandA = np.exp(-((yy - H * .6) / (H * .07)) ** 2); bandB = np.exp(-((yy - H * .7) / (H * .06)) ** 2); bandC = np.exp(-((yy - H * .8) / (H * .08)) ** 2)
    ridge2, _ = ridge_mask(W, H, ridge_specs[1][0], ridge_specs[1][1], 18, 6, .55); ridge3, _ = ridge_mask(W, H, ridge_specs[2][0], ridge_specs[2][1], 21, 6, .55)
    ridge4, _ = ridge_mask(W, H, H * .88, H * .08, 24, 6, .55)
    col2 = vgrad(W, H, [(0, '#6e8a5c'), (1, '#476343')]); col3 = vgrad(W, H, [(0, '#44603b'), (1, '#2d4529')]); col4 = vgrad(W, H, [(0, '#27391f'), (1, '#16230f')])
    motes = [(RNG.random() * W, RNG.random() * H, .6 + RNG.random() * 1.2, int(1 + RNG.integers(0, 3)), RNG.random() * math.tau) for _ in range(46)]
    ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                           '-c:v', 'libx264', '-preset', 'slow', '-crf', '27', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', os.path.join(OUT, 'hero.mp4')], stdin=subprocess.PIPE)
    for f in range(N):
        t = f / N; ph = t * math.tau
        breath = .5 - .5 * math.cos(ph * 2)          # two slow breaths per loop (6 s each)
        img = base1.copy()
        img += glow(W, H, W * .34, H * .47, H * .5, '#ffd9a0', .22 * breath, 2)    # sun swells on the inhale
        img = over(img, '#f1e3c0', np.clip(np.roll(mA, int(W * t), 1) * bandA * .55, 0, 1) * .8)
        img = img * (1 - ridge2[..., None]) + col2 * ridge2[..., None]
        img = over(img, '#f1e3c0', np.clip(np.roll(mB, -int(W * t), 1) * bandB * .6, 0, 1) * .8)
        img = img * (1 - ridge3[..., None]) + col3 * ridge3[..., None]
        img = over(img, '#f1e3c0', np.clip(np.roll(mC, int(W * t), 1) * bandC * .5, 0, 1) * .7)
        img = img * (1 - ridge4[..., None]) + col4 * ridge4[..., None]
        # god-rays
        rays = np.zeros((H, W), np.float32)
        xs = np.arange(W)[None, :].astype(np.float32)
        for k, a in enumerate((-.55, -.2, .15, .5)):
            rays += np.clip(np.cos((xs - W * .34 - a * yy) / (W * .045) + k * 1.7), 0, 1) ** 6 * (.5 + .5 * math.sin(ph * 2 + k))
        img += (rays * np.clip(1 - yy / (H * .9), 0, 1) * .05)[..., None] * hexc('#ffe2a8')
        # meditating figure — chest rises on each inhale
        img = put_fig(img, 'lotus', W * .7, H * .91, H * .22, DEEP, .97, False, '#ffd6a0', breathe=.006 * breath)
        # drifting motes (periodic)
        for (mx, my, s, sp, phz) in motes:
            x = (mx + math.sin(ph * 2 + phz) * 18) % W; y = (my - sp * H * t * 1.0) % H
            x0, y0, r = int(x), int(y), int(10 * s)
            ya, yb, xa, xb = max(0, y0 - r), min(H, y0 + r), max(0, x0 - r), min(W, x0 + r)
            if yb > ya and xb > xa:
                gy, gx = np.mgrid[ya:yb, xa:xb]; g = np.exp(-(((gx - x) ** 2 + (gy - y) ** 2) / (2 * (s * 1.6) ** 2)))
                img[ya:yb, xa:xb] += g[..., None] * hexc('#ffe9b8') * .55
        img = grain(vignette(img, .32), .014, f)
        ff.stdin.write((np.clip(img, 0, 1) * 255).astype(np.uint8).tobytes())
        if f % 48 == 0: print('   frame', f, flush=True)
    ff.stdin.close(); ff.wait()
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', os.path.join(OUT, 'hero.mp4'), '-vf', 'scale=854:-2', '-c:v', 'libx264', '-preset', 'slow', '-crf', '29', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', os.path.join(OUT, 'hero-sm.mp4')], check=True)
    print('  video done')

# ---------- secondary ambient loops (8 s, seamless) ----------
def video2(name, base_fn, seed=3, W=960, H=540, FPS=24, SEC=8):
    N = FPS * SEC
    base = base_fn(int(W * 1.12), int(H * 1.12)); bh, bw = base.shape[:2]
    mA = fractal2(W, H, 160, 4, seed + 1, True); mB = fractal2(W, H, 110, 4, seed + 7, True)
    yy = np.arange(H)[:, None].astype(np.float32)
    bandA = np.exp(-((yy - H * .62) / (H * .09)) ** 2); bandB = np.exp(-((yy - H * .8) / (H * .1)) ** 2)
    motes = [(RNG.random() * W, RNG.random() * H, .6 + RNG.random() * 1.1, int(1 + RNG.integers(0, 3)), RNG.random() * math.tau) for _ in range(34)]
    ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                           '-c:v', 'libx264', '-preset', 'slow', '-crf', '28', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', os.path.join(OUT, name + '.mp4')], stdin=subprocess.PIPE)
    for f in range(N):
        t = f / N; ph = t * math.tau
        z = .5 - .5 * math.cos(ph)                                   # slow push-in and back out
        cw, ch = int(W + (bw - W) * (1 - z) * .9), int(H + (bh - H) * (1 - z) * .9)
        x0 = (bw - cw) // 2 + int(math.sin(ph) * (bw - cw) * .25); y0 = (bh - ch) // 2
        crop = np.clip(base[y0:y0 + ch, x0:x0 + cw], 0, 1)
        img = np.asarray(Image.fromarray((crop * 255).astype(np.uint8)).resize((W, H), Image.BILINEAR), np.float32) / 255
        img = over(img, '#f1e3c0', np.clip(np.roll(mA, int(W * t), 1) * bandA * .5, 0, 1) * .7)
        img = over(img, '#f1e3c0', np.clip(np.roll(mB, -int(W * t), 1) * bandB * .5, 0, 1) * .6)
        img = img * (1 + .05 * (.5 - .5 * math.cos(ph * 2)))
        for (mx, my, s_, sp, phz) in motes:
            x = (mx + math.sin(ph * 2 + phz) * 14) % W; y = (my - sp * H * t) % H
            x0_, y0_, r = int(x), int(y), int(9 * s_)
            ya, yb, xa, xb = max(0, y0_ - r), min(H, y0_ + r), max(0, x0_ - r), min(W, x0_ + r)
            if yb > ya and xb > xa:
                gy, gx = np.mgrid[ya:yb, xa:xb]; g = np.exp(-(((gx - x) ** 2 + (gy - y) ** 2) / (2 * (s_ * 1.5) ** 2)))
                img[ya:yb, xa:xb] += g[..., None] * hexc('#ffe9b8') * .5
        img = grain(vignette(img, .3), .014, f)
        ff.stdin.write((np.clip(img, 0, 1) * 255).astype(np.uint8).tobytes())
    ff.stdin.close(); ff.wait()
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', '0.5', '-i', os.path.join(OUT, name + '.mp4'), '-frames:v', '1', os.path.join(OUT, name + '-poster.jpg')], check=True)
    print('  video2 done', name)

def videos2():
    only = sys.argv[2:]
    clips = {'calm': (lambda w, h: scene_pond(w, h, 61), 3), 'bowls': (lambda w, h: scene_bowls(w, h, 62), 5), 'deck': (lambda w, h: scene_deck(w, h, 63), 8),
             'ganga-aarti': (lambda w, h: scene_water(w, h, 64), 9), 'bridge': (lambda w, h: scene_bridge(w, h, 65), 11), 'ganga-dawn': (lambda w, h: scene_dawn(w, h, [('lotus', .22, .9, .16, False)], 66, (.7, .5)), 13)}
    for k, (fn, sd) in clips.items():
        if only and k not in only: continue
        if not only and k in ('ganga-aarti', 'bridge', 'ganga-dawn'): pass
        video2(k, fn, sd)

if __name__ == '__main__':
    what = sys.argv[1] if len(sys.argv) > 1 else 'all'
    if what in ('all', 'stills'): stills()
    if what in ('all', 'video'): video()
    if what in ('all', 'video2'): videos2()
