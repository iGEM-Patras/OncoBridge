import sqlite3
import random
import os

DB_NAME = "oncobridge.db"

def init_db():
    # Drop existing db to reset
    if os.path.exists(DB_NAME):
        os.remove(DB_NAME)
        
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    # Create Doctors table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS doctors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            specialty TEXT NOT NULL,
            hospital TEXT NOT NULL,
            location TEXT NOT NULL,
            bio TEXT NOT NULL,
            rating REAL,
            image_url TEXT
        )
    ''')
    
    # Create Posts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            author_name TEXT NOT NULL,
            content TEXT NOT NULL,
            language TEXT NOT NULL,
            likes INTEGER DEFAULT 0,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Seed Doctors (Greek names and locations)
    first_names = ['Γιώργος', 'Κώστας', 'Νίκος', 'Δημήτρης', 'Γιάννης', 'Μαρία', 'Ελένη', 'Κατερίνα', 'Αναστασία', 'Σοφία']
    last_names = ['Παπαδόπουλος', 'Οικονόμου', 'Μακρής', 'Γεωργίου', 'Αντωνίου', 'Καραμανλής', 'Στεργίου', 'Μπαλτάς', 'Σαμαράς', 'Νικολάου']
    specialties = ['Παθολόγος Ογκολόγος', 'Ακτινοθεραπευτής Ογκολόγος', 'Χειρουργός Ογκολόγος', 'Αιματολόγος', 'Παιδοογκολόγος']
    hospitals = ['Νοσοκομείο Άγιος Σάββας', 'Αντικαρκινικό Θεαγένειο', 'Ογκολογικό Μεταξά', 'Ιατρικό Κέντρο Αθηνών', 'Ευαγγελισμός']
    locations = ['Αθήνα', 'Θεσσαλονίκη', 'Πάτρα', 'Ηράκλειο', 'Λάρισα']
    
    doctors_data = []
    for _ in range(30):
        name = f"Dr. {random.choice(first_names)} {random.choice(last_names)}"
        specialty = random.choice(specialties)
        hospital = random.choice(hospitals)
        location = random.choice(locations)
        rating = round(random.uniform(3.5, 5.0), 1)
        bio = f"Ο/Η {name} είναι εξειδικευμένος/η {specialty} στο {hospital} με πάνω από {random.randint(5, 25)} χρόνια εμπειρίας στην αντιμετώπιση περίπλοκων ογκολογικών περιστατικών με σύγχρονες θεραπείες."
        image_url = f"https://api.dicebear.com/7.x/notionists/svg?seed={name.replace(' ', '')}"
        
        doctors_data.append((name, specialty, hospital, location, bio, rating, image_url))
        
    cursor.executemany('''
        INSERT INTO doctors (name, specialty, hospital, location, bio, rating, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', doctors_data)
    
    # Seed Posts (English and Greek)
    english_posts = [
        ("Maria G.", "Just finished my 3rd round of chemo. Feeling exhausted but staying positive. Thank you to everyone for the support!", "en"),
        ("Tom H.", "Does anyone have recommendations for managing nausea? Ginger tea has been helping me a bit.", "en"),
        ("Linda S.", "Ringing the bell today! 🔔 It has been a long 6 months but I am finally cancer-free. Keep fighting everyone!", "en"),
        ("James W.", "Started radiation therapy this week. The staff at Hope Cancer Institute is amazing.", "en"),
        ("Elena D.", "Joining this group for the first time. Diagnosed last week and feeling overwhelmed. How did you all cope at the beginning?", "en")
    ]
    
    greek_posts = [
        ("Μαρία Γ.", "Μόλις τελείωσα τον 3ο κύκλο χημειοθεραπείας. Νιώθω εξαντλημένη αλλά παραμένω θετική. Σας ευχαριστώ όλους για την υποστήριξη!", "el"),
        ("Νίκος Π.", "Έχει κανείς προτάσεις για τη διαχείριση της ναυτίας; Το τσάι τζίντζερ με βοηθάει κάπως.", "el"),
        ("Ελένη Κ.", "Χτυπάω την καμπάνα σήμερα! 🔔 Ήταν 6 μεγάλοι μήνες αλλά επιτέλους είμαι καθαρή. Συνεχίστε τον αγώνα όλοι!", "el"),
        ("Γιώργος Μ.", "Ξεκίνησα ακτινοβολίες αυτή την εβδομάδα. Το προσωπικό είναι καταπληκτικό.", "el"),
        ("Άννα Σ.", "Μπαίνω στην ομάδα για πρώτη φορά. Διαγνώστηκα την προηγούμενη εβδομάδα. Πώς το διαχειριστήκατε όλοι στην αρχή;", "el")
    ]
    
    all_posts = []
    for post in english_posts + greek_posts:
        likes = random.randint(0, 25)
        all_posts.append((post[0], post[1], post[2], likes))
        
    random.shuffle(all_posts)
    
    cursor.executemany('''
        INSERT INTO posts (author_name, content, language, likes)
        VALUES (?, ?, ?, ?)
    ''', all_posts)
    
    print(f"Inserted {len(doctors_data)} doctors and {len(all_posts)} posts into the database.")

    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
