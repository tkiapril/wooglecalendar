"""
Derived from https://github.com/clicheio/cliche/blob/master/setup.py

"""

import distutils.core
import distutils.errors
import os.path
import sys
import warnings

try:
    from setuptools import setup, find_packages
except ImportError:
    from ez_setup import use_setuptools
    use_setuptools()
    from setuptools import setup, find_packages


if sys.version_info < (3, 3, 0):
    warnings.warn(
        'WoogleCalendar requires Python 3.3 or higher; the currently running '
        'Python version is: ' + sys.version
    )


def readme():
    try:
        with open(os.path.join(os.path.dirname(__file__), 'README.rst')) as f:
            return f.read()
    except (IOError, OSError):
        return ''


install_requires = {
    # Entity classes
    'SQLAlchemy >= 0.9.0',
    'alembic >= 0.6.0',
    # Configuration
    'PyYAML >= 3.10',
    # Web
    'Flask >= 0.10',
    'Werkzeug >= 0.9',
    'Flask-Script >= 0.6.0'
}


class BaseAlembicCommand(distutils.core.Command):
    """Base class for commands provided by Alembic."""

    user_options = [
        ('config=', 'c', 'Configuration file (YAML or Python)'),
        ('debug', 'd', 'Print debug logs'),
    ]

    def initialize_options(self):
        self.config = None
        self.debug = False

    def finalize_options(self):
        if self.config is None:
            try:
                self.config = os.environ['WOOGLECALENDAR_CONFIG']
            except KeyError:
                raise distutils.errors.DistutilsOptionError(
                    'The -c/--config option or WOOGLECALENDAR_CONFIG '
                    'environment variable is required'
                )
        if not os.path.isfile(self.config):
            raise distutils.errors.DistutilsOptionError(
                self.config + ' cannot be found'
            )

    def run(self):
        try:
            from cliche.cli import get_database_engine, initialize_app
            from cliche.orm import Base, get_alembic_config, import_all_modules
            import_all_modules()
        except ImportError as e:
            raise ImportError('dependencies are not resolved yet; run '
                              '"pip install -e ." first\n' + str(e))
        if self.debug:
            print('These mapping classes are loaded into ORM registry:',
                  file=sys.stderr)
            for cls in Base._decl_class_registry.values():
                if isinstance(cls, type):
                    print('- {0.__module__}.{0.__name__}'.format(cls),
                          file=sys.stderr)
        app = initialize_app(self.config)
        with app.app_context():
            engine = get_database_engine()
        config = get_alembic_config(engine)
        self.alembic_process(config)

    def alembic_process(self, config):
        raise NotImplementedError('override alembic_process() method')


class revision(BaseAlembicCommand):
    """Adds a new revision to the database migration history."""

    description = __doc__
    user_options = BaseAlembicCommand.user_options + [
        ('message=', 'm', 'Message string'),
        ('autogenerate', None, 'Populates revision script with candidate '
                               'migration operations, based on comparison '
                               'of database to model.')
    ]

    def initialize_options(self):
        BaseAlembicCommand.initialize_options(self)
        self.message = None
        self.autogenerate = False

    def alembic_process(self, config):
        from alembic.command import revision
        revision(config, self.message, self.autogenerate)


class history(BaseAlembicCommand):
    """List revisions of the database migration history."""

    description = __doc__

    def alembic_process(self, config):
        from alembic.command import history
        history(config)


cmdclass = {}

try:
    __import__('alembic')
except ImportError:
    pass
else:
    cmdclass.update(
        revision=revision,
        history=history
    )


setup(
    name='WoogleCalendar',
    description='A social calender bulletin board combination',
    long_description=readme(),
    author='WoogleCalendar',
    license='AGPLv3 or later',
    packages=find_packages(),
    zip_safe=False,
    entry_points='''
        [console_scripts]
        wooglecalendar = wooglecalendar.cli:main
    ''',
    install_requires=install_requires,
    cmdclass=cmdclass,
    classifiers=[
        'Development Status :: 1 - Planning',
        'Environment :: Web Environment',
        'Intended Audience :: End Users/Desktop',
        'License :: OSI Approved ::'
        ' GNU Affero General Public License v3 or later (AGPLv3+)',
        'Operating System :: MacOS :: MacOS X',
        'Operating System :: POSIX :: Linux',
        'Programming Language :: Python :: 3.3',
        'Programming Language :: Python :: Implementation :: CPython',
        'Topic :: Database',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content :: Message Boards',
        'Topic :: Internet :: WWW/HTTP :: Session',
        'Topic :: Internet :: WWW/HTTP :: WSGI :: Application'
    ]
)
