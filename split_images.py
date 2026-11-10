
from PIL import Image
from pathlib import Path

# Input collage
image_path = Path("static/images/meal-360/paneer-biryani/paneer-biryani-sheet.png")

# Output folder
output_folder = image_path.parent

# Open the collage
image = Image.open(image_path).convert("RGB")

width, height = image.size

# The collage contains 4 columns and 3 rows
columns = 4
rows = 3

cell_width = width / columns
cell_height = height / rows

frame_number = 1
margin = 8

for row in range(rows):
    for column in range(columns):

        left = int(column * cell_width) + margin
        top = int(row * cell_height) + margin
        right = int((column + 1) * cell_width) - margin
        bottom = int((row + 1) * cell_height) - margin

        frame = image.crop((left, top, right, bottom))

        filename = output_folder / f"{frame_number:02d}.jpg"
        frame.save(filename, "JPEG", quality=95)

        print(f"Created: {filename}")

        frame_number += 1

print("\nSuccessfully created all 12 frames!")
