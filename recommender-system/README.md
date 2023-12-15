# **Installation**

- For Windows:

```sh
python -m venv .venv
& .venv/Scripts/Activate.ps1
pip install -r requirements.txt
```

- For Ubuntu:

```sh
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

# **Run App**

```sh
uvicorn main:app
```

# **Build Docker Image**

```sh
docker build -t recommender-system:latest .
```
