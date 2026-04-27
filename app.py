import sqlite3
from flask import Flask, jsonify, request, render_template

app = Flask(__name__)
DB_NAME = "oncobridge.db"

def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/doctors', methods=['GET'])
def get_doctors():
    specialty = request.args.get('specialty')
    location = request.args.get('location')
    
    conn = get_db_connection()
    query = 'SELECT * FROM doctors WHERE 1=1'
    params = []
    
    if specialty:
        query += ' AND specialty LIKE ?'
        params.append(f'%{specialty}%')
    
    if location:
        query += ' AND location LIKE ?'
        params.append(f'%{location}%')
        
    doctors = conn.execute(query, params).fetchall()
    conn.close()
    
    return jsonify([dict(doc) for doc in doctors])

@app.route('/api/doctors/specialties', methods=['GET'])
def get_specialties():
    conn = get_db_connection()
    specialties = conn.execute('SELECT DISTINCT specialty FROM doctors ORDER BY specialty').fetchall()
    conn.close()
    return jsonify([row['specialty'] for row in specialties])

@app.route('/api/doctors/<int:id>', methods=['GET'])
def get_doctor(id):
    conn = get_db_connection()
    doctor = conn.execute('SELECT * FROM doctors WHERE id = ?', (id,)).fetchone()
    conn.close()
    if doctor is None:
        return jsonify({'error': 'Doctor not found'}), 404
    return jsonify(dict(doctor))

@app.route('/api/posts', methods=['GET'])
def get_posts():
    lang = request.args.get('lang', 'en')
    conn = get_db_connection()
    posts = conn.execute('SELECT * FROM posts WHERE language = ? ORDER BY timestamp DESC', (lang,)).fetchall()
    conn.close()
    return jsonify([dict(post) for post in posts])

@app.route('/api/posts', methods=['POST'])
def create_post():
    data = request.json
    author_name = data.get('author_name', 'Anonymous')
    content = data.get('content')
    language = data.get('language', 'en')
    
    if not content:
        return jsonify({'error': 'Content is required'}), 400
        
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO posts (author_name, content, language) VALUES (?, ?, ?)',
        (author_name, content, language)
    )
    conn.commit()
    new_id = cursor.lastrowid
    
    post = conn.execute('SELECT * FROM posts WHERE id = ?', (new_id,)).fetchone()
    conn.close()
    
    return jsonify(dict(post)), 201

if __name__ == '__main__':
    app.run(debug=True, port=5000)
