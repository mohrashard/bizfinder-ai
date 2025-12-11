
try:
    with open(r"c:\Users\User\bizfinder-ai\app\finder\page.tsx", "r", encoding="utf-8") as f:
        lines = f.readlines()
        # 1160 is 1-based index, so 1159 in 0-based
        if len(lines) > 1159:
            print(f"Line 1160: {lines[1159]}")
            # check surrounding lines too
            print(f"Line 1159: {lines[1158]}")
            print(f"Line 1161: {lines[1160]}")
except Exception as e:
    print(e)
