import os

from app import create_app, db
from app.models import Permission, User, Task, Role, Subtask, Family
from flask_migrate import Migrate, upgrade

COV = None
if os.environ.get('FLASK_COVERAGE'):
    import coverage
    COV = coverage.coverage(branch=True, include='app/*')
    COV.start()

import sys, click

# Create the app context.
app = create_app(os.getenv('FLASK_CONFIG') or 'default')

# Creates migration scripts.
migrate = Migrate(app,db)

# Create app context for flask shell
@app.shell_context_processor
def make_shell_context():
    return dict(db=db, User=User, Role=Role, Permission=Permission,
                Task=Task, Subtask=Subtask, Family=Family)

# Runs application tests.
@app.cli.command()
def test():
    """Run the unit tests."""

    import unittest

    tests = unittest.TestLoader().discover('tests')
    unittest.TextTestRunner(verbosity=2).run(tests)


# Deploys the application
@app.cli.command()
def deploy():
    """Run deployment tasks."""

    try:
        User.query.all()
    except:
        db.create_all()

    # Migrate the database to the latest revision
    upgrade()

    # Create/update user roles
    Role.insert_roles()

@app.cli.command()
@click.option('--coverage/--no-coverage',default=False,
    help='Run tests under code coverage.')
def test(coverage):
    """Run the unit tests"""
    if coverage and not os.environ.get('FLASK_COVERAGE'):
        os.environ['FLASK_COVERAGE'] = '1'
        os.execvp(sys.executable,[sys.executable] + sys.argv)
    import unittest
    tests = unittest.TestLoader().discover('tests')
    unittest.TextTestRunner(verbosity=2).run(tests)
    if COV:
        COV.stop()
        COV.save()
        print('Coverage Summary:')
        COV.report()
        basedir = os.path.abspath(os.path.dirname(__file__))
        covdir = os.path.join(basedir, 'tmp/coverage')
        COV.html_report(directory=covdir)
        print('HTML version: file://%s/index.html' % covdir)
        COV.erase()
