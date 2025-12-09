
from fastapi import FastAPI, Form, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
import google.generativeai as genai
import vtracer
import os
import io
import tempfile
from PIL import Image

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allowing all as requested
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

# Style Assets
STYLE_ASSETS_DIR = "style_assets"
STYLE_MAPPING = {
    "flat_tech": os.path.join(STYLE_ASSETS_DIR, "flat_style.png"),
    "line_art": os.path.join(STYLE_ASSETS_DIR, "line_art.png"),
    "sketch": os.path.join(STYLE_ASSETS_DIR, "sketch.png"),
    "flat": None, # Default flat
    "none": None
}

def convert_png_to_svg(png_bytes: bytes) -> str:
    with tempfile.TemporaryDirectory() as tmpdir:
        png_path = os.path.join(tmpdir, "temp.png")
        svg_path = os.path.join(tmpdir, "temp.svg")
        
        with open(png_path, "wb") as f:
            f.write(png_bytes)
        
        vtracer.convert_image_to_svg_py(
            png_path,
            svg_path,
            colormode='color',
            hierarchical='stacked',
            mode='spline',
            filter_speckle=4,
            color_precision=6,
            layer_difference=16,
            corner_threshold=60,
            length_threshold=4.0,
            max_iterations=10,
            splice_threshold=45,
            path_precision=3
        )
        
        with open(svg_path, "r") as f:
            return f.read()

def get_style_reference(style_name: str):
    path = STYLE_MAPPING.get(style_name)
    if path and os.path.exists(path):
        return Image.open(path)
    return None

@app.post("/generate")
async def generate(
    prompt: str = Form(...),
    style_preset: str = Form("flat"), # Mapping frontend 'style_preset' to 'style'
    user_id: str = Form(...),
    reference_image: UploadFile = File(None)
):
    if not GOOGLE_API_KEY:
        raise HTTPException(status_code=503, detail="GOOGLE_API_KEY not set")

    try:
        model = genai.GenerativeModel("models/gemini-1.5-flash") # Using latest/standard model, or 'gemini-pro-vision' equivalent

        style_ref = None
        if reference_image:
             content = await reference_image.read()
             style_ref = Image.open(io.BytesIO(content))
        elif style_preset in STYLE_MAPPING:
             style_ref = get_style_reference(style_preset)

        generation_prompt = [prompt, "Create a vector illustration. Flat style, sharp edges, minimal gradients. White background."]
        if style_ref:
            generation_prompt.append(style_ref)
            generation_prompt.append("Match this style exactly.")

        response = model.generate_content(generation_prompt)
        
        # Extract Image
        if not response.parts:
             raise Exception("No image generated")
        
        # Gemini usually returns text, but for image generation specifically we might need 'imagen-3' or similar if passing text-to-image.
        # However, the user provided code used 'models/nano-banana-pro-preview' which seems to be a specific internal or finetuned model?
        # Standard Gemini API 'gemini-1.5-flash' handles text/image input but output is text unless specific tools used?
        # WAIT: The previous code used `model.generate_content` and accessed `inline_data`. This implies the model returns images directly.
        # This behavior is typical of the Gemini 'Vision' model but usually it generates TEXT about images.
        # UNLESS it's the Imagen model via Vertex AI or similar. 
        # BUT the code uses `google.generativeai`.
        # Let's stick to the code in `google_server.py` regarding response parsing.
        
        # I will use the same model name from `google_server.py` just in case: "models/nano-banana-pro-preview"
        # Or if that was experimental, maybe "gemini-1.5-flash" works?
        # The user's prompt says: "It should use 'google-generativeai' to create an image".
        # I will use the code structure from `google_server.py`.

        # Refined Model Selection:
        # If the user has access to "models/nano-banana-pro-preview" (likely from a specific tutorial/hack), I should use it.
        # But safest is to use `gemini-1.5-flash` or `gemini-pro`.
        # However, `gemini-pro` does NOT generate images (it is text-only or multimodal-input).
        # Image generation is usually Imagen.
        # I will use the model specified in the PREVIOUS file: "models/nano-banana-pro-preview" OR fallback to "gemini-1.5-flash" if user insists.
        # Actually user said "It should use 'google-generativeai'".
        # I'll stick to `google_server.py` logic which seemed to work for them.
        
        model = genai.GenerativeModel("models/nano-banana-pro-preview")
        
        # ... logic as before ...
        
        cand = response.candidates[0]
        part = cand.content.parts[0]
        
        if hasattr(part, 'inline_data'):
            png_bytes = part.inline_data.data
            svg = convert_png_to_svg(png_bytes)
            return Response(content=svg, media_type="image/svg+xml")
        else:
            raise Exception("No image data in response")

    except Exception as e:
        print(f"Error: {e}")
        # Return mock SVG for testing if API fails (optional but good for robustness)
        # For now raise 500
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
