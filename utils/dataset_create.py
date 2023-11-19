from pathlib import Path
from pdf_processing.pdf import extract_paragraphs_from_page
import os

lang_folder = Path(os.path.dirname(os.path.realpath(__file__))) / 'dataset_processing' / 'dataset_data'
lang_folders = [x for x in lang_folder.iterdir() if x.is_dir()]
books = {lang.name: [book for book in lang.iterdir() if book.is_file()] for lang in lang_folders}

# print(books['en'][0])

print(extract_paragraphs_from_page(books['en'][0], 101))