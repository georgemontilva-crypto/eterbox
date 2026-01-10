from PIL import Image, ImageDraw, ImageFont
import os

# Create output directory
os.makedirs('client/public/icons', exist_ok=True)

# Load the original logo
logo_path = 'client/public/logo.png'
logo = Image.open(logo_path)

# Generate different sizes for PWA icons
sizes = [72, 96, 128, 144, 152, 192, 384, 512]

for size in sizes:
    # Resize logo maintaining aspect ratio
    resized = logo.resize((size, size), Image.Resampling.LANCZOS)
    output_path = f'client/public/icons/icon-{size}x{size}.png'
    resized.save(output_path, 'PNG')
    print(f'Generated: {output_path}')

# Generate maskable icon (with padding for safe area)
maskable_size = 512
padding = int(maskable_size * 0.2)  # 20% padding
maskable_bg = Image.new('RGBA', (maskable_size, maskable_size), (0, 0, 0, 255))
logo_size = maskable_size - (padding * 2)
logo_resized = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
maskable_bg.paste(logo_resized, (padding, padding), logo_resized if logo_resized.mode == 'RGBA' else None)
maskable_bg.save('client/public/icons/icon-maskable-512x512.png', 'PNG')
print('Generated: client/public/icons/icon-maskable-512x512.png')

# Generate splash screens for iOS (with logo + text)
splash_sizes = [
    (640, 1136, 'iphone5'),
    (750, 1334, 'iphone6'),
    (1242, 2208, 'iphone6plus'),
    (1125, 2436, 'iphonex'),
    (1242, 2688, 'iphonexsmax'),
    (828, 1792, 'iphonexr'),
    (1170, 2532, 'iphone12'),
    (1284, 2778, 'iphone12promax'),
]

for width, height, name in splash_sizes:
    # Create splash screen with gradient background
    splash = Image.new('RGB', (width, height), (0, 0, 0))
    draw = ImageDraw.Draw(splash)
    
    # Add gradient effect (simple version)
    for y in range(height):
        gray_value = int(26 * (1 - y / height * 0.3))  # Gradient from #1a1a1a to black
        draw.line([(0, y), (width, y)], fill=(gray_value, gray_value, gray_value))
    
    # Add logo in center
    logo_splash_size = min(width, height) // 4
    logo_splash = logo.resize((logo_splash_size, logo_splash_size), Image.Resampling.LANCZOS)
    logo_x = (width - logo_splash_size) // 2
    logo_y = (height - logo_splash_size) // 2 - logo_splash_size // 4
    
    if logo_splash.mode == 'RGBA':
        splash.paste(logo_splash, (logo_x, logo_y), logo_splash)
    else:
        splash.paste(logo_splash, (logo_x, logo_y))
    
    # Save splash screen
    output_path = f'client/public/icons/splash-{name}.png'
    splash.save(output_path, 'PNG')
    print(f'Generated: {output_path}')

print('\n✅ All PWA icons and splash screens generated successfully!')
