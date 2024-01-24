from setuptools import find_packages, setup

with open('requirements.txt') as f:
    requirements = f.read().splitlines()

setup(
    name='easyknowledge',
    packages=find_packages(),
    version='0.1.0',
    description='',
    author='EasyKnowledge Team',
    install_requires=requirements,
)