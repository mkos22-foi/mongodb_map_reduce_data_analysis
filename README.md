# Aplikacija za analizu velikih količina podataka
> Aplikacija za analizu velikih količina podataka (NoSQL, map/reduce) - polustrukturirane baze podataka - MongoDB + sučelje na neki tablični kalkulator (Jupyter Notebook)

**Tehnologije:**
- MongoDB
- MapReduce (JavaScript)
- Python
- Jupyter Notebook

## Struktura projekta
```
├── data/                    # Početni i finalni skupovi podataka
├── database/                # Exportane MongoDB kolekcije (rezultati MapReduce upita)
├── main.ipynb               # Glavna Jupyter notebook aplikacija
├── requirements.txt         # Python ovisnosti
└──README.md                 # Upute za pokretanje projekta
```

## Upute za pokretanje

### 1) Kreiranje virtualnog okruženja (venv)

U root folderu projekta pokrenuti:

```bash
python3 -m venv venv
source venv/bin/activate
```

### 2) Instalacija potrebnih paketa
```bash
pip install -r requirements.txt
```
### 3) Pokretanje MongoDB servera
```bash
sudo systemctl start mongod
```

### 4) Konfiguracija konekcije u Pythonu
U datoteci `main.ipynb` potrebno je promijeniti konfiguraciju konekcije na localhost računala s kojeg se projekt pokreće

### 5) Pokretanje aplikacije
Aplikacija se pokreće preko `main.ipynb` datoteke. Potrebno je redom pokretati ćelije.

### 6) Map/Reduce funkcije
MapReduce funkcije napisane su u JavaScript jeziku i pokreću se u MongoDB shellu, a ne u Pythonu.
Nakon izvršavanja Map/Reduce funkcija, ćelije u `.ipynb` datoteci se mogu nastaviti izvršavati kako bi se dobili statistički i grafički rezultati.
