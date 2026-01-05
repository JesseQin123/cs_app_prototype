#!/usr/bin/env python3
"""
CLIP Image Embedding Service for CrownSync Asset Catalog
Generates CLIP embeddings for uploaded images
"""

from flask import Flask, request, jsonify
from PIL import Image
import torch
import clip
import io
import sys

app = Flask(__name__)

# Load CLIP model
print("Loading CLIP model...")
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)
print(f"CLIP model loaded successfully on {device}")

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "ok",
        "device": device,
        "model": "ViT-B/32",
        "embedding_dimension": 512
    })

@app.route('/embed', methods=['POST'])
def embed_image():
    """Generate CLIP embedding for an uploaded image"""
    try:
        # Check if image file is present
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400

        file = request.files['image']

        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        # Read and preprocess image
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')

        # Preprocess and generate embedding
        image_input = preprocess(image).unsqueeze(0).to(device)

        with torch.no_grad():
            image_features = model.encode_image(image_input)
            # Normalize the features
            image_features = image_features / image_features.norm(dim=-1, keepdim=True)

        # Convert to list for JSON serialization
        embedding = image_features.cpu().numpy()[0].tolist()

        return jsonify({
            "success": True,
            "embedding": embedding,
            "dimension": len(embedding),
            "filename": file.filename
        })

    except Exception as e:
        print(f"Error processing image: {str(e)}", file=sys.stderr)
        return jsonify({"error": str(e)}), 500

@app.route('/embed_batch', methods=['POST'])
def embed_batch():
    """Generate CLIP embeddings for multiple images"""
    try:
        files = request.files.getlist('images')

        if not files:
            return jsonify({"error": "No image files provided"}), 400

        embeddings = []
        filenames = []

        for file in files:
            if file.filename == '':
                continue

            # Read and preprocess image
            image_bytes = file.read()
            image = Image.open(io.BytesIO(image_bytes)).convert('RGB')

            # Preprocess and generate embedding
            image_input = preprocess(image).unsqueeze(0).to(device)

            with torch.no_grad():
                image_features = model.encode_image(image_input)
                # Normalize the features
                image_features = image_features / image_features.norm(dim=-1, keepdim=True)

            embedding = image_features.cpu().numpy()[0].tolist()
            embeddings.append(embedding)
            filenames.append(file.filename)

        return jsonify({
            "success": True,
            "embeddings": embeddings,
            "filenames": filenames,
            "count": len(embeddings)
        })

    except Exception as e:
        print(f"Error processing batch: {str(e)}", file=sys.stderr)
        return jsonify({"error": str(e)}), 500

@app.route('/embed_text', methods=['POST'])
def embed_text():
    """Generate CLIP embedding for text query (for image search)"""
    try:
        data = request.get_json()

        if not data or 'text' not in data:
            return jsonify({"error": "No text provided"}), 400

        text = data['text']

        # Tokenize and encode text
        text_input = clip.tokenize([text]).to(device)

        with torch.no_grad():
            text_features = model.encode_text(text_input)
            # Normalize the features
            text_features = text_features / text_features.norm(dim=-1, keepdim=True)

        # Convert to list for JSON serialization
        embedding = text_features.cpu().numpy()[0].tolist()

        return jsonify({
            "success": True,
            "embedding": embedding,
            "dimension": len(embedding),
            "text": text
        })

    except Exception as e:
        print(f"Error encoding text: {str(e)}", file=sys.stderr)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("=" * 50)
    print("CLIP Embedding Service")
    print("=" * 50)
    print(f"Device: {device}")
    print(f"Model: ViT-B/32")
    print(f"Embedding Dimension: 512")
    print("=" * 50)
    print("Starting server on http://0.0.0.0:5000")
    print("=" * 50)
    app.run(host='0.0.0.0', port=5000, debug=True)
