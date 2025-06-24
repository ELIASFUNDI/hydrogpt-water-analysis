#!/usr/bin/env python3
"""
Simple database connection test for HydroGPT
Tests connection to PostgreSQL on Windows from WSL
"""

import socket
import sys

def test_postgres_connection():
    """Test if PostgreSQL is accessible"""
    host = "172.26.16.1"
    port = 5432
    
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)
        result = sock.connect_ex((host, port))
        sock.close()
        
        if result == 0:
            print(f"✅ PostgreSQL at {host}:{port} is accessible")
            return True
        else:
            print(f"❌ Cannot connect to PostgreSQL at {host}:{port}")
            return False
            
    except Exception as e:
        print(f"❌ Connection test failed: {e}")
        return False

def test_python_imports():
    """Test if required Python modules are available"""
    required_modules = ['asyncpg', 'fastapi', 'anthropic', 'uvicorn']
    missing = []
    
    for module in required_modules:
        try:
            __import__(module)
            print(f"✅ {module} is available")
        except ImportError:
            print(f"❌ {module} is missing")
            missing.append(module)
    
    return missing

def test_database_auth():
    """Test database connection with authentication"""
    try:
        import psycopg2
        conn = psycopg2.connect(
            host="172.26.16.1",
            port=5432,
            database="hydrogpt",
            user="postgres", 
            password="@92201418Ef"
        )
        conn.close()
        print("✅ Database authentication successful")
        return True
    except ImportError:
        print("❌ psycopg2 not available for auth test")
        return None
    except Exception as e:
        print(f"❌ Database authentication failed: {e}")
        return False

if __name__ == "__main__":
    print("🔍 HydroGPT Connection Test")
    print("=" * 40)
    
    # Test database connection
    db_ok = test_postgres_connection()
    
    print("\n🔐 Database Authentication Test")
    print("=" * 40)
    
    # Test database authentication
    auth_ok = test_database_auth()
    
    print("\n🐍 Python Dependencies Test")
    print("=" * 40)
    
    # Test Python imports
    missing = test_python_imports()
    
    print("\n📋 Summary")
    print("=" * 40)
    
    if db_ok:
        print("✅ Database connection: READY")
    else:
        print("❌ Database connection: FAILED")
        print("   → Configure PostgreSQL on Windows to accept WSL connections")
    
    if auth_ok is True:
        print("✅ Database authentication: READY")
    elif auth_ok is False:
        print("❌ Database authentication: FAILED")
        print("   → Check credentials: postgres/@92201418Ef")
    else:
        print("⚠️  Database authentication: Cannot test (psycopg2 not available)")
    
    if not missing:
        print("✅ Python dependencies: READY")
    else:
        print(f"❌ Python dependencies: {len(missing)} missing")
        print(f"   → Missing: {', '.join(missing)}")
        print("   → Install with: pip install " + " ".join(missing))
    
    if db_ok and not missing and auth_ok is not False:
        print("\n🚀 Ready to start HydroGPT backend!")
    else:
        print("\n⚠️  Configuration needed before starting backend")