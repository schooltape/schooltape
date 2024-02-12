# This script is for generating themes with whiskers

import platform, os, subprocess

plat = platform.system()
print(f"Platform: {plat}")
script_dir = os.path.dirname(os.path.realpath(__file__))
print(f"Script Directory: {script_dir}")

def search_files(search):
    files = os.listdir(script_dir)
    # print(files)
    for file in files:
        if search in file.lower():
            # print("Found:", file)
            return file

# def whiskers(path: str, args: list):
#     try:
#         subprocess.run([path] + args, check=True)
#     except subprocess.CalledProcessError as e:
#         print("Error running executable:", e)    

def gen(flavours, accents):
    for flavour in flavours:
        for accent in accents:
            # file_path = f"{script_dir}/{flavour}/{accent}.css"
            # with open(file_path, "w") as file:
            #     pass
            # whiskers(whiskers_path, [f"--output-path {script_dir}/{flavour}/{accent}.css", f"--overrides '{{'accent': '{{{accent}}}'}}'", template_path, flavour ])
            # whiskers(whiskers_path, [  f"-o {script_dir}/{flavour}/{accent}.css", template_path, flavour ])
            command = f"{whiskers_path} -o {script_dir}/{flavour}/{accent}.css --override accent={accent} {template_path} {flavour}"
            subprocess.run(command, shell=True)
            print(f"\ngenerated catppuccin-{flavour}-{accent}")

whiskers_path = f"{script_dir}/{search_files(plat.lower())}"
print(f"\nwhiskers_path: {whiskers_path}")

template_path = f"{script_dir}/{search_files('.hbs')}"
print(f"template_path: {template_path}\n")

flavours = ["latte", "frappe", "macchiato", "mocha"]
accents = ["rosewater", "flamingo", "pink", "mauve", "red", "maroon", "peach", "yellow", "green", "teal", "sky", "sapphire", "blue", "lavender"]
gen(flavours, accents)