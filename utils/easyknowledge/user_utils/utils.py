from ..pdf_processing.pdf import PDFReader, EpubReader
import random

def create_test(qa_count, highlights):
    if len(highlights) < qa_count:
        qa_count = len(highlights)
    if qa_count == 0:
        return []
    qa = random.sample(highlights, qa_count)
    return qa