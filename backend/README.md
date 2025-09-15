## Steps to start flask

### 1. Install first the virtual environment (Make sure you have virutalenv installed)

```bash
virtualenv .venv
```
".venv" can be whatever name you want but .venv is the standard way

#

### 2. Activate the .venv
```bash
.venv/Scripts/activate
```
You'll know you have .venv activate if you have (.venv) at the left side in the terminal

#

### 3. Instal the Requirements
```bash
pip install -r requirements.txt
```
This installs all the modules within the requirements.txt\
The requirements.txt is provided by the dev
#

### 3.1 Optionally you can upadte the requirements.txt if you have modified the modules in you flask project
```bash
pip freeze > requirements.txt
```

#

### 4. If the modules are not loading properly or the imports are showing an error. You need to change interpreters
In Vscode(yea since i use vscode).\
Open the command pallete (ctrl + shift + P)\
type "interpreter" and you will see "Python: Select Intepreer"\
Choose the one with the (.venv)\
This ensures that your interpreter is using the modules that you have installed in your .venv folder

