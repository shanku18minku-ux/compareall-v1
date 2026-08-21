import google.generativeai as genai
import os
import time

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
print("Uploading video...")
video_file = genai.upload_file("C:\\Users\\HP\\Desktop\\vid16.mp4")

while video_file.state.name == "PROCESSING":
    print('.', end='', flush=True)
    time.sleep(2)
    video_file = genai.get_file(video_file.name)
print(f"\nVideo processing complete: {video_file.state.name}")

model = genai.GenerativeModel(model_name="gemini-2.5-pro")
prompt = "Watch this screen recording of a React Native app named CompareAll. The app searches multiple food delivery platforms (like Swiggy, Zomato, etc.) simultaneously. The user wants to know what issues are visible in this video. Please list EVERY issue you can see (UI glitches, loading issues, missing data, incorrect behavior, layout problems). For each issue, provide a potential technical solution."

print("Analyzing video...")
response = model.generate_content([video_file, prompt], request_options={"timeout": 600})
print("\n--- ANALYSIS RESULT ---")
print(response.text)
