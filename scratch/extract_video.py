import cv2
import os

def extract_frames(video_path, output_dir, prefix):
    os.makedirs(output_dir, exist_ok=True)
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    count = 0
    frame_count = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        if count % int(fps * 2) == 0: # Every 2 seconds
            cv2.imwrite(os.path.join(output_dir, f"{prefix}_{frame_count}.jpg"), frame)
            frame_count += 1
        count += 1
    cap.release()

output = "C:\\Users\\HP\\.gemini\\antigravity\\brain\\a70a8866-702e-460b-974d-8a9d0be87042\\.tempmediaStorage\\video_frames"
extract_frames("C:\\Users\\HP\\Desktop\\vid12.mp4", output, "vid12")
extract_frames("C:\\Users\\HP\\Desktop\\vid13.mp4", output, "vid13")
print("Frames extracted successfully!")
