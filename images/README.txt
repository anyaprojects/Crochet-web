ANANYA — Portfolio images
==========================

These photos are already placed and wired into the site:

    hero.jpg            → the fixed full-screen background (Luna, on the table)
    gallery-01.jpg      → Luna the Friendly Witch (gallery card + pop-up)
    gallery-02.jpg      → Otti (the "Next make" card — Ananya hugging Otti)
    portrait-maker.jpg  → Ananya's portrait, in the "The Maker" section

To REPLACE any photo, just save a new image over the same filename here
(same name, .jpg). No code changes needed.

To ADD a new finished piece to the gallery
-------------------------------------------
1. Save its photo here as gallery-03.jpg (portrait orientation looks best,
   about 1200x1500px).
2. In index.html, find one of the "New piece coming soon" tiles
   (<div class="piece piece--soon" ...>) and replace it with a copy of the
   Luna card (<button class="piece" ...>), updating:
     - style="--photo:url('images/gallery-03.jpg')"
     - data-title, data-yarn, data-stitch, data-story
     - the name and tag shown at the bottom of the card
That's it — the pop-up reads everything from those data- fields.

Photo tips
----------
• hero.jpg: a calm, slightly soft shot works best (the title sits over it).
• gallery + portrait: portrait orientation, ~1200px on the long edge.
• If you'd rather use .png or .webp, change the filename in index.html to match.
