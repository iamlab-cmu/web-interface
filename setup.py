"""
FrankaPy Franka Panda Robot Control Wrapper
"""
from setuptools import setup

requirements = [
    'autolab_core',
    'perception',
    'numpy-quaternion',
    'numba',
    'rospkg',
    'catkin-tools',
    'protobuf'
]

setup(name='web-interface',
      version='0.0.0',
      description='IAM Lab Web Interface',
      author='Siddhartha Girdhar, Kevin Zhang',
      author_email='',
      package_dir = {'': '.'},
      packages=['interface'],
      install_requires = requirements,
      extras_require = {}
     )
