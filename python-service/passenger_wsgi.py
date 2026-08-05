import sys
import os
import subprocess

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPT_DIR not in sys.path:
    sys.path.insert(0, SCRIPT_DIR)

# Auto-heal: Ensure setuptools and required dependencies are available
try:
    import pkg_resources
except ImportError:
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "setuptools<70"])
    except Exception as e:
        print(f"Failed to auto-install setuptools: {e}")

try:
    from a2wsgi import ASGIMiddleware
    from main import app as fastapi_app
    application = ASGIMiddleware(fastapi_app)
except Exception as e:
    import traceback
    error_msg = traceback.format_exc()
    
    # Write startup error to log file inside application root
    try:
        with open(os.path.join(SCRIPT_DIR, "startup_error.log"), "w") as f:
            f.write(error_msg)
    except Exception:
        pass

    # WSGI error handler that prints the exact trace
    def application(environ, start_response):
        status = '500 Internal Server Error'
        headers = [('Content-Type', 'text/plain; charset=utf-8')]
        start_response(status, headers)
        return [f"ANTHEM BACKEND STARTUP ERROR:\n\n{error_msg}".encode('utf-8')]
