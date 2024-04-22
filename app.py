from flask import Flask, render_template, jsonify, request
import pyodbc
from datetime import datetime, timedelta

app = Flask(__name__)

# Define connection parameters
server = 'mchairtest.database.windows.net'
database = 'MChairTest'
username = 'test'
password = 'Mchair123'
driver= '{ODBC Driver 18 for SQL Server}'

def get_db_connection():
    return pyodbc.connect(f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/save_transaction', methods=['POST'])
def save_transaction():
    try:
        # Parse request JSON data
        data = request.json
        print(data)
        # Extract transaction details from JSON
        mc_id = data.get('mc_id')
        duration_minutes = data.get('duration') # Duration in minutes passed from API
        # start_time = datetime.now() + timedelta(seconds=5)  # Start time is the current time
        start_time = datetime.now() + timedelta(seconds=5) + timedelta(hours=8)
        stop_time = start_time + timedelta(minutes=duration_minutes) # Calculate stop time
        amount = data.get('amount')
        print(mc_id, duration_minutes, start_time, stop_time)
        # Insert data into the database
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("INSERT INTO [Transaction] (MC_ID, StartTime, StopTime, Amount, Duration) VALUES (?, ?, ?, ?, ?)",
                           (mc_id, start_time, stop_time, amount, duration_minutes)) # Assuming amount is not provided in the API
            conn.commit()

        return jsonify({'StopTime': stop_time.strftime("%Y-%m-%d %H:%M:%S"),'message': 'Transaction saved successfully'}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500


@app.route('/api/update_transaction/<ID>', methods=['POST'])
def update_transaction(ID):
    try:
        stop_time = datetime.now() + timedelta(hours=8)
        # Insert data into the database
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("UPDATE [Transaction] SET StopTime = ? WHERE MC_ID = ? AND StartTime = (SELECT TOP 1 StartTime FROM [Transaction] WHERE MC_ID = ? ORDER BY StartTime DESC)",
                           (stop_time, ID, ID))
            conn.commit()

        return jsonify({'message': 'Transaction updated successfully'}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

# Define route for /api/MC/<ID> endpoint
@app.route('/api/MC/<ID>')
def get_data_by_id(ID):
    try:
        # Establish connection to the database
        conn = pyodbc.connect('DRIVER='+driver+';SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password)
        cursor = conn.cursor()

        # Execute SQL query to fetch data for the specified ID
        cursor.execute("SELECT * FROM MCLocation WHERE ID = ?", ID)
        row = cursor.fetchone()

        # If row is found, format data as a dictionary
        if row:
            data = {
                'ID': row[0],
                'Name': row[1],
                'Description': row[2],
                'Model': row[3],
                'LastHeartBeat': row[4].strftime("%Y-%m-%d %H:%M:%S") if row[4] else None
            }
            print(data)
            return jsonify(data)
        else:
            return jsonify({'error': 'ID not found'})

    except Exception as e:
        return jsonify({'error': str(e)})

    finally:
        # Close the database connection
        conn.close()

# Define route for /api/trans/<ID> endpoint
@app.route('/api/trans/<ID>')
def get_trans_by_id(ID):
    try:
        # Establish connection to the database
        conn = pyodbc.connect('DRIVER='+driver+';SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password)
        cursor = conn.cursor()

        # Execute SQL query to fetch data for the specified ID
        cursor.execute("SELECT TOP 1 * FROM [Transaction] WHERE MC_ID = ? ORDER BY StartTime DESC", (ID,))
        row = cursor.fetchone()
        print(row)
        # If row is found, format data as a dictionary
        if row:
            data = {
                'TransactionID': row[0],
                'MC_ID': row[1],
                'StartTime': row[2].strftime("%Y-%m-%d %H:%M:%S") if row[2] else None,
                'StopTime': row[3].strftime("%Y-%m-%d %H:%M:%S") if row[3] else None,
                'Amount': row[4],
                'Duration': row[5]
            }
            print(data)
            return jsonify(data)
        else:
            return jsonify({'error': 'ID not found'})

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)})

    finally:
        # Close the database connection
        conn.close()

# Define route for /api/trans/<ID> endpoint
@app.route('/api/inv/<ID>')
def get_inv_by_id(ID):
    try:
        # Establish connection to the database
        conn = pyodbc.connect('DRIVER='+driver+';SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password)
        cursor = conn.cursor()

        # Execute SQL query to fetch data for the specified ID
        cursor.execute("SELECT TOP 1 t.*, l.Name, 'MC' + CONVERT(VARCHAR(4), YEAR(t.StartTime)) + RIGHT('0000000' + CONVERT(VARCHAR(7), t.TransactionID), 7) AS CustomTransactionID FROM [Transaction] t JOIN MCLocation l ON t.MC_ID = l.ID WHERE MC_ID = ? ORDER BY t.StartTime DESC;", (ID,))
        row = cursor.fetchone()
        print(row)
        # If row is found, format data as a dictionary
        if row:
            data = {
                'TransactionID': row[0],
                'MC_ID': row[1],
                'StartTime': row[2].strftime("%Y-%m-%d %H:%M:%S") if row[2] else None,
                'StopTime': row[3].strftime("%Y-%m-%d %H:%M:%S") if row[3] else None,
                'Amount': row[4],
                'Duration': row[5],
                'Name': row[6],
                'CustomTransactionID': row[7]
            }
            print(data)
            return jsonify(data)
        else:
            return jsonify({'error': 'ID not found'})

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)})

    finally:
        # Close the database connection
        conn.close()

if __name__ == '__main__':
    app.run(debug=True)
