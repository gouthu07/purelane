import json
import os
import re

index_path = 'templates/index.json'
with open(index_path, 'r') as f:
    content = f.read()

# Strip block comments
content_no_comments = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)

data = json.loads(content_no_comments)

for section_id, section in data.get('sections', {}).items():
    if section.get('type') == 'bundles':
        section['blocks'] = {
            "tier_1": {
                "type": "tier",
                "settings": {
                    "tag": "Starter",
                    "product_count": 2,
                    "bundle_price": 349,
                    "original_price": 598,
                    "img_class_1": "p-combo2",
                    "feature_1": "Pick any two products",
                    "feature_2": "Free shipping across India"
                }
            },
            "tier_2": {
                "type": "tier",
                "settings": {
                    "tag": "Most popular",
                    "is_best": True,
                    "product_count": 3,
                    "bundle_price": 499,
                    "original_price": 897,
                    "img_class_1": "p-kitchen",
                    "img_class_2": "p-tap",
                    "img_class_3": "p-dish",
                    "feature_1": "Pick any three products",
                    "feature_2": "Covers kitchen and laundry",
                    "feature_3": "Free shipping across India"
                }
            },
            "tier_3": {
                "type": "tier",
                "settings": {
                    "tag": "Whole home",
                    "product_count": 5,
                    "bundle_price": 799,
                    "original_price": 1495,
                    "img_class_1": "p-kitchen",
                    "img_class_2": "p-tap",
                    "img_class_3": "p-floor",
                    "img_class_4": "p-toilet",
                    "img_class_5": "p-laundry",
                    "feature_1": "Pick any five products",
                    "feature_2": "Every room in one order",
                    "feature_3": "Free shipping across India"
                }
            }
        }
        section['block_order'] = ["tier_1", "tier_2", "tier_3"]
    
    elif section.get('type') == 'combo-builder':
        section['blocks'] = {
            "combo_1": {
                "type": "combo",
                "settings": {
                    "title": "Kitchen essentials",
                    "product_count": 3,
                    "bundle_price": 499,
                    "original_price": 897,
                    "save_badge_text": "You save ₹398",
                    "flag_text": "Most popular",
                    "img_class_1": "p-kitchen",
                    "reason_1": "Cuts grease instantly",
                    "img_class_2": "p-dish",
                    "reason_2": "Squeaky clean dishes",
                    "img_class_3": "p-tap",
                    "reason_3": "Melts hard water stains"
                }
            },
            "combo_2": {
                "type": "combo",
                "settings": {
                    "title": "Complete home bundle",
                    "is_hero": True,
                    "product_count": 5,
                    "bundle_price": 799,
                    "original_price": 1495,
                    "save_badge_text": "Biggest saving",
                    "flag_text": "Best value",
                    "img_class_1": "p-kitchen",
                    "reason_1": "Cuts grease instantly",
                    "img_class_2": "p-floor",
                    "reason_2": "Kills 99.9% germs",
                    "img_class_3": "p-handwash",
                    "reason_3": "Gentle hydration for hands"
                }
            }
        }
        section['block_order'] = ["combo_1", "combo_2"]

new_content = "/*\n * ------------------------------------------------------------\n * IMPORTANT: The contents of this file are auto-generated.\n *\n * This file may be updated by the Shopify admin theme editor\n * or related systems. Please exercise caution as any changes\n * made to this file may be overwritten.\n * ------------------------------------------------------------\n */\n" + json.dumps(data, indent=2)

with open(index_path, 'w') as f:
    f.write(new_content)

print("Updated templates/index.json successfully.")
